---
description: Scaffolds a new Next.js App Router page with generateMetadata, loading skeleton, error boundary, and optional auth guard.
---

## /add-page [name]

### Step 1 — Gather inputs
Ask if not provided:
- **Page name / route segment?** (e.g. `settings`, `dashboard/analytics`) — kebab-case
- **Page title?** (used in generateMetadata)
- **Has a form or interactive elements?** (yes/no — determines if a Client Component is needed)
- **Authenticated page?** (yes/no)
- **Data source?** (existing API route / direct Prisma query / static / none)

// capture: PAGE_NAME
// capture: PAGE_TITLE
// capture: HAS_INTERACTION
// capture: IS_AUTHENTICATED
// capture: DATA_SOURCE

### Step 2 — Scaffold the page
Create `apps/web/src/app/(routes)/{{PAGE_NAME}}/page.tsx`:
- Server Component (no `'use client'` directive)
- Export `generateMetadata` returning `{ title: "{{PAGE_TITLE}}", description: "..." }`
- // if IS_AUTHENTICATED: check session at top, redirect to sign-in if none
- // if DATA_SOURCE is not "none": add data fetching with a TODO stub
- Render `<{{PageName}}View />` or static JSX depending on HAS_INTERACTION

### Step 3 — Client Component (if needed)
// if HAS_INTERACTION is "yes"
  Create `apps/web/src/app/(routes)/{{PAGE_NAME}}/_components/{{PageName}}View.tsx`:
  - `'use client'` at the top
  - Accepts typed props from the Server Component
  - `useState` / `useTransition` stubs for interactive state
  - Form handling with `useActionState` or `react-hook-form` per workspace rules

### Step 4 — Loading state
Create `apps/web/src/app/(routes)/{{PAGE_NAME}}/loading.tsx`:
- Skeleton layout matching the page structure
- Use shimmer animation class consistent with the project's design system
- Skeleton should mirror: heading, content area, any key interactive elements

### Step 5 — Error boundary
Create `apps/web/src/app/(routes)/{{PAGE_NAME}}/error.tsx`:
- `'use client'` directive (required by Next.js for error boundaries)
- User-friendly error message (not raw error text)
- "Try again" button calling the `reset` prop
- Optional: back navigation link

### Step 6 — Confirm
Open `page.tsx` as the active file.
Print a summary of all files created.