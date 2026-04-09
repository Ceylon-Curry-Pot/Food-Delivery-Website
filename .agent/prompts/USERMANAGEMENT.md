# 👤 PROMPT 05 — User Management (`/admin/users`)

> **Before using:** Paste `00_MASTER_CONTEXT.md` above this prompt.
> **Prerequisite:** Prompt 02 complete (layout shell exists, badge logic in place).

---

## What to Build
The **User Management** tab — admins approve or reject staff account requests. The tab badge in the nav shows the pending count.

---

## Page Sections

### 1. Page Header
```
User Management
Approve or reject pending staff registrations
```

### 2. Pending Requests List

Each request is a **card**:

```
┌──────────────────────────────────────────────────────────┐
│  Kasun Rajapaksa                                         │
│  kasun@example.com                    [✓ Approve] [✗ Reject] │
│  Requested 2 days ago                                    │
└──────────────────────────────────────────────────────────┘
```

- Name: `font-bold text-gray-900 text-lg`
- Email: `text-gray-600 text-sm`
- Time: `text-gray-400 text-sm` — use `formatDistanceToNow` from `date-fns`
- Approve button: `bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 text-sm`
- Reject button: `bg-brand hover:bg-brand-hover text-white rounded-lg px-4 py-2 text-sm`

### 3. Empty State (when no pending requests)
```
        [Users icon, large, gray]
     No pending staff requests
  All registrations have been reviewed.
```

---

## Behaviour & Logic

### Approve
- `PATCH /api/users/:id` with `{ approved: true }`
- Removes card from list **optimistically**
- Decrements the nav badge count by 1
- Toast: `"Kasun Rajapaksa approved. They can now access the staff portal."`

### Reject
- Show a small **inline confirm** on the card (not a full modal — replace buttons with):
  ```
  Are you sure?  [Yes, Reject]  [Cancel]
  ```
- On confirm → `DELETE /api/users/:id` (removes user record entirely)
- Removes card from list optimistically
- Toast: `"Request from Kasun Rajapaksa has been rejected."`

---

## Approved Users Section (below pending, collapsible)

A secondary section listing already-approved staff. Collapsed by default.

```
▶  Active Staff Members (3)         [click to expand]
```

When expanded, shows a simple table:
| Name | Email | Approved On |
|------|-------|-------------|
| ... | ... | ... |

No actions needed here for now (future: revoke access).

---

## API Routes to Build

```ts
// GET    /api/users?approved=false        → pending users list
// GET    /api/users?approved=true         → approved staff list
// GET    /api/users?approved=false&count=true → { count: N }  ← used by layout badge
// PATCH  /api/users/:id                   → { approved: true }
// DELETE /api/users/:id                   → reject & remove
```

---

## Mongoose Model Reference
```ts
// /lib/models/User.ts
{
  name:        { type: String, required: true },
  email:       { type: String, required: true, unique: true },
  password:    { type: String, required: true },  // bcrypt hashed
  role:        { type: String, enum: ['admin','staff'], default: 'staff' },
  approved:    { type: Boolean, default: false },
  requestedAt: { type: Date, default: Date.now },
  approvedAt:  { type: Date },
}
```

---

## Badge Sync with Layout
After approve or reject, the layout's tab badge must update. Do this by:
```tsx
// In the client component after mutation:
router.refresh()  // triggers server re-render of layout, badge refetches
```

---

## Files to Create
- `/app/admin/users/page.tsx` — Server component, fetches pending + approved users
- `/app/admin/users/_components/PendingUserCard.tsx` — "use client" (inline confirm state)
- `/app/admin/users/_components/ApprovedStaffTable.tsx`
- `/app/api/users/route.ts`
- `/app/api/users/[id]/route.ts`
- `/lib/models/User.ts`