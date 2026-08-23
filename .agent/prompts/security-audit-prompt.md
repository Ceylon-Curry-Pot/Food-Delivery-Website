# Security Hardening Audit — Prompt for AI Coding Assistant

Paste this into Claude Code (or any AI coding assistant with repo access) to run a full security pass on the project.

---

## Prompt

You are performing a security hardening audit on this codebase. Go through the checklist below **one item at a time**. For each item:

1. Search the codebase for the relevant files.
2. Report the current state (present / missing / partially implemented).
3. Implement or fix it, following the notes under each item.
4. Show me the diff before moving to the next item — do not batch all changes into one giant commit.

Stack context: Next.js (App Router) + TypeScript, MongoDB, NextAuth.js v5, Tailwind, PayHere payment gateway, Cloudflare R2 for file storage. Adjust the specifics below to fit whatever you actually find, but flag anything that doesn't apply instead of silently skipping it.

### Transport & headers
- [ ] **HSTS** — add `Strict-Transport-Security` header (via `next.config.js` headers or middleware), `max-age=63072000; includeSubDomains; preload`.
- [ ] **Secure cookie flags** — all cookies (session, CSRF, auth) must set `Secure`, `HttpOnly`, and `SameSite=Lax` or `Strict` as appropriate. Check NextAuth cookie config explicitly.
- [ ] **Lock down CORS** — no wildcard `*` origins on any API route or middleware. Explicit allow-list of origins, and only the methods/headers actually needed.
- [ ] **Disable directory listing** — confirm no static file serving exposes directory indexes (check `next.config.js`, any custom static routes, and R2 bucket public listing settings).

### Auth & session
- [ ] **CSRF tokens** — verify NextAuth's built-in CSRF protection is intact, and any custom form/API routes that mutate state (not just NextAuth flows) also validate a CSRF token or use double-submit cookie pattern.
- [ ] **Reset sessions on password change** — changing a password must invalidate all existing sessions/JWTs for that user (rotate session token/secret version, or maintain a `passwordChangedAt` timestamp checked on every request).
- [ ] **Expire reset links** — password reset tokens must be single-use, cryptographically random, and expire within a short window (e.g. 15–60 min). Check they're invalidated after use.
- [ ] **Prevent user enumeration** — login, signup, and password-reset endpoints must return identical responses/timing whether or not the account exists (e.g. "if that email exists, we sent a link").
- [ ] **Lock accounts after failed logins** — implement a failed-login counter with exponential backoff or temporary lockout (e.g. 5 attempts → 15 min lock), scoped per account and/or IP.
- [ ] **Rate limit password resets** — separate rate limit on the reset-request endpoint itself, per email and per IP, to stop reset-spam and enumeration-via-timing.
- [ ] **Remove default admin routes** — no `/admin`, `/api/admin`, or scaffold/demo routes left exposed without auth middleware explicitly guarding them; confirm no default credentials anywhere.

### Input & uploads
- [ ] **Whitelist upload types** — validate file uploads (to R2 or elsewhere) by actual file content/magic bytes, not just extension or client-supplied MIME type. Enforce a strict allow-list and size limit.
- [ ] **Block prompt injection** — for any LLM-facing endpoints (Spring AI backend or otherwise), ensure user input is never concatenated directly into system prompts; use structured input, input/output filtering, and treat retrieved/user content as untrusted data, not instructions.

### Payments
- [ ] **Verify payment webhooks** — PayHere IPN callbacks must verify the MD5/HMAC signature server-side against your merchant secret before trusting the payload; reject anything that fails verification.
- [ ] **Set prices server-side** — never trust a price/amount sent from the client. All order totals must be computed/re-validated server-side from the DB before creating a payment request or fulfilling an order.

### Data & observability
- [ ] **Restrict database permissions** — MongoDB connection user should have least-privilege access (only the collections/operations the app needs, no admin role), and confirm no default/blank credentials.
- [ ] **Log security events** — centralize logging for: failed logins, account lockouts, password resets, permission denials, webhook signature failures, and admin actions. Include timestamp, user/IP, and action — but never log passwords, tokens, or full card/payment data.

---

## Notes for use
- Run this against one project/repo at a time — point the assistant at the repo root first.
- If you want it scoped to just the payment or auth surface, tell it to skip the unrelated sections rather than editing the prompt each time.
- Ask it to end with a short summary table: item → status before → status after → files changed.
