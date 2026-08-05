# 🧾 PROMPT 03 — Orders Page (`/admin/orders`)

> **Before using:** Paste `00_MASTER_CONTEXT.md` above this prompt.
> **Prerequisite:** Prompt 02 complete (layout shell exists).

---

## What to Build
The **Order Management** tab — the default landing page after login.

---

## Page Sections (top to bottom)

### 1. Page Header
```
Order Management                          (font-bold text-2xl)
Track and manage customer orders          (text-sm text-gray-500)
```

### 2. Summary Stat Cards (4 cards, horizontal row)

| Card Label       | Color Theme       | Value Source                          |
|------------------|-------------------|---------------------------------------|
| Active Orders    | Blue (blue-50 bg) | count of orders NOT in completed/cancelled |
| Preparing        | Purple            | count where status === 'preparing'    |
| Out for Delivery | Orange            | count where status === 'out_for_delivery' |
| Completed Today  | Green             | count where status === 'completed' AND createdAt is today |

Card style: `rounded-xl border p-4`, colored background, colored label text, large number `font-bold text-2xl`.

### 3. Search + Filter Bar
- Full-width search input: placeholder `"Search by order number, customer name, or phone..."`
- Filter icon button (right side) — clicking it toggles a status filter dropdown
- Filter options: All / Pending / Preparing / Ready / Out for Delivery / Completed

### 4. Orders Table

Columns: `ORDER | CUSTOMER | TYPE | ITEMS | TOTAL | STATUS | ACTIONS`

**ORDER cell:**
```
CEY123459          ← font-mono font-medium
1/3/2026           ← text-xs text-gray-500
9:52:42 PM         ← text-xs text-gray-500
```

**CUSTOMER cell:**
```
Dilani Perera      ← font-medium
+94 75 456 7890    ← text-xs text-gray-500
```

**TYPE cell:** Pill badge (see status badge map in master context)

**ITEMS cell:** `{n} item{s}` — clicking opens order detail modal

**TOTAL cell:** `Rs. X,XXX` in font-medium

**STATUS cell:** Pill badge (see status badge map in master context)

**ACTIONS cell:**
- `"Update Status"` in `text-brand text-sm font-medium hover:underline cursor-pointer`
- Clicking opens the **Update Status Modal**

---

## Update Status Modal

Triggered by clicking "Update Status" on any row.

```
┌──────────────────────────────────────┐
│  Update Order Status                 │
│  Order #CEY123459                    │
│                                      │
│  Current: [Pending badge]            │
│                                      │
│  New Status:                         │
│  ○ Pending   ○ Preparing   ○ Ready   │
│  ○ Out for Delivery  ○ Completed     │
│  ○ Cancelled                         │
│                                      │
│           [Cancel]  [Update Status]  │
└──────────────────────────────────────┘
```
- Radio buttons, one per status option
- "Update Status" button: `bg-brand text-white`, disabled until selection changes
- On confirm → `PATCH /api/orders/:id` with `{ status: newStatus }`
- On success → **optimistic update** of the row in the table (no full reload)
- Show toast: `"Order #CEY123459 updated to Preparing"`

---

## Order Detail Modal (clicking item count)
```
┌──────────────────────────────────────┐
│  Order #CEY123456  🏷️ Delivery       │
│  Chaminda Silva | +94 77 123 4567    │
│  1/3/2026, 9:27 PM                   │
│  ─────────────────────────────────  │
│  Item Name          Qty    Price     │
│  Seafood Rice        1    Rs. 2,100  │
│  Chicken Kottu       2    Rs. 2,400  │
│  Ceylon Tea          1    Rs.   200  │
│  ─────────────────────────────────  │
│                   Total: Rs. 4,700   │
└──────────────────────────────────────┘
```

---

## API Routes to Build

```ts
// GET  /api/orders              → list all orders, sorted by createdAt desc
//   ?status=preparing           → filter by status
//   ?search=CEY123|name|phone   → search filter
// PATCH /api/orders/:id         → { status } → update order status
// GET  /api/orders/:id          → full order detail with items
```

---

## Data Refresh Strategy
- Use `revalidate: 0` (no cache) — orders are real-time
- Optionally: poll every 30s with `setInterval` + router refresh in client component
- Show a subtle `"Last updated: X seconds ago"` timestamp top-right of table

---

## Files to Create
- `/app/admin/orders/page.tsx` — Server component, fetches orders + stats
- `/app/admin/orders/_components/StatCards.tsx`
- `/app/admin/orders/_components/OrdersTable.tsx` — "use client" (search, modal state)
- `/app/admin/orders/_components/UpdateStatusModal.tsx` — "use client"
- `/app/admin/orders/_components/OrderDetailModal.tsx` — "use client"
- `/app/api/orders/route.ts`
- `/app/api/orders/[id]/route.ts`