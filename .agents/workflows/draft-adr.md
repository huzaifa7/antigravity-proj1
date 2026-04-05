---
description: Drafts a formal Architecture Decision Record (ADR) before any feature scaffolding begins. Enforces team review and approval as a hard gate.
---

---
required_rules:
  - "00-delivery-principles.md"
  - "nextjs-project-workspace-rules.md"
  - "docs/project-context.md"
temperature: 0.4
trigger: "Manual — run when starting a new major feature, epic, database schema change, or cross-cutting concern."
---

# Workflow: Architectural Decision Record (ADR) Drafter

## 🧠 Phase 1: Context Ingestion & Alignment

You are **forbidden** from drafting any technical solution until this phase is complete.

1. Read `docs/project-context.md` to understand the project's North Star, core data shape, and behavioural constraints established during bootstrap.
2. Read `.agents/rules/00-delivery-principles.md` to ensure the proposed design aligns with the team's Definition of Done and architectural standards.
3. Read `.agents/rules/nextjs-project-workspace-rules.md` to enforce strict boundaries regarding Server vs. Client Components, data mutations, and directory structures.
4. Scan the existing codebase for patterns relevant to the topic:
   - Existing route handlers, Server Actions, or data fetching patterns
   - Any previous ADRs in `docs/architecture/` that this decision relates to or supersedes
   - `package.json` dependencies already installed that could serve the need
   - `prisma/schema.prisma` if the ADR involves a data model change

// capture: PROJECT_NORTH_STAR
// capture: RELEVANT_RULES
// capture: EXISTING_PATTERNS
// capture: RELATED_ADRS

Ask the developer:
- **What is the decision or feature this ADR covers?** (e.g. "authentication strategy", "file upload approach", "caching layer")
- **What options have already been considered?** (optional — the workflow will also propose options)
- **Is there a deadline or constraint driving this decision?**

// capture: ADR_TOPIC
// capture: EXISTING_OPTIONS
// capture: CONSTRAINTS

---

## 📐 Phase 2: Architectural Design (The Draft)

Generate a formal ADR in Markdown. The document **MUST** include all of the following sections:

### 1. Title & Status
- Clear, descriptive title
- Status: **"Proposed"** — this must be manually changed to **"Accepted"** by the team before any implementation begins

### 2. Context & Problem Statement
- What is the specific business requirement or technical problem being solved?
- Reference the relevant North Star goal from `docs/project-context.md`
- Reference any rules from `00-delivery-principles.md` or `nextjs-project-workspace-rules.md` that directly constrain this decision

### 3. Options Considered
Evaluate at least **3 options** using the following structure for each:

```md
### Option N: {{name}}
**Description:** ...
**Pros:** ...
**Cons:** ...
**Alignment with team rules:** [Does this comply with nextjs-project-workspace-rules.md and 00-delivery-principles.md?]
```

Options must be drawn from EXISTING_OPTIONS (if provided) plus alternatives surfaced from EXISTING_PATTERNS in the codebase.

### 4. Proposed Solution
Provide a detailed technical implementation plan, specifically addressing:

- **Component Strategy:** Explicitly state which parts of the UI will be Server Components vs. Client Components and why, per `nextjs-project-workspace-rules.md`
- **Data Flow & Mutations:** Define exactly how data will be fetched (e.g. native Server `fetch`, direct Prisma query in Server Component) and mutated (e.g. isolated Server Actions, API route handlers)
- **Caching Strategy:** Detail precisely how and where Next.js cache invalidation will occur — specify `revalidatePath('/path')` or `revalidateTag('tag')` call sites
- **Data Schema Updates:** Outline any required changes to `prisma/schema.prisma` or external API contracts, including migration naming convention
- **Directory Structure:** Show the exact file paths that will be created, consistent with the workspace rules

### 5. Decision Rationale
- Why was the proposed solution chosen over the alternatives?
- Explicitly reference the RELEVANT_RULES that informed the decision
- Note any RELATED_ADRS this supersedes or depends on

---

## ⚠️ Phase 3: Risk & Complexity Assessment

Append a risk assessment section to the ADR, explicitly addressing each of the following:

### 1. Hydration & Boundaries
- Are there any risks of leaking server-only secrets or data to the client bundle?
- Could any `'use client'` boundary placement cause hydration mismatches?
- Are there any `async` Server Components passing non-serialisable props to Client Components?

### 2. Performance Bottlenecks
- Will this introduce heavy client-side JavaScript that could impact Core Web Vitals?
- Are there unoptimised sequential (waterfall) server fetches that should be parallelised with `Promise.all`?
- Is the caching strategy sufficient to prevent unnecessary re-renders or database round-trips?

### 3. Rollback Strategy
- If this deployment fails or causes a regression, what is the rollback path?
- If a database migration is involved: is it reversible? Does a `Down` migration exist?
- What feature flags or environment variables could isolate this change for safe rollback?

---

## 🛑 Phase 4: Handoff & Halt

1. Save the generated document to `docs/architecture/` using the naming convention:
   `ADR-{{YYYY-MM-DD}}-{{feature-name-slug}}.md`

2. If this ADR supersedes a previous one, update the status of the old ADR to
   `"Superseded by ADR-{{date}}-{{slug}}"`.

3. Stage and commit the ADR:
   - `git add docs/architecture/ADR-{{date}}-{{slug}}.md`
   - `git commit -m "docs: draft ADR for {{ADR_TOPIC}}"`
   - `git push`

4. **HALT EXECUTION.** Output the following message exactly:

   > *"Architectural Decision Record drafted and saved to*
   > *`docs/architecture/ADR-{{date}}-{{slug}}.md`.*
   >
   > *Awaiting team review and approval.*
   >
   > *No feature scaffolding or implementation will commence until:*
   > *1. The team has reviewed the ADR*
   > *2. The ADR status field is manually changed from `Proposed` to `Accepted`*
   >
   > *Once accepted, run `/add-feature {{feature-name}}` to begin scaffolding."*