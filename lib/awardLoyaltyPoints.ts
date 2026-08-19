import mongoose from 'mongoose';
import Order from '@/lib/models/Order';
import LoyaltyMember from '@/lib/models/LoyaltyMember';
import {
  calculatePointsEarned,
  getTierForPoints,
  type LoyaltyTierValue,
} from '@/lib/loyaltyPoints';

// ── Awarding loyalty points for an order ───────────────────────────────────
// Single entry point used by both award paths:
//   • COD    → POST /api/loyalty/points, called by the checkout page
//   • Card   → the PayHere notify webhook, once paymentStatus flips to 'paid'
//
// Two invariants matter here:
//   1. The spend is read from the order in the DB, never from the caller.
//   2. Crediting is once-only per order, even under concurrent calls.

export type AwardSkipReason =
  | 'no-member'        // order was placed without a signed-in loyalty account
  | 'forbidden'        // order belongs to a different member
  | 'already-awarded'  // points were credited by an earlier call
  | 'awaiting-payment' // card/wallet order not yet paid
  | 'cancelled'        // cancelled or failed order
  | 'order-not-found'
  | 'member-not-found';

export type AwardResult =
  | {
      awarded: true;
      pointsEarned: number;
      multiplier: number;
      birthdayBonus: boolean;
      /** Member's balance after crediting. */
      totalPoints: number;
      tier: LoyaltyTierValue;
      previousTier: LoyaltyTierValue;
      tierChanged: boolean;
    }
  | {
      awarded: false;
      reason: AwardSkipReason;
      /** Present when the member is known — lets callers still show a balance. */
      pointsEarned?: number;
      totalPoints?: number;
      tier?: LoyaltyTierValue;
    };

/**
 * An order earns points once it is actually committed:
 *   • Cash on delivery → immediately at checkout
 *   • Card / wallet    → only after PayHere confirms payment
 * Cancelled and failed orders never earn.
 */
function checkEligibility(order: {
  status: string;
  paymentMethod?: string;
  paymentStatus: string;
}): AwardSkipReason | null {
  if (order.status === 'cancelled') return 'cancelled';
  if (['failed', 'cancelled', 'charged_back'].includes(order.paymentStatus)) return 'cancelled';

  const isCashOnDelivery = order.paymentMethod === 'cod';
  if (!isCashOnDelivery && order.paymentStatus !== 'paid') return 'awaiting-payment';

  return null;
}

/**
 * Credit an order's loyalty points to its member and re-evaluate their tier.
 *
 * @param orderId   The order to credit.
 * @param requester When set, the award only proceeds if the order belongs to
 *                  this member. Pass the session member id from user-facing
 *                  routes; omit it for trusted server-side callers such as the
 *                  PayHere webhook.
 */
export async function awardLoyaltyPointsForOrder(
  orderId: string,
  requester?: { memberId: string }
): Promise<AwardResult> {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return { awarded: false, reason: 'order-not-found' };
  }

  const order = await Order.findById(orderId).select(
    'items status paymentMethod paymentStatus loyaltyMember loyaltyPointsAwarded'
  );
  if (!order) return { awarded: false, reason: 'order-not-found' };

  if (!order.loyaltyMember) return { awarded: false, reason: 'no-member' };

  // Ownership: a member may only claim their own orders.
  if (requester && order.loyaltyMember.toString() !== requester.memberId) {
    return { awarded: false, reason: 'forbidden' };
  }

  const memberId = order.loyaltyMember.toString();
  const member = await LoyaltyMember.findById(memberId).select('points tier birthday');
  if (!member) return { awarded: false, reason: 'member-not-found' };

  // Correct any points/tier drift up front, so a skipped or already-awarded
  // response never reports a stale tier alongside the current points.
  let standingTier = member.tier as LoyaltyTierValue;
  const expectedTier = getTierForPoints(member.points);
  if (expectedTier !== standingTier) {
    await LoyaltyMember.updateOne({ _id: memberId }, { $set: { tier: expectedTier } });
    standingTier = expectedTier;
  }

  const currentStanding = {
    totalPoints: member.points as number,
    tier: standingTier,
  };

  if (order.loyaltyPointsAwarded != null) {
    return {
      awarded: false,
      reason: 'already-awarded',
      pointsEarned: order.loyaltyPointsAwarded,
      ...currentStanding,
    };
  }

  const ineligible = checkEligibility(order);
  if (ineligible) return { awarded: false, reason: ineligible, ...currentStanding };

  // Spend is the food subtotal only — the delivery fee doesn't earn points —
  // and it's computed from the stored order items, never supplied by the caller.
  const foodSubtotal = order.items.reduce(
    (sum: number, item: { qty: number; price: number }) => sum + item.qty * item.price,
    0
  );
  const { points, multiplier, birthdayBonus } = calculatePointsEarned({
    amount: foodSubtotal,
    birthday: member.birthday,
  });

  // Claim the order first. The `null` filter matches missing-or-null, so only
  // one concurrent caller can transition it — that call owns the credit.
  const claimed = await Order.findOneAndUpdate(
    { _id: order._id, loyaltyPointsAwarded: null },
    { $set: { loyaltyPointsAwarded: points, loyaltyPointsAwardedAt: new Date() } },
    { new: true }
  );

  if (!claimed) {
    // Lost the race — another call is crediting these points.
    return { awarded: false, reason: 'already-awarded', ...currentStanding };
  }

  try {
    const updated = await LoyaltyMember.findByIdAndUpdate(
      memberId,
      { $inc: { points } },
      { new: true }
    ).select('points tier');

    if (!updated) throw new Error(`Loyalty member ${memberId} vanished mid-award`);

    const previousTier = currentStanding.tier;
    const nextTier = getTierForPoints(updated.points);

    // updateOne rather than doc.save() — the doc is partially selected, and a
    // targeted $set avoids revalidating fields we never loaded.
    if (nextTier !== updated.tier) {
      await LoyaltyMember.updateOne({ _id: memberId }, { $set: { tier: nextTier } });
    }

    return {
      awarded: true,
      pointsEarned: points,
      multiplier,
      birthdayBonus,
      totalPoints: updated.points,
      tier: nextTier,
      previousTier,
      tierChanged: nextTier !== previousTier,
    };
  } catch (error) {
    // Release the claim so a retry can credit the member properly, rather than
    // leaving the order marked as awarded with no points actually granted.
    await Order.updateOne(
      { _id: order._id },
      { $unset: { loyaltyPointsAwarded: '', loyaltyPointsAwardedAt: '' } }
    ).catch((rollbackError) => {
      console.error('[loyalty] Failed to roll back award claim', order._id, rollbackError);
    });
    throw error;
  }
}

export type RevertResult =
  | {
      reverted: true;
      pointsReverted: number;
      totalPoints: number;
      tier: LoyaltyTierValue;
      previousTier: LoyaltyTierValue;
      tierChanged: boolean;
    }
  | {
      reverted: false;
      reason: 'no-award' | 'order-not-found' | 'member-not-found';
    };

/**
 * Claw back the points an order earned — called when an admin cancels an
 * order that had already been credited (COD orders earn at checkout, before
 * the admin ever sees them, so cancellation can happen after the fact).
 *
 * Idempotent and race-safe by the same claim pattern as the award itself:
 * `loyaltyPointsAwarded` is only cleared by whichever call wins the update, so
 * calling this twice — or concurrently with another revert — reverts once.
 * A member's balance is clamped at 0 rather than going negative.
 */
export async function revertLoyaltyPointsForOrder(orderId: string): Promise<RevertResult> {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return { reverted: false, reason: 'order-not-found' };
  }

  const order = await Order.findById(orderId).select('loyaltyMember loyaltyPointsAwarded');
  if (!order) return { reverted: false, reason: 'order-not-found' };
  if (!order.loyaltyMember || order.loyaltyPointsAwarded == null) {
    return { reverted: false, reason: 'no-award' };
  }

  // Claim the revert first — mirrors the award's claim, so a concurrent call
  // (or a retried request) can't revert the same order's points twice.
  const claimed = await Order.findOneAndUpdate(
    { _id: order._id, loyaltyPointsAwarded: { $ne: null } },
    {
      $set: { loyaltyPointsRevoked: order.loyaltyPointsAwarded, loyaltyPointsRevokedAt: new Date() },
      $unset: { loyaltyPointsAwarded: '', loyaltyPointsAwardedAt: '' },
    },
    { new: false } // return the pre-update doc so we still have the award amount
  );

  if (!claimed) {
    // Lost the race — another call already reverted (or is reverting) this order.
    return { reverted: false, reason: 'no-award' };
  }

  const pointsReverted = claimed.loyaltyPointsAwarded!;
  const memberId = order.loyaltyMember.toString();

  const member = await LoyaltyMember.findById(memberId).select('points tier');
  if (!member) return { reverted: false, reason: 'member-not-found' };

  const previousTier = member.tier as LoyaltyTierValue;
  const newPoints = Math.max(0, member.points - pointsReverted);
  const nextTier = getTierForPoints(newPoints);

  await LoyaltyMember.updateOne(
    { _id: memberId },
    { $set: { points: newPoints, tier: nextTier } }
  );

  return {
    reverted: true,
    pointsReverted,
    totalPoints: newPoints,
    tier: nextTier,
    previousTier,
    tierChanged: nextTier !== previousTier,
  };
}

/**
 * Points and tier can drift apart — an admin editing points by hand, a manual
 * DB fix, a bug in an earlier release — since `tier` is a stored field derived
 * from `points`, not computed on read. Call this wherever a member's standing
 * is served (`/api/loyalty/me`, the points preview route) so any drift is
 * caught and corrected in the background rather than silently shown to the user.
 *
 * Returns the tier the member should be on; updates the DB only if it disagrees
 * with what's stored.
 */
export async function reconcileMemberTier(memberId: string): Promise<LoyaltyTierValue> {
  const member = await LoyaltyMember.findById(memberId).select('points tier');
  if (!member) throw new Error(`Loyalty member ${memberId} not found`);

  const expectedTier = getTierForPoints(member.points);
  if (expectedTier !== member.tier) {
    console.warn(
      `[loyalty] Correcting tier drift for member ${memberId}: ${member.tier} -> ${expectedTier} (${member.points} pts)`
    );
    await LoyaltyMember.updateOne({ _id: memberId }, { $set: { tier: expectedTier } });
  }

  return expectedTier;
}
