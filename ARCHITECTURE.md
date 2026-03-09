# Architecture

This document describes the architectural decisions, layer responsibilities, and design principles that guide this codebase.

---

## Principles

This project is built on two complementary principles:

**Clean Architecture** ensures that business rules are independent of frameworks, databases, and delivery mechanisms. Dependencies always point inward — outer layers know about inner layers, never the other way around.

**Domain-Driven Design (DDD)** ensures the code reflects the real-world domain it models. Entities protect their own invariants, Value Objects enforce correctness at the type level, and bounded contexts prevent accidental coupling between unrelated parts of the system.

---

## Layer Overview

```
┌─────────────────────────────────────────┐
│           apps/web · apps/blog           │  Presentation
├─────────────────────────────────────────┤
│              packages/infra              │  Infrastructure
├─────────────────────────────────────────┤
│           packages/application           │  Application
├─────────────────────────────────────────┤
│              packages/core               │  Domain
└─────────────────────────────────────────┘
```

Dependencies flow **inward only**:

```
core ← application ← infra ← web
```

No layer imports from a layer outside (further from the center).

---

## Layers in Detail

### packages/core — Domain Layer

The heart of the system. Contains all business rules and has **zero external dependencies** — no React, no Prisma, no HTTP clients.

Responsibilities:

- **Entities**: objects with identity that protect their own invariants (`Project`, `Experience`, `Profile`)
- **Value Objects**: immutable, self-validating objects with no identity (`Slug`, `DateRange`, `LocalizedText`)
- **Repository interfaces**: contracts that infrastructure must implement (`IProjectRepository`)
- **Domain errors**: typed errors that represent business rule violations
- **Either pattern**: all factory methods return `Either<DomainError, T>` instead of throwing exceptions

Rule: if a file in `packages/core` imports from `react`, `next`, `prisma` or any HTTP client, it is a violation.

---

### packages/application — Application Layer

Orchestrates use cases. Knows about the domain but does not know about databases, HTTP, or UI frameworks.

Responsibilities:

- **Use Cases**: each file represents one user action (`GetProjectBySlug`, `SendContactMessage`)
- **DTOs**: plain serializable output objects consumed by delivery layers
- **Ports**: interfaces for external services that infrastructure implements (`IEmailService`)

Rule: use cases receive repository interfaces via dependency injection. They never instantiate concrete repositories directly.

---

### packages/infra — Infrastructure Layer

Implements the contracts defined by the domain and application layers.

Responsibilities:

- **Prisma repositories**: concrete implementations of domain repository interfaces
- **Mappers**: convert Prisma models to domain entities and back
- **External services**: `ResendEmailService` implements `IEmailService`
- **DI container**: resolves which concrete class to use for each interface

Rule: infrastructure knows about the domain. The domain never knows about infrastructure.

---

### apps/web — Presentation Layer

Next.js 14 App Router application. Renders the UI and delivers data to the browser.

Responsibilities:

- **Server Components**: call use cases directly, pass DTOs to client components
- **API Routes**: thin handlers that call use cases and map errors to HTTP status codes
- **Client Components**: UI interaction only — no business logic
- **Schemas**: Zod schemas for form validation

Rule: pages and components never import from `packages/infra` directly. They consume use cases via the DI container.

---

## Bounded Contexts

The domain is divided into three bounded contexts. **Contexts do not import from each other** — only the Shared Kernel is shared.

```
┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────┐
│  Portfolio Context   │  │   Blog Context        │  │  Contact Context │
│                      │  │   (post-MVP)          │  │                  │
│  Project             │  │   Post                │  │  Message         │
│  Experience          │  │   Tag                 │  │                  │
│  Profile             │  │   Category            │  │                  │
│  Skill               │  │                       │  │                  │
└──────────────────────┘  └──────────────────────┘  └──────────────────┘
          ↑                           ↑
          └───────── Shared Kernel ───┘
                Slug · DateRange · LocalizedText
                Image · Markdown · Tag
```

Public import paths:

- `@repo/core/portfolio` — Portfolio context
- `@repo/core/blog` — Blog context (stub until post-MVP)
- `@repo/core/shared` — Shared Kernel

---

## Key Design Decisions

### Either pattern instead of exceptions

Domain errors are represented as `Either<DomainError, T>` return values, not thrown exceptions. This makes error handling explicit at the type level — the TypeScript compiler forces callers to handle both success and failure cases.

```typescript
// The return type makes the failure case impossible to ignore
const result = Project.create(props); // Either<DomainError, Project>
if (result.isLeft()) return left(result.value); // handle error
const project = result.value; // Project — safe to use
```

See [ADR-001](./docs/adr/001-either-pattern.md) for the full reasoning.

---

### Repository interfaces in the domain layer

`IProjectRepository` lives in `packages/core`, not in `packages/application`. This follows the DDD principle that the domain defines the contracts it needs — infrastructure fulfills them. The domain should never be aware of how data is persisted.

See [ADR-002](./docs/adr/002-repository-interfaces-in-domain.md).

---

### Supabase + Prisma for persistence

Supabase provides a managed PostgreSQL database with a generous free tier and built-in storage for images. Prisma provides type-safe queries, schema management, and migrations. Together they give the infrastructure layer strong typing and easy deployment.

See [ADR-003](./docs/adr/003-supabase-prisma.md).

---

### Turborepo monorepo

The portfolio, blog (future), shared domain, and UI library live in the same monorepo. Turborepo provides build caching and dependency-aware task execution across packages, making the setup fast without sacrificing separation of concerns.

See [ADR-004](./docs/adr/004-turborepo-monorepo.md).

---

## ESLint Architecture Guards

Each layer has ESLint rules that prevent imports from violating the dependency rule:

```
packages/core       → cannot import react, next, prisma, axios
packages/application → cannot import react, next, prisma
```

These rules run in CI and fail the build on any violation.

---

## Testing Strategy

| Layer       | Tool                     | What is tested                                       |
| ----------- | ------------------------ | ---------------------------------------------------- |
| core        | Vitest                   | Entities, VOs, business rules — 100% coverage target |
| application | Vitest                   | Use cases with mocked repositories                   |
| web         | Vitest + Testing Library | Critical UI components                               |
| E2E         | Playwright               | Main user flows                                      |

All domain tests follow the naming convention:

```
should <expected behavior> when <context>
```
