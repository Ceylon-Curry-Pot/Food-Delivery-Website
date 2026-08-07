import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectToDatabase from '@/lib/mongodb';
import LoyaltyMember from '@/lib/models/LoyaltyMember';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // No session or not a loyalty account → return null
    if (!session?.user || session.user.accountType !== 'loyalty') {
      return NextResponse.json({ member: null });
    }

    await connectToDatabase();

    // Fetch fresh data from DB (points/tier may have changed since JWT was issued)
    const member = await LoyaltyMember.findById(session.user.id);

    if (!member) {
      return NextResponse.json({ member: null });
    }

    return NextResponse.json({
      member: {
        id:           member._id.toString(),
        name:         member.name,
        email:        member.email,
        phone:        member.phone,
        birthday:     member.birthday,
        points:       member.points,
        tier:         member.tier,
        memberSince:  member.memberSince.toISOString(),
        memberNumber: member.memberNumber,
      },
    });
  } catch (error) {
    console.error('[loyalty/me] Unexpected error:', error);
    return NextResponse.json({ member: null });
  }
}
