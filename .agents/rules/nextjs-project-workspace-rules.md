---
trigger: model_decision
description: Trigger for Next.js tasks: creating /app routes, React components, Server Actions, or data fetching. Dictates App Router paradigms, strict Server/Client boundaries, and cache revalidation to prevent legacy SPA patterns and hydration errors
---

# Next.js Workspace Rules

Extends `~/.gemini/GEMINI.md` and `00-delivery-principles.md`. Applies to all
repositories using Next.js. Project rules extend these — they never contradict them.

**Applies to:** `**/*.ts`, `**/*.tsx`, `**/*.js`, `**/*.jsx`, `**/next.config.*`

Do not hallucinate Pages Router patterns, `getServerSideProps`, `getStaticProps`,
`getInitialProps`, or `pages/api/` conventions. Default to App Router in all generated code.

---

## Stack

- Framework: Next.js 15 (App Router) · Runtime: Node.js 22
- Language: TypeScript 5 — strict mode, no `any`
- Styling: Tailwind CSS — no CSS modules or styled-components unless project layer specifies
- Testing: Vitest, React Testing Library, Playwright (E2E)
- State: Server Components for server state · Zustand for client state — no Redux
- Data fetching: `fetch` + cache in Server Components · TanStack Query for client-side only
- Hosting: Vercel or Azure Static Web Apps

---

## Architecture

**App Router directory structure:**

| Directory | Purpose |
|---|---|
| `app/` | Routes, layouts, pages, loading and error boundaries |
| `app/_actions/` | Server Actions — `'use server'`, never imported by client components |
| `app/api/` | Route Handlers — external-facing endpoints and webhooks only |
| `app/[route]/_components/` | Components used by a single route — co-locate here |
| `components/ui/` | Primitive, stateless UI — no data fetching, no route coupling |
| `lib/` | Shared utilities, data access layer, API clients |
| `lib/db/` | Database access — server-only, never imported by client components |
| `types/` | Shared TypeScript types and interfaces |

**Non-route directories inside `app/` must use an underscore prefix** — `_components`,
`_lib`, `_actions` — to prevent route tree pollution.

**Server vs Client Components — default is Server.** Use `'use client'` only when the
component requires `useState`, `useEffect`, browser APIs, or DOM event listeners. Push
the boundary as far down the tree as possible — never make a layout or top-level page a
Client Component to pass state. Never import `lib/db/` or secrets into client components.

**Server Actions** for all internal mutations — Route Handlers for external endpoints and webhooks only.

**Data access layer.** All DB and external API calls in `lib/` — never inline in pages or components.

---

## TypeScript conventions

- Strict mode — no `any`, no `@ts-ignore` without comment
- `interface` for shapes · `type` for unions and aliases
- Explicit return types on all public async functions
- `unknown` over `any` — narrow explicitly
- Zod validates all external data: API responses, form inputs, env vars
- `process.env` only in `lib/config.ts` via Zod schema — never accessed directly elsewhere
- No barrel `index.ts` files in `components/` — import directly

**Naming:** `PascalCase` components/types · `camelCase` functions/variables/hooks ·
`UPPER_SNAKE_CASE` constants · `kebab-case` routes/directories · `use` hook prefix

---

## Rendering and data fetching

- Default to static rendering — opt into dynamic only when necessary (`noStore()`, cookies, headers)
- Initial data fetching in Server Components via `async/await` and `fetch` — never `useEffect` for initial loads
- TanStack Query for client-side subsequent fetches only — not initial page loads
- Fetch at the highest layout level — compose, do not prop drill
- Wrap async Server Components in `Suspense` with a meaningful `fallback`
- `loading.tsx` route loading · `error.tsx` error boundaries
- Every mutating Server Action must call `revalidatePath()` or `revalidateTag()` before returning
- Prefer URL search params over `useState` for shareable state (pagination, filters, search)

---

## Hydration safety

- Never import a Server Component into a Client Component — pass as `children` or props
- Never access `window`, `document`, or `localStorage` during server render — guard with
  `typeof window !== 'undefined'` or move into `useEffect`
- Never access `process.env` secrets in client components — they will be exposed in the bundle

---

## Testing

- Unit and integration: Vitest + React Testing Library · E2E: Playwright in `e2e/`
- Test files co-located: `component.test.tsx` alongside `component.tsx`
- `describe` per component/function · `it('does X when Y')`
- Test user-visible behaviour — never implementation details
- Mock all external API and DB calls in unit tests
- A Server Action or Route Handler is not complete without a test covering the happy
  path and at least one error branch

---

## API design (Route Handlers)

- Routes: `app/api/v{version}/resource/route.ts`
- Always return `NextResponse` with explicit status codes
- Validate all inputs with Zod before processing
- Consistent error shape: `{ error: string, code: string }`
- `200` reads · `201` created · `204` no-body · `202` + `{ statusUrl }` for async
- Never expose internal errors or stack traces to the client

---

## Security

- Secrets in Server Components, Route Handlers, or Server Actions only — never client bundles
- Validate and sanitise all inputs with Zod server-side
- CSP headers in `next.config` or middleware
- Session tokens: `httpOnly`, `secure`, `sameSite` cookies — never `localStorage`
- Authenticate at middleware — protect route groups centrally, not per-page

---

## Observability

Pino for structured server-side logging — never `console.log()` in production.
Log at data access and Route Handler boundaries with correlation/request IDs.
Client errors via Sentry in `instrumentation.ts`.

---

## Agent behaviour

**Always:**
- Default to Server Components — `'use client'` only when a browser API explicitly requires it
- Prefix all non-route directories in `app/` with `_`
- Co-locate single-use components in the route's `_components/` folder
- Place mutations in `app/_actions/` — call `revalidatePath()` or `revalidateTag()` after every one
- Place all DB and API calls in `lib/`
- Validate external inputs and env vars with Zod
- Scaffold page, data access function, Server Action, loading state, error boundary, and tests together

**Never:**
- Use `getServerSideProps`, `getStaticProps`, or any `pages/` pattern
- Add `'use client'` to layouts or top-level pages
- Import Server Components directly into Client Components — compose via `children`
- Import `lib/db/` or secrets into client components
- Access `process.env` outside `lib/config.ts`
- Access `window`/`document`/`localStorage` outside `useEffect` or a browser guard
- Use `console.log()` in production · `any` or `@ts-ignore` without a comment
- Use Route Handlers for internal mutations — use Server Actions
- Mark a Server Action or Route Handler complete without a corresponding test

---