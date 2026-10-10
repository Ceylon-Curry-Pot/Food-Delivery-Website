import { logSecurityEvent } from '@/lib/securityLog';

const MAX_ATTEMPTS = 5;
const LOCK_MS = 15 * 60 * 1000;

type LockableDoc = {
  email: string;
  failedLoginAttempts?: number;
  lockUntil?: Date | null;
  save: () => Promise<unknown>;
};

export function isLocked(doc: LockableDoc): boolean {
  return !!doc.lockUntil && doc.lockUntil.getTime() > Date.now();
}

export function lockRemainingMs(doc: LockableDoc): number {
  return doc.lockUntil ? Math.max(0, doc.lockUntil.getTime() - Date.now()) : 0;
}

/** Bumps the failed-attempt counter and locks the account for LOCK_MS once MAX_ATTEMPTS is hit. */
export async function registerFailedLogin(doc: LockableDoc, context: string) {
  const attempts = (doc.failedLoginAttempts ?? 0) + 1;
  doc.failedLoginAttempts = attempts;

  if (attempts >= MAX_ATTEMPTS) {
    doc.lockUntil = new Date(Date.now() + LOCK_MS);
    doc.failedLoginAttempts = 0;
    logSecurityEvent('account_locked', { context, email: doc.email, lockMinutes: LOCK_MS / 60000 });
  }

  await doc.save();
}

export async function clearFailedLogins(doc: LockableDoc) {
  if (doc.failedLoginAttempts || doc.lockUntil) {
    doc.failedLoginAttempts = 0;
    doc.lockUntil = null;
    await doc.save();
  }
}
