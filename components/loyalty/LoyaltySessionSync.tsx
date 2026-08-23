'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useLoyaltyStore } from './useLoyaltyStore';

/**
 * Reconciles the persisted (localStorage) loyalty `member` against the real
 * NextAuth session. Without this, the cached member survived indefinitely —
 * a cleared cookie, an expired session, or switching to an admin session in
 * the same browser all left the navbar/modal showing a stale "logged in"
 * member with a stale points balance. Mounted once, inside <SessionProvider>.
 */
export default function LoyaltySessionSync() {
  const { data: session, status } = useSession();
  const setMember = useLoyaltyStore((s) => s.setMember);
  const clearMember = useLoyaltyStore((s) => s.clearMember);

  // Tracks which session we've already fetched fresh data for, so a re-render
  // (e.g. the periodic refetch) doesn't refetch /api/loyalty/me every time.
  const syncedFor = useRef<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;

    const isLoyaltySession = status === 'authenticated' && session?.user?.accountType === 'loyalty';
    const sessionKey = isLoyaltySession ? session!.user!.id ?? null : null;

    if (!sessionKey) {
      // No session, an admin session, or a session that just isn't a loyalty
      // account — the cached member (if any) no longer corresponds to reality.
      clearMember();
      syncedFor.current = null;
      return;
    }

    if (syncedFor.current === sessionKey) return;

    fetch('/api/loyalty/me')
      .then((res) => (res.ok ? res.json() : { member: null }))
      .then((data) => {
        if (data.member) {
          setMember(data.member);
        } else {
          clearMember();
        }
        syncedFor.current = sessionKey;
      })
      .catch(() => {
        // Network hiccup — leave the cache as-is rather than logging the user
        // out client-side over a transient failure; the next status change
        // (focus refetch, interval refetch) will retry.
      });
  }, [status, session, setMember, clearMember]);

  return null;
}
