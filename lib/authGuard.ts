import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';
import { logSecurityEvent } from '@/lib/securityLog';

type SessionUser = {
  id?: string;
  role?: string;
  accountType?: string;
  email?: string | null;
};

type GuardResult =
  | { user: SessionUser; response: null }
  | { user: null; response: NextResponse };

function unauthorized(req: Request, reason: string) {
  logSecurityEvent('permission_denied', { path: new URL(req.url).pathname, reason });
  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}

function forbidden(req: Request, reason: string, userId?: string) {
  logSecurityEvent('permission_denied', { path: new URL(req.url).pathname, reason, userId });
  return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
}

/** Rejects a state-changing request whose Origin header doesn't match our own —
 *  defense in depth on top of the SameSite=Lax session cookie, which already
 *  blocks cross-site fetch/POST from carrying the cookie in the first place. */
function originIsTrusted(req: Request): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return true; // same-origin navigations/tools that omit Origin

  const allowed = process.env.NEXTAUTH_URL || new URL(req.url).origin;
  try {
    return new URL(origin).origin === new URL(allowed).origin;
  } catch {
    return false;
  }
}

/**
 * Reads the caller's admin session without enforcing anything or logging a
 * denial — for routes that behave differently for admins vs. anonymous
 * callers but treat "anonymous" as a normal, expected case (e.g. the public
 * staff sign-up form) rather than a rejected request.
 */
export async function getAdminSession(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions);
  const user = session?.user as SessionUser | undefined;
  return user?.accountType === 'admin' ? user : null;
}

/**
 * Guards admin-surface API routes. Mirrors the access rule the /admin
 * dashboard layout already enforces: a signed-in admin, or a signed-in staff
 * member who is currently approved (re-checked against the DB, since staff
 * approval isn't carried in the JWT and can be revoked mid-session).
 */
export async function requireAdmin(req: Request): Promise<GuardResult> {
  if (!originIsTrusted(req)) {
    return { user: null, response: forbidden(req, 'cross-origin') };
  }

  const session = await getServerSession(authOptions);
  const user = session?.user as SessionUser | undefined;

  if (!user || user.accountType !== 'admin') {
    return { user: null, response: unauthorized(req, 'no-session') };
  }

  if (user.role === 'staff') {
    await connectToDatabase();
    const dbUser = user.email ? await User.findOne({ email: user.email }).lean() : null;
    if (!dbUser || !(dbUser as { approved?: boolean }).approved) {
      return { user: null, response: forbidden(req, 'not-approved', user.id) };
    }
  }

  return { user, response: null };
}

/** Stricter guard for sensitive operations (approving/removing accounts): admin role only. */
export async function requireAdminRole(req: Request): Promise<GuardResult> {
  const result = await requireAdmin(req);
  if (result.response) return result;

  if (result.user.role !== 'admin') {
    return { user: null, response: forbidden(req, 'insufficient-role', result.user.id) };
  }

  return result;
}
