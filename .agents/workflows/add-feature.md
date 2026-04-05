---
description: Scaffolds a complete vertical slice: Zod schema → Prisma model → API route → Server Component page → Client Component → loading + error boundaries.
---

## /add-feature [name]

Contract-first. The shared schema is always created before any implementation.

### Step 1 — Discovery
Ask if not provided:
1. **Feature name?** (e.g. `invoices`, `user-profile`, `notifications`) — use kebab-case
2. **Needs a database model?** (yes/no)
3. **Needs an API route?** (yes/no)
4. **Needs a UI page?** (yes/no)
5. **Is this an authenticated feature?** (yes/no)

// capture: FEATURE_NAME
// capture: NEEDS_DB
// capture: NEEDS_API
// capture: NEEDS_UI
// capture: IS_AUTHENTICATED

### Step 2 — Contract first: Zod schemas
Always run this step regardless of other answers.

Create `packages/shared/src/schemas/{{FEATURE_NAME}}.ts`:
- `Create{{Feature}}Schema` — input validation for POST
- `Update{{Feature}}Schema` — input validation for PUT (all fields optional)
- `{{Feature}}ResponseSchema` — shape of the API response
- Export inferred TypeScript types for each schema

### Step 3 — Database model
// if NEEDS_DB is "yes"
  Add a Prisma model to `prisma/schema.prisma` for `{{Feature}}`:
  - Include standard audit fields: `id`, `createdAt`, `updatedAt`
  - If IS_AUTHENTICATED: add `userId` foreign key referencing `User`
  - Add appropriate indexes

  Then run: /add-migration add-{{feature-name}}-model

### Step 4 — API route
// if NEEDS_API is "yes"
  Create `apps/api/src/app/api/{{FEATURE_NAME}}/route.ts`:
  - `GET` — list all (with pagination) and single by ID (`?id=`)
  - `POST` — create, validated against `Create{{Feature}}Schema`
  - `PUT` — update, validated against `Update{{Feature}}Schema`
  - `DELETE` — soft delete preferred (set `deletedAt`) unless hard delete is explicit

  Each handler must:
  - Validate input with Zod and return `400` with field errors on failure
  - Check session/auth and return `401` if unauthenticated (if IS_AUTHENTICATED)
  - Return `404` with `{ error: "Not found", code: "{{FEATURE}}_NOT_FOUND" }` when applicable
  - Return `500` with `{ error: "Internal server error", code: "INTERNAL_ERROR" }` on unexpected errors
  - Include JSDoc comment on each exported function

  Create `apps/api/src/app/api/{{FEATURE_NAME}}/route.test.ts`:
  - Happy path for each method
  - Zod validation failure (400)
  - Unauthenticated request (401) if IS_AUTHENTICATED
  - Not found (404)

### Step 5 — UI page and components
// if NEEDS_UI is "yes"
  Create `apps/web/src/app/(routes)/{{FEATURE_NAME}}/page.tsx`:
  - Server Component
  - Export `generateMetadata` with dynamic title
  - Fetch data server-side (direct DB query or internal API call per workspace rules)
  - Pass data as props to the Client Component

  Create `apps/web/src/app/(routes)/{{FEATURE_NAME}}/_components/{{Feature}}View.tsx`:
  - `'use client'` component
  - Receives typed props from the Server Component
  - Handles interactive state (loading states, form submissions, optimistic updates)

  Create `apps/web/src/app/(routes)/{{FEATURE_NAME}}/loading.tsx`:
  - Skeleton that matches the layout of the page (use shimmer CSS)

  Create `apps/web/src/app/(routes)/{{FEATURE_NAME}}/error.tsx`:
  - `'use client'` error boundary
  - Displays a user-friendly error message
  - Includes a "Try again" reset button

  // if IS_AUTHENTICATED is "yes"
    Add session guard to `page.tsx`:
    - Check session at the top of the Server Component
    - Redirect to `/sign-in?callbackUrl={{path}}` if no session

### Step 6 — Open and confirm
Open `apps/web/src/app/(routes)/{{FEATURE_NAME}}/page.tsx` as the active file.
Print a summary of all files created.