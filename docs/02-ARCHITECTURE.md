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
| **Interface** | `apps/web`, `apps/api` | HTTP route handlers (REST) compose use cases; React renders data obtained via **HTTP** from the app. |

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

- **REST is mandatory for presentation:** pages, layouts, and client components fetch the **HTTP API** (`/api/v1/...`). They must **not** import or call `@repo/application` use cases directly.
- **Composition root:** only **HTTP route handlers** (e.g. `apps/web/app/api/**` or `apps/api`) wire `@repo/infra` with `@repo/application` and invoke use cases. That is the single entry point from the outside world into the application layer.
- Never import concrete repositories from presentation code.
- React components must contain no business logic.

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

- **`packages/core`**, **`packages/application`**, and **`packages/infra`** are in place (Portfolio + Identity domain, Prisma repositories, use cases, DTOs).
- **REST boundary**: new presentation code must go through the documented API ([05-API-CONTRACTS](./05-API-CONTRACTS.md)); route handlers are added or extended as needed. Legacy static data in `apps/web` should be migrated behind the same HTTP surface.
- **Rule**: do not bypass the API from the front-end — even on the server, use `fetch` to the app’s own API (or a shared route-handler module called only from `app/api`, not from `page.tsx`).

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
