# 🍴 PROMPT 04 — Menu Management (`/admin/menu`)

> **Before using:** Paste `00_MASTER_CONTEXT.md` above this prompt.
> **Prerequisite:** Prompt 02 complete (layout shell exists).

---

## What to Build
The **Menu Management** tab — admins can view, add, edit, and toggle availability of menu items. Changes reflect immediately on the public-facing customer menu page.

---

## Page Sections

### 1. Page Header Row
```
Menu Management                     [+ Add New Item]  ← bg-brand text-white btn
Add, edit, or manage menu items
```

### 2. Menu Items Grid

**2-column CSS grid**, each item is a card:

```
┌──────────────────────────────────  ✏️ ─┐
│  Red Pork Yellow Rice                   │
│  Rs. 1,850           🟢 Available       │
└─────────────────────────────────────────┘
```

Card anatomy:
- Top-right: edit icon `✏️` (pencil) — clicking opens **Edit Modal**
- Item name: `font-semibold text-gray-900`
- Price: `text-brand font-medium` — `Rs. X,XXX`
- Availability badge: `text-xs` with circle icon
  - Available: `text-gray-600` with green dot
  - Unavailable: `text-red-500` with red dot

---

## Add New Item Modal

Triggered by "+ Add New Item" button.

```
┌──────────────────────────────────────────┐
│  Add New Menu Item                       │
│                                          │
│  Item Name          [_______________]    │
│  Price (Rs.)        [_______________]    │
│  Category           [dropdown ▼]         │
│  Description        [textarea optional]  │
│  Availability       ● Available          │
│                     ○ Unavailable        │
│                                          │
│              [Cancel]  [Add Item]        │
└──────────────────────────────────────────┘
```

Categories dropdown options:
`Rice & Curry | Kottu | Hoppers | Fried Rice | Biryani | Desserts | Beverages`

- "Add Item" → `POST /api/menu` with `{ name, price, category, description, available }`
- On success → **append card to grid optimistically**, show toast `"Item added successfully"`

---

## Edit Item Modal

Same form as Add, but pre-filled with existing values. Has one extra field:

```
│  Availability       ● Available  ○ Unavailable    │
│                                                    │
│  [Delete Item]          [Cancel]  [Save Changes]   │
└────────────────────────────────────────────────────┘
```

- "Save Changes" → `PATCH /api/menu/:id`
- "Delete Item" → confirm dialog → `DELETE /api/menu/:id`
  - Confirm dialog text: `"Remove [Item Name] from the menu? This cannot be undone."`
- On delete → remove card from grid optimistically

---

## Public Page Sync
When a menu item's `available` field changes, the customer-facing menu page must reflect it. Achieve this by:
```ts
// In PATCH /api/menu/:id route handler, after DB update:
revalidatePath('/menu')   // Next.js cache invalidation for public menu page
revalidatePath('/admin/menu')
```

---

## API Routes to Build

```ts
// GET    /api/menu           → list all menu items, sorted by category then name
// POST   /api/menu           → create new item
// PATCH  /api/menu/:id       → update fields (name, price, category, available, description)
// DELETE /api/menu/:id       → remove item
```

---

## Mongoose Model Reference
```ts
// /lib/models/MenuItem.ts
{
  name:        { type: String, required: true },
  price:       { type: Number, required: true },
  category:    { type: String, enum: ['Rice & Curry','Kottu','Hoppers','Fried Rice',
                                      'Biryani','Desserts','Beverages'] },
  description: { type: String },
  available:   { type: Boolean, default: true },
}
```

---

## Files to Create
- `/app/admin/menu/page.tsx` — Server component, fetches all menu items
- `/app/admin/menu/_components/MenuGrid.tsx` — "use client" (modal state)
- `/app/admin/menu/_components/MenuItemCard.tsx`
- `/app/admin/menu/_components/AddEditItemModal.tsx` — "use client", handles both add + edit
- `/app/api/menu/route.ts`
- `/app/api/menu/[id]/route.ts`
- `/lib/models/MenuItem.ts`