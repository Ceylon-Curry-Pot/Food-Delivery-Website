import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import LoyaltyMember, { generateMemberNumber } from '@/lib/models/LoyaltyMember';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, birthday, password } = body;

    // ── Validation ───────────────────────────────────────────────────────
    if (!name || !email || !phone || !birthday || !password) {
      return NextResponse.json(
        { message: 'Please fill in all required fields' },
        { status: 400 }
      );
    }

    if (typeof password !== 'string' || password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // ── Check for existing email ─────────────────────────────────────────
    const existing = await LoyaltyMember.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { message: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // ── Hash password ────────────────────────────────────────────────────
    const passwordHash = await bcrypt.hash(password, 12);

    // ── Generate unique member number ────────────────────────────────────
    const memberNumber = await generateMemberNumber();

    // ── Create member ────────────────────────────────────────────────────
    await LoyaltyMember.create({
      name,
      email,
      phone,
      birthday,
      passwordHash,
      points: 100,         // Welcome bonus
      tier: 'Clove',
      memberSince: new Date(),
      memberNumber,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: unknown) {
    // Handle duplicate key errors (race condition on email or memberNumber)
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      (error as { code: number }).code === 11000
    ) {
      return NextResponse.json(
        { message: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    console.error('[loyalty/signup] Unexpected error:', error);
    return NextResponse.json(
      { message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
