// Server-side sanitization for free-text fields a user submits and that are
// later rendered back (loyalty dashboard, admin orders table, emails, etc).
// React escapes text nodes automatically, but nothing stops that raw value
// from later reaching dangerouslySetInnerHTML, an email template, a PDF, or
// another surface that doesn't — so untrusted input is stripped at the point
// it's written to the database, not just at the point it's displayed.

const HTML_TAG_RE = /<[^>]*>/g;
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS_RE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;

/** Strip HTML tags/control characters, trim, and cap length. */
export function sanitizeText(input: unknown, maxLength = 200): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(HTML_TAG_RE, '')
    .replace(CONTROL_CHARS_RE, '')
    .trim()
    .slice(0, maxLength);
}

/** Same as sanitizeText, but preserves internal newlines (for notes/addresses). */
export function sanitizeMultiline(input: unknown, maxLength = 1000): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(HTML_TAG_RE, '')
    .replace(/[^\S\n]+/g, (m) => m.replace(CONTROL_CHARS_RE, ''))
    .replace(CONTROL_CHARS_RE, '')
    .trim()
    .slice(0, maxLength);
}

export function sanitizeEmail(input: unknown): string {
  return sanitizeText(input, 254).toLowerCase();
}

/** Escape regex metacharacters so user-supplied search text can't build an arbitrary/ReDoS-prone pattern. */
export function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
