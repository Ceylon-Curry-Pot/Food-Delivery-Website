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