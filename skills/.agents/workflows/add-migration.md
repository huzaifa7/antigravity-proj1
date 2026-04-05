---
description: Creates a Prisma migration, applies it to the dev database, refreshes the client, and validates no TypeScript breakage.
---

## /add-migration [name]

// turbo

### Step 1 — Validate schema first
Run: `npx prisma validate`
If validation fails → abort and display the schema errors. Do not proceed.

### Step 2 — Create the migration
Run: `npx prisma migrate dev --name {{name}}`

Display the generated SQL from the new migration file.
Ask: "Does this SQL diff look correct? Apply to dev database? (yes/no)"

### Step 3 — Apply and generate client
// if confirmed
  Migration was already applied by `prisma migrate dev`.
  Run: `npx prisma generate`
  Report: "✅ Prisma client regenerated."

### Step 4 — Check seed data
Check if `prisma/seed.ts` exists.
// if it exists
  Open `prisma/seed.ts` and highlight any section that references the affected model.
  Print: "⚠️ Review seed data — the schema change may require updates to prisma/seed.ts"

### Step 5 — TypeScript validation
Run: `npm run typecheck`
If TypeScript errors are found related to the schema change → display them and suggest fixes.
If clean → print: "✅ TypeScript clean after migration."

### Step 6 — Summary
Print:
- Migration name
- Tables affected
- Whether seed data needs attention
- TypeScript status