---
description: Greenfield bootstrapper. Forces 5 discovery questions and human approval before scaffolding the Next.js monorepo, walking skeleton, and CI/CD pipeline.
---

---
required_rules:
  - "00-delivery-principles.md"
  - "nextjs-project-workspace-rules.md"
trigger: "Manual — run when starting a new repository or major application epic."
---

# Workflow: Greenfield Bootstrapper

## 🛑 Phase 1: The Inquisition (Hard Gate)

You are **forbidden** from scaffolding any code, files, or pipelines until this phase is complete and the developer has explicitly approved.

1. Read `.agents/rules/00-delivery-principles.md` to understand the team's delivery constraints.
2. Ask the developer to answer the following **6 Mandatory Bootstrapping Questions**:

   - **North Star:** What is the single desired outcome of this project? What does success look like in one sentence?
   - **Tech Stack:** Confirm or specify: runtime, framework (Next.js App Router assumed), state management approach, database, and ORM.
   - **Test Framework:** Which unit test framework should be used?
     Options:
     - `Vitest` ← recommended default for Next.js App Router (fast, native ESM, compatible with React Testing Library)
     - `Jest` ← use only if the team has an existing Jest ecosystem or explicit preference
     Also confirm: should React Testing Library be installed for component testing? (yes/no)
   - **Integrations:** Which external services are required? (e.g. auth provider, payment processor, email service, storage, analytics)
   - **Data Shape:** What does the primary input/output look like? Describe the core domain entity or entities.
   - **Behavioural Constraints:** What are the hard rules? What must this system *never* do?

3. **HALT EXECUTION.** Do not proceed until the developer has provided answers to all 6 questions and explicitly types **"Approved"**.

4. Once approved, save the exact answers verbatim into `docs/project-context.md` using this structure:

```md
# Project Context

**Generated:** {{date}}

## North Star
{{answer}}

## Tech Stack
{{answer}}

## Test Framework
{{answer}}

## Integrations
{{answer}}

## Data Shape
{{answer}}

## Behavioural Constraints
{{answer}}
```

This file is a permanent team artefact. Commit it alongside the skeleton.

***

## 🏗️ Phase 2: Strict Scaffolding

1. Read `.agents/rules/nextjs-project-workspace-rules.md` to establish all technical boundaries before generating a single file.

2. Initialise the monorepo structure:

```
{{PROJECT_NAME}}/
├── apps/
│   ├── web/                          → Next.js App Router frontend
│   │   └── src/
│   │       ├── app/                  → App Router pages, layouts, API routes
│   │       ├── components/           → Shared UI components
│   │       └── lib/                  → Utilities, server actions, services
│   └── api/                          → Standalone API route handlers (if separate)
├── packages/
│   └── shared/                       → Zod schemas, TypeScript types, constants
├── tests/
│   ├── unit/                         → Unit tests (Vitest or Jest)
│   │   ├── components/               → Component tests (React Testing Library)
│   │   ├── lib/                      → Utility and service unit tests
│   │   └── api/                      → API route handler unit tests
│   └── e2e/                          → End-to-end tests (Playwright)
│       ├── fixtures/                 → Auth helpers and shared test fixtures
│       ├── smoke.spec.ts             → Smoke test suite (bootstrapped in setup-e2e workflow)
│       └── global-setup.ts           → Playwright global auth setup
├── docs/
│   ├── project-context.md            → generated in Phase 1
│   └── adr/                          → architecture decision records
├── .agents/
│   └── workflows/                    → this workflow and all others
├── .env.example                      → all required keys documented
├── .env.local                        → gitignored copy of .env.example
├── .gitignore
├── package.json                      → root workspace config
├── turbo.json                        → Turborepo pipeline config
├── vitest.config.ts                  → (if Vitest selected)
├── jest.config.ts                    → (if Jest selected)
└── tsconfig.base.json                → shared TypeScript base config
```

3. Configure **TypeScript** (`tsconfig.base.json`):
   - `strict: true`
   - `moduleResolution: "bundler"`
   - `paths: { "@/*": ["./src/*"], "@shared/*": ["../../packages/shared/src/*"], "@tests/*": ["../../tests/*"] }`
   - Each `apps/` package extends `../../tsconfig.base.json`

4. Initialise **Next.js** strictly using the App Router inside `apps/web/`:
   - `npx create-next-app@latest apps/web --typescript --app --no-src-dir --tailwind --eslint`

5. Install approved dependencies based on Phase 1 answers:
   - ORM: `npx prisma init` inside `apps/web/` (if database confirmed)
   - Styling: Tailwind CSS (already installed via create-next-app)
   - Shared schemas: install `zod` in `packages/shared/`

6. Install and configure the **test framework** based on Phase 1 TEST_FRAMEWORK answer:

   **If Vitest:**
   ```
   npm install -D vitest @vitejs/plugin-react vite
   ```
   Create `vitest.config.ts` at the monorepo root:
   ```ts
   import { defineConfig } from 'vitest/config'
   import react from '@vitejs/plugin-react'

   export default defineConfig({
     plugins: [react()],
     test: {
       environment: 'jsdom',
       globals: true,
       setupFiles: ['./tests/unit/setup.ts'],
       include: ['tests/unit/**/*.{test,spec}.{ts,tsx}'],
       coverage: {
         reporter: ['text', 'lcov'],
         exclude: ['node_modules/', 'tests/e2e/'],
         thresholds: { lines: 80, functions: 80, branches: 80 },
       },
     },
   })
   ```

   **If Jest:**
   ```
   npm install -D jest @types/jest ts-jest jest-environment-jsdom
   ```
   Create `jest.config.ts` at the monorepo root:
   ```ts
   export default {
     preset: 'ts-jest',
     testEnvironment: 'jsdom',
     setupFilesAfterFramework: ['./tests/unit/setup.ts'],
     testMatch: ['<rootDir>/tests/unit/**/*.{test,spec}.{ts,tsx}'],
     coverageThreshold: { global: { lines: 80, functions: 80, branches: 80 } },
   }
   ```

   **If React Testing Library confirmed:**
   ```
   npm install -D @testing-library/react @testing-library/user-event @testing-library/jest-dom
   ```
   Create `tests/unit/setup.ts`:
   ```ts
   import '@testing-library/jest-dom'
   ```

   Add to root `package.json` scripts:
   ```json
   "test":        "vitest run",            ← (or jest)
   "test:watch":  "vitest",                ← (or jest --watch)
   "test:coverage": "vitest run --coverage" ← (or jest --coverage)
   ```

7. Configure tooling:
   - ESLint flat config (`eslint.config.mjs`) with Next.js, TypeScript, and import-order rules
   - Prettier: `singleQuote: true`, `semi: false`, `tabWidth: 2`, `trailingComma: "es5"`
   - Husky + lint-staged: run ESLint and Prettier on pre-commit
   - Commitlint: `@commitlint/config-conventional`

8. **Purge all Next.js boilerplate** to ensure a clean slate:
   - Delete default `app/page.tsx` content (replace with minimal placeholder)
   - Delete `app/globals.css` default styles (keep Tailwind directives only)
   - Delete `public/next.svg` and `public/vercel.svg`
   - Remove all default inline styles from `app/layout.tsx`

***

## 💀 Phase 3: The Walking Skeleton (Hard Gate)

As per `00-delivery-principles.md`, **no business logic is permitted until a walking skeleton is deployed and verified end-to-end.**

1. Create a health-check API route at `apps/web/src/app/api/health/route.ts`:
   - Perform one real operation proving the stack is wired (e.g. a database ping if DB is configured, or an echo if not)
   - Return `200 { status: "ok", timestamp: string, db: "connected" | "not configured" }`

2. Create a Server Component at `apps/web/src/app/page.tsx` that:
   - Fetches the result of `/api/health` server-side
   - Displays the status visibly on screen
   - This proves the full Server Component → API Route → (Database) slice is working end-to-end

3. If a database was confirmed in Phase 1:
   - Create the initial Prisma schema with a `User` model (id, email, createdAt, updatedAt)
   - Run `npx prisma migrate dev --name init`
   - Run `npx prisma generate`
   - Health check must confirm a real DB connection

4. Create the following App Router shell files:
   - `app/layout.tsx` — root layout with Tailwind, metadata defaults
   - `app/error.tsx` — global error boundary with reset action
   - `app/not-found.tsx` — custom 404
   - `app/loading.tsx` — global loading skeleton
   - `src/middleware.ts` — auth protection stub (ready to activate)

5. Write the **first unit test** to prove the test framework is wired correctly.
   Create `tests/unit/api/health.test.ts`:
   ```ts
   // Smoke test — verifies the test framework runs. Replace with real tests per feature.
   describe('health check', () => {
     it('returns ok status shape', () => {
       const response = { status: 'ok', timestamp: new Date().toISOString() }
       expect(response.status).toBe('ok')
       expect(response.timestamp).toBeDefined()
     })
   })
   ```
   Run: `npm test` — must pass before proceeding.

***

## ⚙️ Phase 4: CI/CD Pipeline Generation

Generate the pipeline configuration based on the CI platform confirmed in Phase 1.

The pipeline **MUST** enforce the following gates on every push and PR — no exceptions:

- **Build:** `npm run build` — fail fast on any compile error
- **TypeScript:** `npm run typecheck` (`tsc --noEmit`) — zero type errors permitted
- **Lint:** `npm run lint` — zero ESLint errors permitted
- **Unit Tests:** `npm test` — full unit test suite must pass with 80% coverage minimum
- **E2E Tests:** `npm run test:e2e` — smoke suite must pass (once Playwright is configured via `setup-e2e` workflow)

**For GitHub Actions** — create `.github/workflows/ci.yml`:

```yaml
name: CI
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run test:coverage
      - run: npm run build
```

**For Azure DevOps** — create `azure-pipelines.yml` with equivalent stages using the Node.js task.

> Note: The E2E stage is added to the pipeline by the `setup-e2e` workflow. It is intentionally absent here to keep the initial skeleton pipeline minimal and green.

***

## 🚀 Phase 5: Handoff & Halt

1. Stage all generated files: `git add -A`
2. Commit: `git commit -m "chore: bootstrap project structure and walking skeleton"`
3. Create and push the branch: `git checkout -b chore/initial-skeleton && git push -u origin chore/initial-skeleton`

4. **HALT EXECUTION.** Output the following message exactly:

> *"Walking Skeleton deployed to branch `chore/initial-skeleton`. Awaiting CI/CD pipeline verification.*
>
> *No feature work or business logic will commence until:*
> *1. The CI pipeline is green on this branch*
> *2. A human engineer has reviewed and approved the skeleton PR*
>
> *Next step: Open a PR from `chore/initial-skeleton` → `main`, verify all pipeline gates pass, and get team approval. Once merged, run `/setup-e2e` to wire up Playwright, then `/add-feature` to begin the first vertical slice."*