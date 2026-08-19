import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectToDatabase from '@/lib/mongodb';
import LoyaltyMember from '@/lib/models/LoyaltyMember';
import { awardLoyaltyPointsForOrder, reconcileMemberTier } from '@/lib/awardLoyaltyPoints';
import {
  BIRTHDAY_MONTH_MULTIPLIER,
  RUPEES_PER_POINT,
  TIER_THRESHOLDS,
  calculatePointsEarned,
  isBirthdayMonth,
} from '@/lib/loyaltyPoints';

/**
 * GET /api/loyalty/points
 * GET /api/loyalty/points?amount=4300
 *
 * Returns the earning rules plus the caller's current standing. With `amount`,
 * also previews what an order of that size would earn — useful for showing
 * "You'll earn N points" on the checkout page before the order is placed.
 */
export async function GET(req: Request) {
  const rules = {
    rupeesPerPoint: RUPEES_PER_POINT,
    birthdayMonthMultiplier: BIRTHDAY_MONTH_MULTIPLIER,
    tiers: TIER_THRESHOLDS,
  };

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.accountType !== 'loyalty') {
      return NextResponse.json({ rules, member: null });
    }

    await connectToDatabase();
    const member = await LoyaltyMember.findById(session.user.id).select('points tier birthday');
    if (!member) return NextResponse.json({ rules, member: null });

    // Self-heal any points/tier drift before reporting the standing back.
    const tier = await reconcileMemberTier(member._id.toString());

    const amountParam = new URL(req.url).searchParams.get('amount');
    const amount = amountParam === null ? null : Number(amountParam);
    const preview =
      amount !== null && Number.isFinite(amount) && amount >= 0
        ? calculatePointsEarned({ amount, birthday: member.birthday })
        : null;

    return NextResponse.json({
      rules,
      member: {
        points: member.points,
        tier,
        birthdayMonth: isBirthdayMonth(member.birthday),
      },
      preview,
    });
  } catch (error) {
    console.error('[GET /api/loyalty/points]', error);
    return NextResponse.json({ rules, member: null });
  }
}

/**
 * POST /api/loyalty/points  { orderId }
 *
 * Credits the order's points to the signed-in member and updates their tier.
 * The spend is read from the stored order — the body carries only an id, so a
 * caller cannot inflate its own balance. Safe to call more than once: repeat
 * calls report `awarded: false, reason: 'already-awarded'`.
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const memberId = session?.user?.id;
    if (!memberId || session?.user?.accountType !== 'loyalty') {
      return NextResponse.json(
        { message: 'You must be signed in to a loyalty account' },
        { status: 401 }
      );
    }

    const { orderId } = await req.json().catch(() => ({ orderId: undefined }));
    if (!orderId || typeof orderId !== 'string') {
      return NextResponse.json({ message: 'orderId is required' }, { status: 400 });
    }

    await connectToDatabase();
    const result = await awardLoyaltyPointsForOrder(orderId, { memberId });

    if (!result.awarded && result.reason === 'forbidden') {
      return NextResponse.json({ message: 'This order belongs to another member' }, { status: 403 });
    }
    if (!result.awarded && result.reason === 'order-not-found') {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('[POST /api/loyalty/points]', error);
    return NextResponse.json({ message: 'Failed to award loyalty points' }, { status: 500 });
  }
}
