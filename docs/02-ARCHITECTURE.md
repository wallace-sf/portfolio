# 02 — Architecture

> Clean Architecture + DDD applied in this monorepo: layers, dependency rule, and enforcement.

---

## Principles

**Clean Architecture** ensures business rules are independent of frameworks, databases, and delivery mechanisms. Dependencies always point inward — outer layers know about inner layers, never the reverse.

**Domain-Driven Design (DDD)** ensures the code reflects the real-world domain it models. Entities protect their own invariants, Value Objects enforce correctness at the type level, and bounded contexts prevent accidental coupling.

---

## Dependency Rule

Dependencies point **only inward**:

```text
core ← application ← infra ← web / api
```

```text
     Web / API (Next.js, React)
          │
          ▼
   Application (use cases, ports)
          │
          ▼
       Core (domain — entities, VOs, repositories)
          ▲
          │
      Infra (Prisma + Supabase, external services)
```

`core` never knows about `application`, `infra`, or `web/api`. `application` never knows about `infra`.

---

## Layers

| Layer | Package | Responsibility |
|-------|---------|----------------|
| **Domain** | `@repo/core` | Entities, Value Objects, invariants, repository interfaces. Zero framework dependencies. |
| **Application** | `@repo/application` | Use cases, ports (interfaces), DTOs/view models. Orchestrates the domain. |
| **Infrastructure** | `@repo/infra` | Repository implementations (Prisma + Supabase), external service adapters. |
| **Interface** | `apps/web`, `apps/api` | HTTP routes, React components, Server Actions. Calls Application layer. |

---

## Layer Restrictions

### `packages/core` — forbidden imports

| Forbidden | Reason |
|-----------|--------|
| `prisma`, `@prisma/client` | Infrastructure concern |
| `next`, `next/*` | Presentation concern |
| `react`, `react-dom` | Presentation concern |
| `axios`, `node-fetch` | HTTP client — infra concern |
| `@repo/application`, `@repo/infra` | Would invert dependency direction |

Allowed: plain TypeScript, `@repo/utils`, `uuid`.

### `packages/application`

- Forbidden: React, Next.js, Prisma, HTTP libraries
- Allowed: `@repo/core`, TypeScript interfaces (ports)
- Use cases orchestrate domain objects — never access the database directly

### `packages/infra`

- Implements the port interfaces defined in `core` / `application`
- Knows `core` and `application`, never the other way around

### `apps/web` and `apps/api`

- Consume use cases through Server Components or API Routes
- Never import concrete repositories directly
- React components must contain no business logic

---

## ESLint Architecture Enforcement

`packages/eslint-config/core.js` enforces `packages/core` restrictions at lint time:

```js
'no-restricted-imports': ['error', {
  patterns: [
    { group: ['@prisma/*', 'prisma'], message: 'core cannot import Prisma' },
    { group: ['next/*', 'next'],      message: 'core cannot import Next.js' },
    { group: ['react', 'react-dom'],  message: 'core cannot import React' },
    { group: ['axios', 'node-fetch'], message: 'core cannot import HTTP clients' },
  ],
}]
```

---

## Current State vs Target Architecture

- **Current state**: `packages/application` and `packages/infra` are still being introduced; some orchestration and reads still happen in `apps/web` using static data.
- **Target**: the full `core ← application ← infra ← web` pipeline is in place.
- **Rule**: for new code, always follow the target. For existing code, migrate incrementally.

---

## TypeScript Configuration

```json
// packages/typescript-config/base.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "paths": {
      "@repo/core/*":        ["../../packages/core/src/*"],
      "@repo/application/*": ["../../packages/application/src/*"],
      "@repo/infra/*":       ["../../packages/infra/src/*"],
      "@repo/ui/*":          ["../../packages/ui/src/*"]
    }
  }
}
```

---

## See Also

- **[03-BOUNDED-CONTEXTS](./03-BOUNDED-CONTEXTS.md)** — DDD contexts, aggregates, `packages/core` structure
- **[04-APPLICATION-LAYER](./04-APPLICATION-LAYER.md)** — Use cases and ports
- **[packages/core/decisions/](../packages/core/decisions/)** — Architectural Decision Records
