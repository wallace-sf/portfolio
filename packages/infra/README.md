# packages/infra — Infrastructure (Prisma, adapters, DI container)

Concrete implementations of the ports defined in `packages/core` and `packages/application`. Depends on `@repo/core` and `@repo/application`; never imported by domain or application code.

---

## Contents

- [Responsibility](#responsibility)
- [Prisma Repositories](#prisma-repositories)
- [DI Container](#di-container)
- [Email Adapter](#email-adapter)
- [Environment Variables](#environment-variables)
- [Structure](#structure)

---

## Responsibility

- Implement **repository ports** (`IProjectRepository`, `IExperienceRepository`, etc.) using **Prisma + Supabase Postgres**.
- Provide an **email adapter** (`ResendEmailService`) implementing `IEmailService`.
- Wire all dependencies through a **DI container** (`makeContainer`, `getContainer`) — the single composition root for route handlers.
- Keep `@repo/core` and `@repo/application` free of infrastructure details: all Prisma and Supabase SDK usage lives here.

---

## Prisma Repositories

| Interface (port) | Implementation | Key methods |
|------------------|---------------|-------------|
| `IProjectRepository` | `PrismaProjectRepository` | `findAll`, `findBySlug`, `save` |
| `IExperienceRepository` | `PrismaExperienceRepository` | `findAll` |
| `IProfileRepository` | `PrismaProfileRepository` | `find`, `save` |
| `IUserRepository` | `PrismaUserRepository` | `findById`, `findByEmail` |

Each repository uses a **mapper** to convert Prisma rows to domain entities and back, keeping Prisma types isolated within this package.

---

## DI Container

`getContainer()` returns a lazily-initialized singleton container wiring all repositories and services. Route handlers call `getContainer()` — they never instantiate concrete classes directly.

```typescript
import { getContainer } from '@repo/infra';

const container = getContainer();
const result = await container.getProjectBySlug.execute({ slug });
```

---

## Email Adapter

`ResendEmailService` implements `IEmailService` using the [Resend](https://resend.com) API. Used by the `SendContactMessage` use case.

---

## Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | Yes | Prisma database connection string |
| `RESEND_API_KEY` | Yes | Resend API key for sending emails |
| `RESEND_FROM_EMAIL` | Yes | Sender address for contact emails |
| `SUPABASE_URL` | When using Supabase Auth | Supabase project URL |
| `SUPABASE_ANON_KEY` | When using Supabase Auth | Anonymous key (server/edge only) |
| `SUPABASE_SERVICE_ROLE_KEY` | When using Supabase Auth | Service role key — **never expose to the browser** |

---

## Structure

```
packages/infra/src/
├── container/         # makeContainer, getContainer
├── database/          # PrismaClient singleton
├── repositories/
│   ├── PrismaProjectRepository.ts
│   ├── PrismaExperienceRepository.ts
│   ├── PrismaProfileRepository.ts
│   └── PrismaUserRepository.ts
├── services/
│   └── ResendEmailService.ts
└── mappers/           # Row ↔ domain entity converters
```

---

## See Also

- [02-ARCHITECTURE](../../docs/02-ARCHITECTURE.md) — dependency rule and layer restrictions
- [03-BOUNDED-CONTEXTS](../../docs/03-BOUNDED-CONTEXTS.md) — repository interfaces
- [04-APPLICATION-LAYER](../../docs/04-APPLICATION-LAYER.md) — use cases and port contracts
- [11-IDENTITY](../../docs/11-IDENTITY.md) — authentication gateway (planned)
