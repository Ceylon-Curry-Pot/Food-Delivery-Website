# 🔐 PROMPT 01 — Staff Auth Page (`/staff-portal`)

> **Before using:** Paste `00_MASTER_CONTEXT.md` above this prompt.

---

## What to Build
A single page at `/staff-portal` with **two side-by-side panels**:
- **Left panel:** Staff Login form
- **Right panel:** Staff Sign Up (request access) form

Below both panels: a `← Back to Home` link pointing to `/`.

---

## Visual Layout

```
[Cream/off-white page background: #FDF5F0]

        [Red circular logo — food bowl icon]
              Ceylon Curry Pot
        Staff Portal
        Sign in to access the admin dashboard

┌────────────────────┬──────────────────────────┐
│   Staff Login      │   Staff Sign Up           │
│   (white bg)       │   (light gray bg #F8FAFC) │
│                    │                           │
│  [Email field]     │  [Full Name field]        │
│  [Password field]  │  [Email field]            │
│  Remember me |     │  [Password field]         │
│  Forgot password?  │                           │
│  [Sign In btn RED] │  ⚠️ Note box (yellow)     │
│                    │  "Your account requires   │
│  Don't have an     │   admin approval..."      │
│  account? Sign up  │                           │
│                    │  [Request Access btn RED] │
│                    │  Already have account?    │
│                    │  Sign in                  │
└────────────────────┴──────────────────────────┘

              ← Back to Home
```

---

## Behaviour & Logic

### Login (Left Panel)
- Uses **NextAuth.js `signIn('credentials')`**
- On success → redirect to `/admin/orders`
- On failure → show inline error: `"Invalid email or password"`
- `Remember me` checkbox → sets NextAuth session `maxAge` accordingly

### Sign Up (Right Panel)
- Calls `POST /api/users` with `{ name, email, password, role: 'staff', approved: false }`
- Password is **bcrypt hashed** before saving
- On success → show a green success toast: `"Request submitted! Await admin approval."`
- Note box is always visible (yellow bg `#FEF9C3`, amber border, amber text)

### Forgot Password
- For now: show a toast `"Contact your admin to reset your password."`

---

## Component Breakdown
```
StaffPortalPage (Server Component — page.tsx)
└── AuthCard (Client Component — "use client")
    ├── LoginForm
    └── SignUpForm
```

---

## Input Field Style (reuse across both forms)
```jsx
<div className="relative">
  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
  <input className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-red-500 
                    placeholder:text-gray-400 text-sm" />
</div>
```

---

## Do NOT Build Yet
- Password reset flow (email sending)
- OAuth providers
- 2FA