import { signIn, signOut } from 'next-auth/react';
import type { LoyaltyMember } from '@/components/loyalty/useLoyaltyStore';

export type SignInPayload = {
  email:    string;
  password: string;
};

export type SignUpPayload = {
  name:     string;
  email:    string;
  phone:    string;
  birthday: string;   // ISO date e.g. "1995-08-15"
  password: string;
};

// ── Helpers ────────────────────────────────────────────────────────────────

async function fetchCurrentMember(): Promise<LoyaltyMember | null> {
  const res = await fetch('/api/loyalty/me');
  if (!res.ok) return null;
  const data = await res.json();
  return data.member ?? null;
}

// ── Sign In ────────────────────────────────────────────────────────────────
export async function loyaltySignIn(payload: SignInPayload): Promise<LoyaltyMember> {
  if (!payload.email || !payload.password) {
    throw new Error('Invalid email or password');
  }

  const result = await signIn('loyalty-credentials', {
    email:    payload.email,
    password: payload.password,
    redirect: false,
  });

  if (result?.error) {
    throw new Error(result.error);
  }

  const member = await fetchCurrentMember();
  if (!member) {
    throw new Error('Signed in, but the session could not be established');
  }

  return member;
}

// ── Sign Up ────────────────────────────────────────────────────────────────
export async function loyaltySignUp(payload: SignUpPayload): Promise<LoyaltyMember> {
  if (!payload.name || !payload.email || !payload.phone || !payload.birthday || !payload.password) {
    throw new Error('Please fill in all required fields');
  }

  // 1. Create the account via the signup API
  const res = await fetch('/api/loyalty/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Registration failed');
  }

  // 2. Auto sign-in with the same credentials
  const result = await signIn('loyalty-credentials', {
    email:    payload.email,
    password: payload.password,
    redirect: false,
  });

  if (result?.error) {
    throw new Error('Account created, but automatic sign-in failed — please sign in.');
  }

  // 3. Fetch the full member profile
  const member = await fetchCurrentMember();
  if (!member) {
    throw new Error('Account created but the session could not be established');
  }

  return member;
}

// ── Sign Out ───────────────────────────────────────────────────────────────
export async function loyaltySignOut(): Promise<void> {
  await signOut({ redirect: false });
}

// ── Points ─────────────────────────────────────────────────────────────────

export type AwardPointsResult = {
  awarded: boolean;
  /** Why nothing was credited — e.g. 'already-awarded', 'awaiting-payment'. */
  reason?: string;
  pointsEarned?: number;
  multiplier?: number;
  birthdayBonus?: boolean;
  totalPoints?: number;
  tier?: LoyaltyMember['tier'];
  previousTier?: LoyaltyMember['tier'];
  tierChanged?: boolean;
};

/**
 * Credit an order's loyalty points to the signed-in member.
 *
 * Only the order id crosses the wire — the server reads the spend from the
 * stored order, so this cannot be used to inflate a balance. Safe to call more
 * than once; repeat calls come back `awarded: false`.
 */
export async function awardOrderPoints(orderId: string): Promise<AwardPointsResult> {
  const res = await fetch('/api/loyalty/points', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to award loyalty points');
  }

  return res.json();
}

export type PointsPreview = {
  basePoints: number;
  multiplier: number;
  points: number;
  birthdayBonus: boolean;
};

/**
 * Points an order of `amount` rupees would earn, per the signed-in member's
 * own multipliers (e.g. their birthday month). `amount` should be the food
 * subtotal — the delivery fee is never included in the award.
 */
export async function previewOrderPoints(amount: number): Promise<PointsPreview | null> {
  const res = await fetch(`/api/loyalty/points?amount=${encodeURIComponent(amount)}`);
  if (!res.ok) return null;
  const data = await res.json();
  return (data.preview as PointsPreview | null) ?? null;
}

// ── Orders ─────────────────────────────────────────────────────────────────

export type LoyaltyOrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type LoyaltyOrderSummary = {
  _id: string;
  orderNumber: string;
  status: LoyaltyOrderStatus;
  type: 'delivery' | 'pickup';
  total: number;
  itemCount: number;
  paymentMethod?: string;
  createdAt: string;
};

/**
 * Every order placed while signed in is stamped with the member's id at
 * creation. This lists them, most recent first — the id crosses no wire, the
 * server reads the caller's own session. Guests (or a session that expired)
 * get an empty list rather than an error.
 */
export async function fetchMyOrders(): Promise<LoyaltyOrderSummary[]> {
  const res = await fetch('/api/loyalty/orders', { cache: 'no-store' });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.orders as LoyaltyOrderSummary[]) ?? [];
}