# 🏗️ PROMPT 02 — Admin Layout Shell (`/app/admin/layout.tsx`)

> **Before using:** Paste `00_MASTER_CONTEXT.md` above this prompt.
> **Prerequisite:** Prompt 01 complete (auth is working, NextAuth session exists).

---

## What to Build
The **shared layout wrapper** for all admin pages. Every page under `/admin` inherits this shell. Build this before any tab content.

---

## Visual Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ ████████████████████ [4px RED top bar, full width] ████████████ │
├─────────────────────────────────────────────────────────────────┤
│  Ceylon Curry Pot          Admin Dashboard          [→ Logout]  │
│  (text-brand font-bold)    (text-xs text-gray-500)  (btn)      │
├─────────────────────────────────────────────────────────────────┤
│  🧾 Orders  |  🍴 Menu Management  |  👤 User Management [2]   │
│  [active tab has red underline + red text]                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   {children}  ← page content renders here                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Implementation Details

### Auth Guard
```tsx
// layout.tsx — Server Component
import { getServerSession } from 'next-auth'
// If no session → redirect('/staff-portal')
// If session.user.approved === false → show "Pending approval" screen
```

### Logout Button
```tsx
// Client component needed for signOut()
"use client"
import { signOut } from 'next-auth/react'
// Button: onClick={() => signOut({ callbackUrl: '/staff-portal' })}
// Style: border border-gray-200 rounded-lg px-3 py-1.5 text-sm flex items-center gap-2
```

### Tab Navigation
```tsx
// Use Next.js <Link> with usePathname() to determine active tab
const tabs = [
  { label: 'Orders',          href: '/admin/orders', icon: ClipboardList },
  { label: 'Menu Management', href: '/admin/menu',   icon: UtensilsCrossed },
  { label: 'User Management', href: '/admin/users',  icon: Users, badgeKey: 'pendingUsers' },
]
```

### Pending Users Badge
- Fetch count from `GET /api/users?approved=false&count=true` in the layout server component
- Pass count as prop to the client tab nav component
- Display as: `<span className="bg-brand text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{count}</span>`
- Hide badge if count is 0

### Tab Active State
```tsx
const isActive = pathname.startsWith(tab.href)
className={isActive 
  ? 'text-brand border-b-2 border-brand font-medium' 
  : 'text-gray-500 hover:text-gray-700'}
```

---

## API Route to Build Alongside
```ts
// GET /api/users?approved=false&count=true
// Returns: { count: number }
// Used only by layout to populate badge
```

---

## Files to Create
- `/app/admin/layout.tsx` — Server component, auth check, fetches pending count
- `/app/admin/_components/AdminHeader.tsx` — Logo + logout ("use client")
- `/app/admin/_components/TabNav.tsx` — Tab links with badge ("use client" for pathname)