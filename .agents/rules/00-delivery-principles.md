---
trigger: model_decision
description: CRITICAL: Trigger for project planning, scaffolding, CI/CD pipelines, deployments, and task completion. Enforces mandatory bootstrapping gates, Definition of Done, walking skeleton requirements, and the self-annealing failure loop
---

# Delivery Principles

Extends the global `~/.gemini/GEMINI.md`. Defines how this team plans, bootstraps, and ships
software. Applies to all projects regardless of tech stack. Workspace and project rules
extend these — they never contradict them.

---

## Project bootstrapping
 
**Confirm before you build.** Before any code or pipeline is scaffolded for a greenfield
project, the following must be answered and approved:
 
1. **North Star** — What is the single desired outcome of this project?
2. **Tech stack** — Language, runtime, frameworks, and hosting confirmed. CI/CD platform
   identified. This is a hard gate — pipeline scaffolding does not begin until the stack
   is locked.
3. **Integrations** — Which external services are required? Are credentials and access
   ready?
4. **Data** — Where does primary data live? What does the input/output shape look like?
5. **Testing strategy** — Which unit testing framework will be used? What coverage
   threshold is required? Are integration and E2E tests in scope, and if so which tools?
   Confirmed before the walking skeleton is built — not retrofitted later.
6. **Behavioural rules** — What are the constraints, compliance requirements, or explicit
   "do not" rules for this system?
 
Answers are documented in the project layer before any agent or developer proceeds.
 
---
 
## Walking skeleton
 
The first deployable unit of every greenfield project is a walking skeleton — not a
feature, not a prototype. It must:
 
- Touch every major architectural component end-to-end
- Perform one real operation (health check, echo endpoint, single read/write round-trip)
- Be deployed to at least one environment via a green CI/CD pipeline
- Be reviewed and accepted by the team before feature work begins
 
**No business logic is written until the skeleton is deployed and the pipeline is green.**
 
---
 
## Testing strategy
 
A testing strategy must be agreed and documented in the project layer before the walking
skeleton is built. It cannot be introduced after feature development has started.
 
The strategy must define:
 
- **Unit testing framework** — confirmed for the chosen tech stack; the workspace rule
  specifies the default, but this must be explicitly recorded per project
- **Coverage threshold** — minimum percentage enforced by the CI gate; agreed by the team,
  not defaulted silently
- **Integration tests** — whether in scope, which layers they cover, and which tooling
- **E2E tests** — whether in scope, which user journeys are covered, and which tooling
- **Test data strategy** — how test data is created, isolated, and cleaned up across
  environments
 
The walking skeleton must include at least one passing unit test and one CI coverage
run before it is considered complete. This proves the testing pipeline works before
any business logic is written.
 
---
 
## CI/CD pipeline requirements
 
Every pipeline must include these gates on every push and pull request:
 
- Build — fails fast on compile errors
- Test — all tests run; failure blocks merge
- Coverage — minimum threshold enforced; threshold defined in project layer
- Static analysis — linting and code quality checks
- Artefact — deployable artefact produced on merge to main
 
Pipeline YAML lives in the repository and is subject to the same review process as
application code. It is not owned by a single person.
 
---
 
## Environments and promotion
 
| Environment | Purpose | Deployed by |
|---|---|---|
| Dev | Integration of in-progress work | CI on feature branch merge |
| Test | Functional and regression testing | CI on main branch |
| UAT | Stakeholder acceptance | Promoted manually or on tag |
| Production | Live system | Promoted manually with approval gate |
 
No artefact is built twice — the same artefact is promoted through environments.
Environment-specific configuration is injected at runtime, never baked into the build.
 
---
 
## Branch strategy
 
- `main` is always deployable
- Feature work happens on short-lived branches — prefix: `feature/`, `fix/`, `chore/`
- Branches are deleted after merge
- Direct commits to `main` are not permitted
- Release branches are used only when environment promotion requires it
 
---
 
## Definition of done
 
A piece of work is done when it is:
 
- [ ] Code reviewed and approved by at least one other engineer
- [ ] All tests passing in CI
- [ ] Coverage gate met
- [ ] Deployed to the Test environment
- [ ] Acceptance criteria verified — by a person, not just automated tests
- [ ] Observability in place — logs, metrics, or health signal present for new behaviour
 
---
 
## Failure and recovery
 
**Self-annealing.** When a pipeline fails, a deployment breaks, or an integration
regresses:
 
1. Diagnose — read the error; do not guess or retry blindly
2. Fix — patch the root cause, not the symptom
3. Update — record the finding in the project layer (what broke, why, what changed)
   so the failure cannot silently recur
 
A recurring failure that has no documented cause is an unresolved incident.
 
---
 
## Agent behaviour
 
- Do not scaffold any code or pipeline until all six bootstrapping questions are answered
  and documented
- Treat an unconfirmed testing strategy as a hard blocker — the walking skeleton must
  include a passing unit test and coverage run before it is accepted
- Treat an unapproved or incomplete tech stack as a hard blocker — ask, do not assume
- When promoting through environments, confirm the same artefact is being used
- On any pipeline or deployment failure, apply the self-annealing loop before retrying
 
---