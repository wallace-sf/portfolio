# packages/infra — Infrastructure (Prisma, adapters, DI container)

Concrete implementations of the ports defined in `packages/core` and `packages/application`. Depends on `@repo/core` and `@repo/application`; never imported by domain or application code.

---

## Contents

- [Responsibility](#responsibility)
- [Prisma Repositories](#prisma-repositories)
- [DI Container](#di-container)
- [Email Adapter](#email-adapter)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
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

### Files

| File | Loaded by | Supabase project |
|------|-----------|------------------|
| `.env` | Prisma CLI (`db:migrate`, `db:migrate:deploy`, `db:studio`), `scripts/assert-safe-db.mjs`, and `tsx --env-file=.env` (`db:seed`, `db:seed:blog`, `db:backup`, `send:email:manual`) | **dev — always** |
| `.env.production.local` | Nothing automatically (see below) | prod |
| `.env.test.local` | Vitest (`mode=test`) | dev |

**`.env` must never point at production.** `db:migrate` runs
`prisma migrate dev`, which can reset the database. Set `DB_SAFE_REMOTE_REF`
to the **dev** project ref (the `<ref>` in `https://<ref>.supabase.co`). The
`assert-safe-db` guard only lets destructive operations through against that
ref or localhost.

To run a script against production once, export the prod file into the shell
first. Values already present in the environment win over `.env`, both for
Prisma and for `tsx --env-file`:

```bash
set -a; . ./.env.production.local; set +a; pnpm db:backup
```

`db:migrate` stays blocked this way because the prod `DIRECT_URL` doesn't match
`DB_SAFE_REMOTE_REF`. Production migrations run on deploy (`db:migrate:deploy`
in `apps/site/vercel.json`).

### Variables

| Variable | Used by | Purpose |
|----------|---------|---------|
| `DATABASE_URL` | Prisma (runtime queries) | Pooled ("Transaction", port 6543) connection string |
| `DIRECT_URL` | Prisma migrations, `db:seed`, `db:seed:blog`, `db:backup`, `assert-safe-db` | Direct ("Session", port 5432) connection string |
| `ADMIN_EMAIL` / `ADMIN_NAME` | `db:seed` | Admin user created by the seed (`ADMIN_NAME` defaults to `Admin`) |
| `DB_SAFE_REMOTE_REF` | `assert-safe-db` | Dev project ref treated as safe for destructive operations |
| `DB_ALLOW_DESTRUCTIVE` | `assert-safe-db` | Set to `1` on the command line to override the guard. Never put it in a file |
| `RESEND_API_KEY` | `ResendEmailService`, `send:email:manual` | Resend API key |
| `CONTACT_EMAIL_TO` / `CONTACT_EMAIL_FROM` | `ResendEmailService`, `send:email:manual` | Recipient and sender of contact emails |
| `SUPABASE_URL` / `SUPABASE_ANON_KEY` | `SupabaseAuthenticationGateway`, `send:email:manual` | Supabase project URL and anon key (server only) |
| `SUPABASE_TEST_*` | Auth-gateway integration test | See [Testing](#testing) |

---

## Testing

This package has two tiers of tests:

| Tier | Files | Needs a database? | Command |
|------|-------|-------------------|---------|
| **Unit** | `*.test.ts` (mappers, `FileSystemBlogPostRepository`, `ResendEmailService`, `container`, …) | No | `pnpm --filter @repo/infra test` |
| **Integration** | `*.integration.test.ts` (`PrismaProjectRepository`, `PrismaBlogPostRepository`, `PrismaProfileRepository`, `PrismaExperienceRepository`, `PrismaUserRepository`, `SupabaseAuthenticationGateway`) | Yes — a reachable Postgres / Supabase project | `pnpm --filter @repo/infra test:integration` |

- The default `test` script **excludes** the integration suites, so a fresh
  clone (or a paused dev database) never fails `@repo/infra`'s tests. The
  root-level `pnpm test:ci` (run by the lefthook `pre-commit` hook) picks up the
  infra **unit** tests this way.
- Each integration suite is also individually guarded — it self-skips (hooks
  included) when its env is absent — so `test:integration` degrades to "0 tests"
  rather than erroring on a machine with no database.
- **Env for integration tests** — copy `.env.example` to `.env.test.local` and
  fill in:
  - `DIRECT_URL` — a **session-mode** (port 5432) connection string to the
    **dev** Supabase project. The Prisma suites connect through it (bypasses
    PgBouncer). **Never point it at production.**
  - `SUPABASE_TEST_URL` / `SUPABASE_TEST_ANON_KEY` /
    `SUPABASE_TEST_SERVICE_ROLE_KEY` — only for the auth-gateway suite; it
    creates and deletes a throw-away user.
- **The suites leave the dev data untouched.** The dev project is not
  disposable — `pnpm --filter site dev` renders its content — so no suite may
  commit a delete it did not create:
  - `PrismaBlogPostRepository`, `PrismaExperienceRepository` and
    `PrismaProfileRepository` run every test through `withRollback`
    (`test/support/withRollback.ts`): an interactive transaction that is always
    rolled back. Inside it a test can empty the table (so row counts and the
    singleton profile are deterministic) and inject the transaction client into
    the repository; nothing is committed, even if the run is interrupted.
  - `PrismaProjectRepository` and `PrismaUserRepository` create rows with a
    test prefix (`test-` slug / email) and delete only those.
  - New suites should use `withRollback`. It requires the repository under test
    not to open its own `$transaction` (nested interactive transactions are not
    supported).
- There is **no hosted CI** for this repo (GitHub Actions is disabled — no
  billing). Running the integration suites is manual. A CI job with a Postgres
  service is deferred until Actions is re-enabled.

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
