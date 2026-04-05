---
description: One-time setup of Playwright end-to-end testing. Scaffolds config, auth fixtures, smoke test suite, and wires into CI.
---

## /setup-e2e

Run once per project after the walking skeleton is in place.

// turbo

### Step 1 — Install Playwright
Run: `npx playwright install --with-deps chromium firefox webkit`
Run: `npm install -D @playwright/test`

### Step 2 — Scaffold Playwright config
Create `playwright.config.ts` at the monorepo root:
- `baseURL` from `process.env.PLAYWRIGHT_BASE_URL` (defaults to `http://localhost:3000`)
- 3 projects: chromium, firefox, webkit
- `testDir: './test/e2e'`
- `retries: 2` on CI, `0` locally
- `reporter: [['html'], ['list']]`
- `globalSetup` pointing to `./test/e2e/global-setup.ts`

### Step 3 — Create auth fixtures
Create `test/e2e/fixtures/auth.ts`:
- `loginAsUser(page, credentials)` helper that navigates to sign-in, fills form, and confirms redirect
- `loginAsAdmin(page)` helper using env var credentials
- Export a typed `test` fixture that extends Playwright's base `test` with authenticated page context

Create `test/e2e/global-setup.ts`:
- Authenticate once and save storage state to `test/e2e/.auth/user.json`
- This avoids re-logging in for every test

### Step 4 — Write smoke test suite
Create `test/e2e/smoke.spec.ts`:

```typescript
// Homepage loads
test('homepage renders without error', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/.+/)
  await expect(page.locator('main')).toBeVisible()
})

// Auth flow
test('unauthenticated user is redirected to sign-in', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page).toHaveURL(/sign-in/)
})

test('user can sign in and reach dashboard', async ({ page }) => {
  // Uses auth fixture
})

// Primary API health
test('health endpoint returns 200', async ({ request }) => {
  const response = await request.get('/api/health')
  expect(response.status()).toBe(200)
})
```

### Step 5 — Add npm scripts
Add to root `package.json`:
```json
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui",
"test:e2e:report": "playwright show-report"
```

### Step 6 — Wire into CI pipeline
// if GitHub Actions (`.github/workflows/ci.yml` exists)
  Add an `e2e` job after the `build` job:
  - Uses `ubuntu-latest`
  - Installs Playwright browsers
  - Starts the app (`npm run start`)
  - Runs `npm run test:e2e`
  - Uploads Playwright HTML report as a build artefact on failure

// if Azure DevOps (`azure-pipelines.yml` exists)
  Add equivalent stage using `npx playwright install` and `npm run test:e2e`.

### Step 7 — Confirm
Print:
- Location of config, fixtures, and smoke tests
- How to run locally: `npm run test:e2e`
- How to open the UI runner: `npm run test:e2e:ui`
- "✅ E2E testing is set up. Run the smoke suite against staging after your first deploy."