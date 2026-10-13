import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import mongoose from 'mongoose';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';
import { logSecurityEvent } from '@/lib/securityLog';
import { can, isRole, type Permission, type Role } from '@/lib/permissions';

export type AdminUser = { id: string; name: string; email: string; role: Role };

type GuardResult =
  | { user: AdminUser; response: null }
  | { user: null; response: NextResponse };

/** Rejects a state-changing request whose Origin header doesn't match our own, as defence
 *  in depth on top of the SameSite=Lax session cookie. */
function originIsTrusted(req: Request): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return true; // same-origin navigations and tools that omit Origin

  const allowed = process.env.NEXTAUTH_URL || new URL(req.url).origin;
  try {
    return new URL(origin).origin === new URL(allowed).origin;
  } catch {
    return false;
  }
}

/**
 * Who is signed in as admin/staff right now? Reads the session, then confirms against
 * the database. The login token is a snapshot taken at sign-in, so the DATABASE decides
 * the current role, and a deleted or unapproved user is rejected even with a valid token.
 * Returns null for anonymous visitors and customer (loyalty) sessions.
 */
export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;

  if (!sessionUser || sessionUser.accountType !== 'admin' || !sessionUser.id) return null;
  if (!mongoose.Types.ObjectId.isValid(sessionUser.id)) return null;

  await connectToDatabase();
  const dbUser = (await User.findById(sessionUser.id)
    .select('name email role approved')
    .lean()) as { _id: unknown; name: string; email: string; role: string; approved?: boolean } | null;

  if (!dbUser || !isRole(dbUser.role)) return null;
  if (dbUser.role === 'staff' && !dbUser.approved) return null; // same rule as login

  return { id: String(dbUser._id), name: dbUser.name, email: dbUser.email, role: dbUser.role };
}

/** Use at the top of an API route:
 *    const { user, response } = await requirePermission(req, 'menu:manage');
 *    if (response) return response; */
export async function requirePermission(req: Request, permission: Permission): Promise<GuardResult> {
  const path = new URL(req.url).pathname;

  if (!originIsTrusted(req)) {
    logSecurityEvent('permission_denied', { path, reason: 'cross-origin' });
    return { user: null, response: NextResponse.json({ message: 'Forbidden' }, { status: 403 }) };
  }

  const user = await getCurrentAdmin();
  if (!user) {
    logSecurityEvent('permission_denied', { path, reason: 'no-session' });
    return { user: null, response: NextResponse.json({ message: 'Unauthorized' }, { status: 401 }) };
  }

  if (!can(user.role, permission)) {
    logSecurityEvent('permission_denied', {
      path, reason: 'insufficient-role', permission, userId: user.id, role: user.role,
    });
    return {
      user: null,
      response: NextResponse.json({ message: 'You do not have permission to do this' }, { status: 403 }),
    };
  }

  return { user, response: null };
}