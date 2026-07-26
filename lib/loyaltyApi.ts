// ── Loyalty API abstraction layer ──────────────────────────────────────────
// The backend developer only needs to touch this file.
// Replace each mock implementation with a real fetch() call to your endpoints.

import type { LoyaltyMember } from '@/components/loyalty/useLoyaltyStore';

export type SignInPayload = {
  email: string;
  password: string;
};

export type SignUpPayload = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

// ── Sign In ────────────────────────────────────────────────────────────────
// TODO (backend): Replace with → POST /api/loyalty/signin
export async function loyaltySignIn(payload: SignInPayload): Promise<LoyaltyMember> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 1000));

  // ── MOCK — delete everything below and replace with: ──
  // const res = await fetch('/api/loyalty/signin', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // });
  // if (!res.ok) {
  //   const data = await res.json();
  //   throw new Error(data.message || 'Invalid email or password');
  // }
  // return res.json();

  if (!payload.email || !payload.password) throw new Error('Invalid email or password');

  return {
    id:           'demo-signin-' + Date.now(),
    name:         'Amal Perera',
    email:        payload.email,
    phone:        '077 828 2112',
    points:       1240,
    tier:         'Saffron',
    memberSince:  '2024-03-15T00:00:00.000Z',
    memberNumber: 'CCP-4721',
  };
}

// ── Sign Up ────────────────────────────────────────────────────────────────
// TODO (backend): Replace with → POST /api/loyalty/signup
export async function loyaltySignUp(payload: SignUpPayload): Promise<LoyaltyMember> {
  await new Promise((r) => setTimeout(r, 1200));

  // ── MOCK — delete everything below and replace with: ──
  // const res = await fetch('/api/loyalty/signup', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // });
  // if (!res.ok) {
  //   const data = await res.json();
  //   throw new Error(data.message || 'Registration failed. Email may already be in use.');
  // }
  // return res.json();

  if (!payload.name || !payload.email || !payload.phone || !payload.password) {
    throw new Error('Please fill in all required fields');
  }

  return {
    id:           'new-' + Date.now(),
    name:         payload.name,
    email:        payload.email,
    phone:        payload.phone,
    points:       100,   // Welcome bonus
    tier:         'Cinnamon',
    memberSince:  new Date().toISOString(),
    memberNumber: 'CCP-' + String(Math.floor(1000 + Math.random() * 9000)),
  };
}