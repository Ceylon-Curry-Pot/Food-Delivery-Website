// Centralized security-event logging. Every call site below funnels through
// here so the shape (timestamp, event, actor, action) stays consistent and a
// real sink (Sentry, Datadog, a Mongo capped collection, …) can be wired in
// later by changing just this one function — never log passwords, tokens, or
// full payment data in the `details` payload.

export type SecurityEvent =
  | 'login_failed'
  | 'account_locked'
  | 'permission_denied'
  | 'webhook_signature_invalid'
  | 'admin_action';

export function logSecurityEvent(event: SecurityEvent, details: Record<string, unknown> = {}) {
  console.warn(
    JSON.stringify({
      type: 'security',
      event,
      timestamp: new Date().toISOString(),
      ...details,
    })
  );
}
