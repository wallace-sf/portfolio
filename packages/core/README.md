# @repo/core — Domain Layer

> Domain layer of the Portfolio monorepo: entities, value objects, aggregates, repository interfaces, and shared kernel.
> **Zero external framework dependencies.**

---

## Documentation

For complete architecture and DDD documentation, see:

- **[docs/INDEX.md](../../docs/INDEX.md)** — Full documentation map
- **[docs/02-ARCHITECTURE.md](../../docs/02-ARCHITECTURE.md)** — Clean Architecture, layer rules, ESLint enforcement
- **[docs/03-BOUNDED-CONTEXTS.md](../../docs/03-BOUNDED-CONTEXTS.md)** — DDD contexts, aggregates, internal structure
- **[docs/09-PATTERNS.md](../../docs/09-PATTERNS.md)** — Either, VO, Entity, Repository templates
- **[docs/10-GLOSSARY.md](../../docs/10-GLOSSARY.md)** — Ubiquitous language
- **[decisions/](./decisions/)** — Architectural Decision Records (ADRs)

---

## This Package

`@repo/core` is the system nucleus — it enforces domain invariants and defines the contracts that outer layers must satisfy.

**Forbidden imports:** React, Next.js, Prisma, Axios, HTTP clients, `@repo/application`, `@repo/infra`
**Allowed:** plain TypeScript, `@repo/utils`, `uuid`

---

## Structure

```text
src/
  shared/           → Shared Kernel (Either, base classes, VOs, errors, i18n)
  portfolio/        → Portfolio context (Project, Experience, Profile, Skill, ...)
  blog/             → Blog context (stub — future)
  contact/          → Contact context (stub)
```

See [docs/03-BOUNDED-CONTEXTS.md](../../docs/03-BOUNDED-CONTEXTS.md) for the full internal structure.

---

## Public Exports

```typescript
// Preferred — subpath imports
import { Project, IProjectRepository } from '@repo/core/portfolio';
import { Slug, Either, ValidationError } from '@repo/core/shared';

// Full package (re-exports everything)
import { Project, Slug } from '@repo/core';
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm test` | Vitest |
| `pnpm lint` | ESLint --fix |
| `pnpm lint:check` | ESLint check |
| `pnpm format` | Prettier |
| `pnpm types` | `tsc --noEmit` |
