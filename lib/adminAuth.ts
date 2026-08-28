import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';

export async function requireAdminSession() {
    const session = await getServerSession(authOptions);
    if (
        !session ||
        session.user.accountType !== 'admin'
    ) {
        return {
            session: null,
            error: NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 })
            };
        }
        return { session, error: null };
}