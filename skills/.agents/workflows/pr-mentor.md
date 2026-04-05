---
description: Reviews a teammate's PR against the team's Definition of Done and Next.js App Router boundaries. Leaves educational feedback, not just pass/fail.
---

## /pr-mentor [branch-or-pr]

A lead engineer's PR review is educational, not just gatekeeping. This workflow audits code against team standards and explains *why* each finding matters.

### Step 1 — Load the PR diff
// if GitHub CLI available
  Run: `gh pr diff {{branch-or-pr}}`

// else
  Run: `git diff main...{{branch-or-pr}}`

// capture: PR_DIFF

Ask: "Who authored this PR?" (for personalising feedback tone)
// capture: PR_AUTHOR

### Step 2 — Load team standards
Read:
- `.agents/rules/00-delivery-principles.md` → extract Definition of Done checklist
- `.agents/rules/nextjs-project-workspace-rules.md` → extract Next.js conventions and boundaries
- `~/.gemini/GEMINI.md` → extract global engineering principles

// capture: TEAM_STANDARDS

### Step 3 — Review against Definition of Done
Check PR_DIFF against each item in the Definition of Done:
- [ ] Tests written and passing for new code
- [ ] No TypeScript errors introduced
- [ ] No ESLint errors introduced
- [ ] Documentation updated if public API changed
- [ ] No hardcoded secrets or environment-specific values
- [ ] Conventional Commit message format followed
- [ ] PR description explains what and why (not just how)

Flag any DoD items not met.

### Step 4 — Review Next.js App Router boundaries
Check for violations of nextjs-project-workspace-rules.md:
- `'use client'` used in Server Components incorrectly
- Data fetching happening in Client Components instead of Server Components
- Missing `loading.tsx` or `error.tsx` for new route segments
- `useEffect` used for data that should be server-fetched
- Direct database calls in Client Components
- Missing `generateMetadata` on new pages
- API routes missing input validation or auth guards

### Step 5 — Review global engineering principles
Check for violations of GEMINI.md:
- Functions doing more than one thing (Single Responsibility)
- Magic numbers or strings (should be constants)
- Deep nesting instead of early returns
- Missing error handling
- Overly complex logic that should be extracted

### Step 6 — Generate review feedback
For each finding, write feedback in this format:

**File:** `path/to/file.ts` (line X)
**Severity:** 🔴 Must Fix / 🟠 Should Fix / 🟡 Suggestion
**Finding:** [What the issue is]
**Why it matters:** [Educational explanation referencing the specific team rule]
**Suggested fix:** [Concrete code example or guidance]

Tone rules:
- Address {{PR_AUTHOR}} by name
- Be direct but never condescending
- Always explain *why* not just *what*
- Acknowledge things done well — lead with positives before issues

### Step 7 — Summary verdict
Print an overall review summary:
- Total findings by severity
- DoD compliance: X/Y items met
- Verdict: ✅ Approved / 🟠 Approve with suggestions / 🔴 Changes requested

Ask: "Output this review as a GitHub PR comment? (yes/no)"
// if confirmed and GitHub CLI available
  Run: `gh pr review {{branch-or-pr}} --comment --body "{{generated-review}}"`