Contents

1. [Summary](#summary)
2. [Files changed](#files)
3. [Input sanitization](#sanitize)
4. [Image upload validation](#uploads)
5. [PayHere signature check](#payhere)
6. [Admin access control](#authz)
7. [Sign-up privilege fix](#escalation)
8. [Account lockout](#lockout)
9. [Security logging](#logging)
10. [HTTP security headers](#headers)
11. [Password hash exposure](#leaks)
12. [Loyalty session sync](#loyalty)
13. [Open items](#followups)

Ceylon Curry Pot · branch security-features → dev

# Security Features Branch Changes

What changed in commits `59820ac` and `2f1fc2a`: the files touched, how the logic changed, and the security problems each change closes.

**Author** Nipuna Rajapaksa **Files** 28 file changes across 24 unique files **Lines** +606 / −57

59820ac

19 Aug 2026

Implement input sanitization and image upload validation across multiple endpoints

8 files · +195 −42

2f1fc2a

23 Aug 2026

Implement security features including account lockout, logging, and admin access controls

20 files · +411 −15

## Summary

Before these commits, most admin API routes had no server-side auth check. Anyone who knew the URL could create, edit or delete menu items, update orders, read the full order list with customer details, and approve or delete staff accounts. The public staff sign-up endpoint also accepted `role` and `approved` from the request body, so an anonymous caller could create an approved admin account.

The two commits fix these problems and add several layers of defence:

- **Access control.** A shared guard (`lib/authGuard.ts`) now protects every admin route. Approving and deleting users requires the `admin` role.
- **Privilege escalation fix.** The server now decides a new account's role and approval from the caller's session. Values in the request body are ignored for anonymous callers.
- **Brute-force protection.** After 5 failed logins an account is locked for 15 minutes. This applies to both staff/admin and loyalty accounts.
- **Input hardening.** Free-text fields are sanitized before they are stored. Order search escapes regex characters. Image uploads are checked by their actual bytes, not by the filename or content type the client sends.
- **Payment webhook.** The PayHere signature is now compared in constant time.
- **Visibility.** Failed logins, lockouts, denied requests, bad webhook signatures and admin actions are logged as structured JSON.
- **Transport and browser.** HSTS, `nosniff`, `X-Frame-Options: DENY` and a referrer policy are sent on every response.
- **Data exposure.** Password hashes are no longer sent to the admin users page or returned by the users API.

## Files changed

### Commit 59820ac: sanitization and uploads

| File |  | Lines | What changed |
| --- | --- | --- | --- |
| lib/sanitize.ts | New | +40 | Text, multiline and email sanitizers, plus a regex escape helper |
| lib/imageUpload.ts | New | +88 | Checks file size and magic bytes; builds random storage keys |
| lib/payhere.ts | Mod | +14 −1 | Constant-time comparison for merchant ID and md5sig |
| app/api/loyalty/signup/route.ts | Mod | +9 −2 | Sanitizes name, email, phone and birthday |
| app/api/orders/route.ts | Mod | +13 −3 | Sanitizes customer fields, address and note; escapes the search regex |
| app/api/users/route.ts | Mod | +4 −1 | Sanitizes name and email on sign-up |
| app/api/menu/route.ts | Mod | +13 −18 | Uses the shared image validator; removed local `getFileExtension` |
| app/api/menu/\[id\]/route.ts | Mod | +15 −16 | Same as above, for the edit route |

### Commit 2f1fc2a: auth, lockout, logging, headers

| File |  | Lines | What changed |
| --- | --- | --- | --- |
| lib/authGuard.ts | New | +95 | `requireAdmin`, `requireAdminRole`, `getAdminSession` and an Origin check |
| lib/accountLockout.ts | New | +41 | Counts failed logins and locks the account after 5 |
| lib/securityLog.ts | New | +23 | Central structured logger for security events |
| components/loyalty/LoyaltySessionSync.tsx | New | +57 | Keeps the cached loyalty member in sync with the real session |
| .agent/prompts/security-audit-prompt.md | New | +50 | Audit checklist prompt used to drive this work (not runtime code) |
| app/api/auth/\[...nextauth\]/route.ts | Mod | +23 | Lockout checks and logging in both credential providers |
| app/api/users/route.ts | Mod | +26 −4 | Server decides role and approval; GET is admin-only; hashes excluded |
| app/api/users/\[id\]/route.ts | Mod | +14 −1 | PATCH and DELETE require the admin role |
| app/api/menu/route.ts | Mod | +6 | POST is admin-only and logged |
| app/api/menu/\[id\]/route.ts | Mod | +11 −1 | PATCH and DELETE are admin-only and logged |
| app/api/menu/categories/route.ts | Mod | +6 | POST is admin-only and logged |
| app/api/orders/route.ts | Mod | +7 | GET (full order list) is admin-only |
| app/api/orders/\[id\]/route.ts | Mod | +6 | PATCH is admin-only and logged |
| app/api/payhere/notify/route.ts | Mod | +3 −1 | Invalid signatures go to the security log |
| app/admin/(dashboard)/users/page.tsx | Mod | +2 −2 | Excludes `password` from the query |
| lib/models/User.ts | Mod | +5 −1 | Adds `failedLoginAttempts` and `lockUntil` |
| lib/models/LoyaltyMember.ts | Mod | +4 | Same two fields |
| components/loyalty/useLoyaltyStore.ts | Mod | +9 −4 | Adds `clearMember()` |
| app/providers.tsx | Mod | +6 −1 | Mounts the session sync; refetches the session every 5 minutes |
| next.config.ts | Mod | +17 | Global security headers |

## Input sanitization

`lib/sanitize.ts` cleans user text *when it is written to the database*. React already escapes text when it renders it, but the same values also end up in emails, PDFs or any future `dangerouslySetInnerHTML`. Cleaning the input on the way in protects all of those places.

| Function | Behaviour |
| --- | --- |
| sanitizeText(input, max) | Returns `''` for non-strings. Removes `<…>` tags and control characters, trims, and cuts to `max` characters (default 200). |
| sanitizeMultiline(input, max) | Same, but keeps newlines. Used for addresses and notes (default 1000). |
| sanitizeEmail(input) | `sanitizeText` capped at 254 characters, then lower-cased. |
| escapeRegExp(input) | Escapes regex metacharacters so search text is matched literally. |

### Where it is applied

| Endpoint | Fields and limits |
| --- | --- |
| POST /api/loyalty/signup | name 100, email, phone 20, birthday 10. The password is only checked to be a string and is not altered. |
| POST /api/orders | customer.name 100, customer.phone 20, customer.email, deliveryAddress 300 (multiline), note 500 (multiline) |
| GET /api/orders?search= | Search text goes through `escapeRegExp` before `new RegExp` |
| POST /api/users | name 100, email |

**Regex injection / ReDoS.** The order search used to run `new RegExp(search, 'i')` on raw input. A crafted pattern such as `(a+)+$` could tie up the database with catastrophic backtracking, and a value like `.*` matched every order. The search text is now escaped and matched literally.

Required-field checks now run *after* sanitizing. A value that is only HTML tags or whitespace becomes empty and is rejected with "Missing required fields".

## Image upload validation

Menu image uploads to Cloudflare R2 used the filename and `Content-Type` the client sent. Both are controlled by the uploader. An `.html` or `.svg` file containing a `<script>` could be stored with a content type the browser would run, then served from the public R2 URL. That is stored XSS. The filename also went straight into the object key (`menu-items/${imageFile.name}.${ext}`), so uploads could overwrite each other or produce odd keys.

Before

```
const extension = getFileExtension(
  imageFile.name, imageFile.type);
const key =
  `menu-items/${imageFile.name}.${extension}`;
await uploadToR2(key, buffer,
  imageFile.type || 'application/octet-stream');
```

After

```
const { contentType, extension } =
  validateImageUpload(imageFile, buffer);
const key = buildImageKey('menu-items', extension);
// → menu-items/<random UUID>.jpg
await uploadToR2(key, buffer, contentType);
```

- **Size limit.** Files over 5 MB (`MAX_IMAGE_BYTES`) are rejected. Both `file.size` and the buffer length are checked.
- **Magic-byte sniffing.** `sniffImageType` reads the file's first bytes and accepts only JPEG (`FF D8 FF`), PNG (8-byte signature), GIF (`GIF8`), WEBP (`RIFF…WEBP`) and AVIF (`ftyp avif/avis`). SVG and HTML can never pass.
- **Server-chosen type.** The stored `Content-Type` and file extension come from the sniffed format, never from the client.
- **Random keys.** `buildImageKey` uses `crypto.randomUUID()`, so the client's filename never reaches the bucket.
- **Clear errors.** Validation throws `ImageUploadError`. Both menu routes catch it and return a 400 with the message. Other errors still go to the 500 handler.

The duplicated `getFileExtension` helper was removed from both menu routes.

## PayHere signature check

`verifyPayhereNotification` used `===` to compare the merchant ID and the `md5sig` hash. A normal string comparison stops at the first different character, so its timing can, in principle, reveal how much of a forged signature is correct. Both comparisons now use a `timingSafeEqualStrings` helper built on `crypto.timingSafeEqual`.

- Strings of different length return `false` straight away. `timingSafeEqual` needs equal lengths, and this reveals only that the lengths differ.
- A missing `md5sig` no longer throws on `.toUpperCase()`. It falls back to `''` and fails the check.
- Invalid signatures are now logged as a `webhook_signature_invalid` security event (commit 2f1fc2a) instead of with `console.error`.

## Admin access control

This is the most important change. The `/admin` pages were already protected by their layout, but the **API routes behind them were not**. Anyone could call `PATCH /api/orders/:id` or `DELETE /api/users/:id` directly. `lib/authGuard.ts` adds server-side checks to every route that changes data.

### The guards

| Guard | Allows | Rejects |
| --- | --- | --- |
| requireAdmin(req) | A signed-in `admin`, or a `staff` member whose `approved` flag is true *in the database right now* | 401 if there is no admin session. 403 if the Origin is cross-site or the staff member is not approved. |
| requireAdminRole(req) | Everything in `requireAdmin`, and the role must be `admin` | 403 `insufficient-role` for staff |
| getAdminSession() | Returns the admin session user or `null`. It enforces nothing and logs nothing. | n/a |

- **Live approval check.** Staff approval is not stored in the JWT. A staff member whose approval is revoked during a session loses API access on their next request, without waiting for the token to expire.
- **Origin check.** If an `Origin` header is present, it must match `NEXTAUTH_URL` (or the request's own origin). This backs up the existing `SameSite=Lax` session cookie against CSRF. Requests with no Origin header are allowed.
- **Logged denials.** Every 401 and 403 writes a `permission_denied` event with the path and the reason.

### Route protection after this branch

| Route | Method | Access |
| --- | --- | --- |
| /api/menu | GET | Public |
| /api/menu | POST | Admin / approved staff |
| /api/menu/\[id\] | PATCH, DELETE | Admin / approved staff |
| /api/menu/categories | GET | Public |
| /api/menu/categories | POST | Admin / approved staff |
| /api/orders | GET | Admin / approved staff (contains customer personal data) |
| /api/orders | POST | Public (customer checkout) |
| /api/orders/\[id\] | GET | Public (order tracking, unchanged) |
| /api/orders/\[id\] | PATCH | Admin / approved staff |
| /api/users | GET | Admin / approved staff |
| /api/users | POST | Public, but the server decides the role (see next section) |
| /api/users/\[id\] | PATCH, DELETE | Admin role only |

Approving and deleting accounts needs the `admin` role. Without this, an approved staff member could approve other staff or delete accounts, including approving a second account they control.

## Sign-up privilege fix

`POST /api/users` serves two purposes: the public staff sign-up form and the admin "create user" modal. It used to take `role` and `approved` straight from the request body:

Before

```
const { name, email, password,
        role, approved } = body;
...
role: role || 'staff',
approved: approved || false,
```

After

```
const adminUser = await getAdminSession();

const role = adminUser?.role === 'admin'
  && (body.role === 'admin' || body.role === 'staff')
  ? body.role : 'staff';
const approved = adminUser?.role === 'admin'
  ? Boolean(body.approved) : false;
```

Before the fix, anyone could send `{"role":"admin","approved":true}` and get full admin access immediately. Now only a signed-in user with the `admin` role can set the role or pre-approve an account. Everyone else, including staff, always creates an unapproved `staff` account. Accounts created by an admin are logged as `user_create`.

## Account lockout

`lib/accountLockout.ts` adds brute-force protection to both NextAuth credential providers (staff/admin and loyalty). Both models gain two fields:

```
failedLoginAttempts: { type: Number, default: 0 },
lockUntil:           { type: Date,   default: null },
```

| Setting | Value |
| --- | --- |
| Failed attempts before lock | 5 |
| Lock duration | 15 minutes |
| Counter on lock | Reset to 0, so the next 5 attempts after the lock ends count fresh |
| Counter on successful login | Reset, and `lockUntil` cleared (only saved if something changed) |

### Login flow

1. Look up the account. If it doesn't exist, return the generic "Invalid email or password".
2. If `isLocked`, reject before running bcrypt and log `login_failed` with reason `locked`.
3. If the password is wrong, call `registerFailedLogin` (which may lock the account and log `account_locked`), log `login_failed` with reason `bad-password`, and return the generic error.
4. If the password is right, call `clearFailedLogins` and continue with the existing checks (such as staff approval).

The two providers report a lock differently:

- **Admin/staff** shows "Too many failed attempts. Try again in N minute(s)."
- **Loyalty** shows the same generic "Invalid email or password" as any other failure. Confirming a lock would reveal that the email belongs to a real customer account.

## Security event logging

`lib/securityLog.ts` sends all security events through one function. Each event is a single line of JSON, which makes it easy to filter in hosting logs and to send to Sentry, Datadog or a Mongo collection later by changing only this file.

```
{"type":"security","event":"admin_action","timestamp":"2026-08-23T17:15:03.000Z",
 "action":"menu_item_delete","actor":"admin@example.com","itemId":"66c…"}
```

| Event | Logged when |
| --- | --- |
| login_failed | Wrong password or locked account, in either provider |
| account_locked | The 5th failed attempt triggers a lock |
| permission_denied | Any 401 or 403 from `authGuard` |
| webhook_signature_invalid | A PayHere notify call with a bad signature |
| admin_action | Menu item create, update or delete; category update; order update (with the changed field names); user create, approve or delete |

The file's header comment says that passwords, tokens and full payment data must never be included in `details`.

## HTTP security headers

`next.config.ts` now adds these headers to every path (`/:path*`):

| Header | Value | Protects against |
| --- | --- | --- |
| Strict-Transport-Security | max-age=63072000; includeSubDomains; preload | Downgrade to HTTP and SSL stripping (2-year policy) |
| X-Content-Type-Options | nosniff | Browsers treating a file as a different type than declared |
| X-Frame-Options | DENY | Clickjacking (the site can't be embedded in a frame) |
| Referrer-Policy | strict-origin-when-cross-origin | Full URLs, including order numbers, leaking to other sites |

## Password hash exposure

Two places returned full `User` documents, including the bcrypt `password` hash:

- `app/admin/(dashboard)/users/page.tsx` serialized every user, hash included, into the client props of the users page.
- `GET /api/users` returned the full documents to the caller, and before this branch that endpoint had no auth at all.

Both queries now use `.select('-password')`.

## Loyalty session sync

The loyalty navbar and modal read the member from a Zustand store saved in `localStorage`. That cached member could outlive the real session: after the session expired (8-hour `maxAge`), after cookies were cleared, or after an admin signed in on the same browser, the UI still showed a signed-in member with an old points balance.

- **`LoyaltySessionSync`** is mounted once inside `<SessionProvider>`. If there is no session, or the session isn't a loyalty account, it calls `clearMember()`. If it is a loyalty session, it fetches `/api/loyalty/me` once per session ID and updates the store. If that fetch fails because of a network error, the cache is kept so a brief outage doesn't sign the user out.
- **`clearMember()`** is a new store action. It clears the local cache only. `logout()` also ends the server session.
- **`refetchInterval={5 * 60}`** on `SessionProvider` rechecks the session every 5 minutes, so a tab left open in the background notices when the session expires.

## Open items

These came up while reviewing the diff. None of them block the branch, but they are worth tracking.

#### Upload size is checked after the whole file is in memory

Both menu routes call `imageFile.arrayBuffer()` before `validateImageUpload`, so a very large upload is fully buffered before it is rejected. The comment in `imageUpload.ts` says the opposite. Checking `imageFile.size` before reading the buffer would fix it.

app/api/menu/route.ts · app/api/menu/\[id\]/route.ts

#### Admin lockout message confirms the account exists

The staff/admin provider says "Too many failed attempts", while the loyalty provider deliberately does not. Someone could use this to confirm a staff email, but only after triggering a lock on it. Decide whether this trade-off is acceptable for the admin login.

app/api/auth/\[...nextauth\]/route.ts

#### Lockout counter can be raced

`registerFailedLogin` reads the count, adds one and saves. Parallel login attempts can overwrite each other's count, so an attacker sending many requests at once gets more than 5 tries per window. An atomic `$inc` update would close this.

lib/accountLockout.ts

#### Order details remain public by order number

`GET /api/orders/[id]` returns the full order, including name, phone and address, to anyone who has the ID or order number (format `CEY123456`). If the numbers are sequential or short, they can be guessed. Consider a tracking token, or returning only status for unauthenticated callers.

app/api/orders/\[id\]/route.ts

#### HSTS `preload` and `includeSubDomains` are hard to undo

Once the domain is submitted to the preload list, every subdomain must serve HTTPS for years. Before submitting, check that no subdomain (mail, staging, legacy) still needs plain HTTP.

next.config.ts

#### Missing Origin header is allowed

`originIsTrusted` returns true when there is no `Origin` header. This is fine while the session cookie stays `SameSite=Lax`, but it means the Origin check adds protection only when the browser sends the header.

lib/authGuard.ts

Generated from `git show 59820ac 2f1fc2a` on the `security-features` branch, 10 Oct 2026.