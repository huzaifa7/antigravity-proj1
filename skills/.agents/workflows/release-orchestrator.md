---
description: Manages environment promotion (Dev → Staging → Prod), generates release notes from commit history, and triages CI/CD pipeline failures.
---

## /release-orchestrator

### Step 1 — Determine release intent
Ask:
- **Release type?** Options: Dev → Staging / Staging → Production / Hotfix to Production
- **Release version?** (e.g. `1.2.0` — follows semver)

// capture: RELEASE_TYPE
// capture: RELEASE_VERSION

### Step 2 — Pre-release quality gate
Run: /health-check
If health check fails → abort. Print: "🔴 Release blocked. Fix all health check failures first."

### Step 3 — Generate release notes
Run: `git log --oneline {{previous-tag}}..HEAD`
// capture: COMMIT_LOG

Group commits by Conventional Commits type:
- 🚀 **Features** (feat:)
- 🐛 **Bug Fixes** (fix:)
- ⚡ **Performance** (perf:)
- 🔧 **Chores** (chore:)
- 📖 **Documentation** (docs:)
- ⚠️ **Breaking Changes** (any commit with `BREAKING CHANGE:` footer)

Create `docs/releases/{{RELEASE_VERSION}}.md` with the formatted release notes.

### Step 4 — Tag the release
Run: `git tag -a v{{RELEASE_VERSION}} -m "Release v{{RELEASE_VERSION}}"`
Run: `git push origin v{{RELEASE_VERSION}}`

### Step 5 — Trigger deployment
// if RELEASE_TYPE is "Dev → Staging"
  Trigger staging deployment per project deploy config.
  Run smoke tests after deployment completes.

// if RELEASE_TYPE is "Staging → Production"
  Ask: "This will promote to PRODUCTION. Confirm? (yes/no)"
  // if confirmed
    Trigger production deployment.
    Monitor health endpoint until 200 or timeout.

// if RELEASE_TYPE is "Hotfix to Production"
  Verify the fix is on a `hotfix/` branch.
  Run health check on the hotfix branch.
  Deploy directly to production after confirmation.

### Step 6 — CI/CD triage mode
If a pipeline failure is detected (read CI output if available):
- Identify the failing stage and step
- Read the error output
- Diagnose the likely cause:
  - Dependency install failure → check `package-lock.json` conflicts
  - Build failure → check for TypeScript errors introduced since last green build
  - Test failure → identify which test and suggest the fix
  - Deploy failure → check env var configuration and deployment target health
- Suggest a specific remediation command or file change
- Ask: "Apply the suggested fix? (yes/no)"

### Step 7 — Summary
Print:
- Release version
- Environment promoted to
- Release notes location
- Deployment status
- Any post-deploy monitoring links