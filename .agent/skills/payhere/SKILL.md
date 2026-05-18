---
name: payhere-nextjs
description: >
  Integrate PayHere (Sri Lanka's #1 payment gateway) into a Next.js e-commerce site. Use this skill
  whenever the user wants to: add PayHere payments to a Next.js app, implement PayHere onsite checkout
  popup, generate PayHere hash server-side, handle PayHere webhooks/notify_url, verify PayHere
  payment notifications, support sandbox and live modes, or troubleshoot PayHere integration errors
  (unauthorized, popup not showing, hash mismatch, webhook failures). Also triggers for "PayHere
  checkout", "PayHere API route", "PayHere webhook Next.js", or any combination of PayHere + React/Next.
---

# PayHere × Next.js Integration Skill

## Overview

PayHere uses an **onsite popup** flow (payhere.js loads the payment iframe client-side) with
**server-side hash generation** (to keep merchant secret secure) and a **server-to-server webhook**
for final payment verification. This skill covers the complete, production-ready integration.

## Architecture

```
Browser                     Next.js Server              PayHere Servers
─────────                   ──────────────              ───────────────
1. User clicks Pay
2. POST /api/payhere/hash ──► generate hash ──────────►
◄────────────────────────── return { orderId, hash }
3. payhere.startPayment()
   (popup opens)                               ◄──────► process payment
4. onCompleted callback                                  │
                                                         │ (server-to-server)
5.                          ◄── POST /api/payhere/notify ┘
                            verify md5sig
                            update DB
6. Poll /api/payhere/status ──► return status
```

## Prerequisites Checklist

- [ ] PayHere merchant account created at payhere.lk
- [ ] Merchant ID noted (Side Menu → Integrations)
- [ ] Domain registered and approved (Side Menu → Integrations → Add Domain/App)
- [ ] Merchant Secret copied for that domain
- [ ] `notify_url` must be a **publicly accessible HTTPS URL** (not localhost — use ngrok for dev)
- [ ] For sandbox: use `sandbox.payhere.lk` endpoints and sandbox credentials

## Environment Variables

Add to `.env.local` (never expose these client-side):

```env
# PayHere Credentials (server-side only)
PAYHERE_MERCHANT_ID=121XXXX
PAYHERE_MERCHANT_SECRET=your_merchant_secret_here

# Mode: "sandbox" | "live"
PAYHERE_MODE=sandbox

# Public base URL (for notify_url, return_url, cancel_url)
NEXT_PUBLIC_BASE_URL=https://yourstore.com
```

## Step-by-Step Implementation

### 1. Load payhere.js in `app/layout.tsx` (or `_document.tsx` for Pages Router)

See `references/script-loading.md` for the correct approach per router type.

### 2. Create API Routes

Create all three routes:
- `/api/payhere/hash` — generates orderId + hash (POST)
- `/api/payhere/notify` — receives PayHere webhook (POST, must be public)
- `/api/payhere/status` — client polls for payment status (GET)

See `references/api-routes.md` for complete, copy-paste route code.

### 3. Create the `usePayhere` Hook

The hook encapsulates the full payment flow: fetch hash → call `payhere.startPayment()` → handle callbacks → poll for status.

See `references/use-payhere-hook.md` for the complete hook.

### 4. Use in Your Checkout Component

See `references/checkout-component.md` for a full worked example.

### 5. Type Declarations

If using TypeScript, add `payhere.d.ts` to avoid `window.payhere` errors.
See `references/typescript.md`.

---

## Critical Security Rules

1. **NEVER generate the hash client-side.** The merchant secret would be exposed.
2. **ALWAYS verify `md5sig`** in the notify route before trusting any payment status.
3. **Check `status_code === "2"`** for successful payment (not just signature match).
4. **Use HTTPS** for `notify_url` — PayHere won't POST to plain HTTP in production.
5. **Idempotency** — store `order_id` and ignore duplicate notifications.
6. **Do not trust** the client's `onCompleted` callback as confirmation — always rely on the server webhook.

## Hash Algorithm

```
hash = MD5( merchant_id + order_id + amount_formatted + currency + MD5(merchant_secret).toUpperCase() ).toUpperCase()
amount_formatted = parseFloat(amount).toFixed(2)  // CRITICAL: must be 2 decimal places
```

## Status Codes

| Code | Meaning |
|------|---------|
| 2    | Success |
| 0    | Pending |
| -1   | Cancelled |
| -2   | Failed |
| -3   | Chargedback |

## Payment Methods Supported

VISA, MASTER, AMEX, EZCASH, MCASH, GENIE, VISHWA, PAYAPP, HNB, FRIMI

## Sandbox Test Cards

| Card | Number |
|------|--------|
| Visa | 4916217501611292 |
| MasterCard | 5307732125531191 |
| AMEX | 346781005510225 |

Use any valid Name, CVV, and future expiry date.

## Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| Popup shows "Unauthorized" | Domain not approved or mismatch | Ensure the domain registered in PayHere dashboard exactly matches the domain serving the page |
| Hash mismatch | Amount not formatted to 2dp, or secret wrong | Use `parseFloat(amount).toFixed(2)`, double-check secret |
| `payhere is not defined` | SDK not loaded before `startPayment` | Load script via Script tag with `strategy="beforeInteractive"` or check `window.payhere` exists |
| notify_url not called | URL is localhost or HTTP | Use ngrok/public HTTPS URL for development |
| Duplicate notifications | PayHere retries on non-2xx | Return 200 even after processing; check `order_id` for duplicates |
| `cancel_url` not working | JS SDK ignores it | Use `onDismissed` callback instead |

## Reference Files

- `references/api-routes.md` — Complete Next.js API route code (App Router + Pages Router)
- `references/use-payhere-hook.md` — `usePayhere` React hook
- `references/checkout-component.md` — Full checkout component example
- `references/script-loading.md` — How to load payhere.js in Next.js correctly
- `references/typescript.md` — TypeScript type declarations
- `references/database-patterns.md` — DB schema and patterns for storing payments