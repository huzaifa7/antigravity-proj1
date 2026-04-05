---
trigger: manual
---

# C# Workspace Rules

xtends `~/.gemini/GEMINI.md` and `00-delivery-principles.md`. Applies to all
repositories using .NET and C#. Project rules extend these — they never contradict them.

**Applies to:** `**/*.cs`, `**/*.csproj`, `**/*.sln`, `**/appsettings*.json`

Do not hallucinate legacy .NET Framework patterns, classic MVC `ControllerBase` scaffolding,
Dapper, raw `ADO.NET SqlCommand`, or block-scoped namespaces.

---

## Stack

- Runtime: .NET 9, C# 13 · Hosting: Azure App Service (Linux containers)
- API: ASP.NET Core Minimal APIs (default) — `ControllerBase` only when explicitly requested
- ORM: Entity Framework Core 9 (SQL Server) — no Dapper, no raw ADO.NET
- Testing: xUnit, FluentAssertions, Moq or NSubstitute
- DI: Microsoft.Extensions.DependencyInjection
- Observability: Application Insights, `ILogger<T>` — never `Console.WriteLine()`
- Secrets: Azure Key Vault via `IConfiguration`

---

## Architecture

**Clean architecture. Non-negotiable layer boundaries:**

| Layer | Contents | May reference |
|---|---|---|
| `src/Domain/` | Entities, enums, exceptions, interfaces | Nothing |
| `src/Application/` | CQRS handlers, DTOs, validators | Domain only |
| `src/Infrastructure/` | DbContext, EF migrations, external clients | Application |
| `src/Api/` | Endpoints, middleware, DI — no business logic | Application |

No outer layer namespace may appear in an inner layer.

**CQRS via MediatR.** Dispatch all business operations through `IMediator` — never inject
a handler directly. One handler per command/query in Application. Commands mutate state;
queries are read-only. Naming: `CreateOrderCommand` / `CreateOrderCommandHandler`.

**Repository pattern.** Interfaces in Domain, implementations in Infrastructure. Return
domain entities — map in handlers. Never expose `IQueryable` outside Infrastructure.

**Result pattern.** `Result<T>` for recoverable failures — never exceptions for control
flow. Endpoints map `Result<T>` to HTTP responses.

---

## C# conventions

- File-scoped namespaces only — block-scoped are forbidden
- Nullable reference types enabled — annotate all public members, never suppress `!`
  unless unavoidable and commented
- Primary constructors for DI — no verbose traditional constructors for field assignment
- Prefer `record` types for DTOs, value objects, commands, and queries
- All I/O: `async`, returns `Task<T>`, accepts and threads `CancellationToken`
- Never `.Result` or `.Wait()` — always `await` (prevents thread starvation and deadlocks)
- Never `Thread.Sleep` — `Task.Delay` with cancellation token
- Never `DateTime.Now` — `DateTimeOffset.UtcNow` or injected `TimeProvider`
- Prefer pattern matching over `is`/cast; expression-bodied members for single expressions

**Naming:** Classes/records `PascalCase` · Interfaces `IPascalCase` · Methods `PascalCase` ·
Async methods `Async` suffix · Private fields `_camelCase` · Locals `camelCase` · Constants `UPPER_SNAKE_CASE`

---

## Testing

- `tests/` directory mirrors `src/` exactly — e.g. `tests/Application.UnitTests/`
- One test class per production class: `{ClassName}Tests`
- xUnit only — no MSTest, no NUnit
- FluentAssertions for all assertions — never `Assert.*`
- Moq or NSubstitute for external dependencies — never mock types you own
- Arrange / Act / Assert with blank line separators
- Test method naming: `MethodName_StateUnderTest_ExpectedBehaviour`
- A MediatR handler is not complete until a test file exists covering the happy path
  and at least one validation failure branch

---

## API design

- Versioned routes: `/api/v{version}/resource`
- All errors: Problem Details (RFC 7807)
- `204 No Content` for synchronous no-body responses; `202 Accepted` + `statusUrl` for async
- Inputs validated via FluentValidation as a MediatR pipeline behaviour

---

## Security

- `[Authorize]` by default — `[AllowAnonymous]` only when explicit and intentional
- Never log PII, tokens, or connection strings
- Parameterised queries only — never concatenate SQL
- CORS: explicit allowlist only — no wildcard origins outside development

---

## Logging

Structured logging via `ILogger<T>` only — never `Console.WriteLine()`, never string
interpolation. Use named placeholders: `"Order {OrderId} created"`.

`Debug` diagnostics · `Information` business events · `Warning` recoverable · `Error` failures.
Include correlation IDs where available.

---

## Agent behaviour

**Always:**
- Place files in the correct `src/` layer — verify boundary before generating
- Use primary constructors for DI
- Add and thread `CancellationToken` through every new async method
- Scaffold command/query, handler, validator, tests, and endpoint together as a unit
- Return `Result<T>` from handlers; use `DateTimeOffset.UtcNow` or `TimeProvider`

**Never:**
- Reference outer layer namespaces in inner layers
- Expose `IQueryable` outside Infrastructure
- Use `.Result`, `.Wait()`, or `Thread.Sleep`
- Suppress nullable `!` without an explanatory comment
- Generate a `catch` block that swallows exceptions silently
- Scaffold `ControllerBase` unless explicitly requested
- Mark a handler complete without a corresponding test file

---
*Owned by the .NET tech lead. Reviewed on each major .NET version upgrade.*