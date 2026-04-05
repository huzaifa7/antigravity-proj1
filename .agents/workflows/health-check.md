---
description: Full project quality gate. Runs build, tests, lint, typecheck, Prisma validation, and dependency audit in parallel. Reports a summary.
---

## /health-check

// turbo
// parallel

### Step 1 — Build
Run: `npm run build`
// capture: BUILD_RESULT
// capture: BUILD_STATUS (pass/fail)

### Step 2 — Tests with coverage
Run: `npm test -- --coverage --passWithNoTests`
// capture: TEST_RESULT
// capture: TEST_STATUS (pass/fail)
// capture: COVERAGE_PERCENT

### Step 3 — Lint
Run: `npm run lint`
// capture: LINT_RESULT
// capture: LINT_STATUS (pass/fail)

### Step 4 — TypeScript
Run: `npm run typecheck`
// capture: TYPECHECK_RESULT
// capture: TYPECHECK_STATUS (pass/fail)

### Step 5 — Prisma schema validation
Run: `npx prisma validate`
// capture: PRISMA_RESULT
// capture: PRISMA_STATUS (pass/fail)

### Step 6 — Dependency audit
Run: `npm audit --audit-level=high`
// capture: AUDIT_RESULT
// capture: AUDIT_STATUS (pass/warn/fail)

### Step 7 — Summary report
╔══════════════════════════════════════════════╗
║ HEALTH CHECK REPORT ║
╠══════════════════════════════════════════════╣
║ Build → ✅ / ❌ ║
║ Tests → ✅ / ❌ (X/Y, coverage N%) ║
║ Lint → ✅ / ❌ (N errors) ║
║ TypeScript → ✅ / ❌ ║
║ Prisma schema → ✅ / ❌ ║
║ Vulnerabilities→ ✅ / ⚠️ (list CVEs) ║
╚══════════════════════════════════════════════╝

If all pass: "✅ Health check passed. Safe to deploy or raise PR."
If any fail: "🔴 Health check failed. Resolve all issues before proceeding." List failures with their captured output.