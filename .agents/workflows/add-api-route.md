---
description: Scaffolds a standalone API route handler with Zod validation, auth guards, consistent error shape, and a full test file.
---

## /add-api-route [resource]

Use this when you need a new API endpoint without a full UI feature slice.

### Step 1 — Gather inputs
Ask if not provided:
- **Resource name?** (e.g. `webhooks`, `export`, `health`) — kebab-case
- **HTTP methods needed?** (GET / POST / PUT / DELETE — default: all)
- **Authenticated endpoint?** (yes/no)

// capture: RESOURCE_NAME
// capture: HTTP_METHODS
// capture: IS_AUTHENTICATED

### Step 2 — Create Zod schemas
Create `packages/shared/src/schemas/{{RESOURCE_NAME}}.ts`:
- Request schema(s) for each method that accepts a body
- Response schema
- Export inferred TypeScript types

### Step 3 — Scaffold the route handler
Create `apps/api/src/app/api/{{RESOURCE_NAME}}/route.ts`:

For each method in HTTP_METHODS:
- Parse and validate input against the relevant Zod schema
- Return `400` with `{ error: string, fields?: Record<string, string> }` on validation failure
- // if IS_AUTHENTICATED: check session, return `401 { error: "Unauthorised", code: "UNAUTHORISED" }` if no session
- Implement business logic stub with a `TODO` comment
- Return typed response using `{{Resource}}ResponseSchema`
- Include JSDoc on each exported handler: route, method, auth requirement, response shape

### Step 4 — Generate test file
Create `apps/api/src/app/api/{{RESOURCE_NAME}}/route.test.ts`:

For each HTTP method:
- ✅ Happy path — valid input returns expected response
- ❌ Invalid input — malformed body returns 400 with field errors
- ❌ Unauthenticated — missing session returns 401 (if IS_AUTHENTICATED)
- ❌ Not found — resource missing returns 404 (if applicable)
- ❌ Server error — DB throws, returns 500

### Step 5 — Confirm
Open `route.ts` as the active file.
Print: "✅ API route /api/{{RESOURCE_NAME}} created with {{n}} methods and test file."