# 🧠 MASTER CONTEXT — Ceylon Curry Pot Admin Dashboard
> Paste this at the top of EVERY prompt. It is your persistent project memory.

---

## Project Identity
- **App name:** Ceylon Curry Pot
- **Type:** Admin/Staff dashboard for a small Sri Lankan food shop
- **Stack:** Next.js 14 (App Router), Tailwind CSS, MongoDB (via Mongoose), NextAuth.js for auth
- **Currency:** Sri Lankan Rupees — always display as `Rs. X,XXX`
- **Locale:** Sri Lanka — phone numbers in +94 format

---

## Design System (Never Deviate)

### Colors
```js
// tailwind.config.js extend → colors
brand:       '#DC2626'   // Red — primary actions, active tabs, logo
brand-hover: '#B91C1C'   // Darker red on hover
bg-page:     '#F9FAFB'   // Gray-50 — page background
bg-card:     '#FFFFFF'   // Card/panel backgrounds
text-primary:'#111827'   // Headings
text-muted:  '#6B7280'   // Subtitles, placeholders
border:      '#E5E7EB'   // Card borders
```

### Status Badge Color Map
| Status          | Background  | Text        | Icon        |
|-----------------|-------------|-------------|-------------|
| Pending         | gray-100    | gray-700    | Clock       |
| Preparing       | purple-100  | purple-700  | Package     |
| Ready           | yellow-100  | yellow-700  | Package     |
| Out for Delivery| orange-100  | orange-700  | Truck       |
| Completed       | green-100   | green-700   | Check       |
| Cancelled       | red-100     | red-700     | X           |

### Order Type Badges
| Type     | Style                          |
|----------|--------------------------------|
| Delivery | blue-100 text, blue-700 border |
| Pickup   | purple-100 text, purple-700 border |

### Typography
- **Logo/Brand:** `font-bold text-2xl` in `text-brand`
- **Page title:** `font-bold text-2xl text-gray-900`
- **Section subtitle:** `text-sm text-gray-500`
- **Table headers:** `text-xs font-semibold uppercase tracking-wider text-gray-500`

---

## Layout Shell (All dashboard pages share this)

```
┌──────────────────────────────────────────────────────┐
│ [4px red top bar]                                    │
│ Ceylon Curry Pot          Admin Dashboard  [Logout]  │
├──────────────────────────────────────────────────────┤
│ [Orders tab] [Menu Management tab] [User Mgmt tab🔴] │
├──────────────────────────────────────────────────────┤
│  Page content area                                   │
└──────────────────────────────────────────────────────┘
```

- The **red top bar** is `h-1 bg-brand w-full` at the very top.
- The **User Management tab** shows a red badge with pending approval count (from MongoDB).
- Active tab: `text-brand border-b-2 border-brand font-medium`
- Inactive tab: `text-gray-500 hover:text-gray-700`

---

## MongoDB Collections Reference

```
orders       → { _id, orderNumber, customer: {name, phone}, type: 'delivery'|'pickup',
                 items: [{name, qty, price}], total, status, createdAt }

menuItems    → { _id, name, price, category, available: bool, description? }

users        → { _id, name, email, role: 'admin'|'staff', approved: bool,
                 requestedAt, approvedAt? }
```

---

## File Structure (App Router)
```
/app
  /admin
    /layout.tsx          ← Shell with header + tabs
    /page.tsx            ← Redirects to /admin/orders
    /orders/page.tsx
    /menu/page.tsx
    /users/page.tsx
  /api
    /orders/route.ts
    /orders/[id]/route.ts
    /menu/route.ts
    /menu/[id]/route.ts
    /users/route.ts
    /users/[id]/route.ts
/lib
  /mongodb.ts            ← DB connection singleton
  /models/              ← Mongoose models
```

---

## Coding Rules (Follow in every prompt)
1. Use **Server Components** by default; add `"use client"` only when state/events are needed.
2. All DB calls go in **Server Actions** or **Route Handlers** — never expose raw MongoDB to the client.
3. Use **`fetch` with `revalidate: 0`** for real-time order data; use `revalidate: 60` for menu.
4. Always handle **loading** and **error** states visibly in UI.
5. All forms use **controlled inputs** with optimistic UI where applicable.
6. Phone numbers always displayed in `+94 XX XXX XXXX` format.
7. Order numbers prefixed `CEY` followed by 6 digits.