# PRD — Sprint 2: Infrastructure Layer

## Overview

This sprint implements the Infrastructure Layer (`packages/infra`) on top of the Application Layer built in Sprint 1. The goal is to connect all use cases to real data sources (Prisma + Supabase) and external services (Resend), and expose the first API endpoint.

## Project Context

- **Repository**: https://github.com/wallace-sf/portfolio
- **Package**: `packages/infra` (Infrastructure Layer) + `apps/web` (API Routes)
- **Architecture**: DDD + Clean Architecture
- **Monorepo**: Turborepo + pnpm + TypeScript strict

## Stack

- TypeScript (strict mode)
- Prisma ORM (database access)
- Supabase (Postgres hosted)
- Resend (transactional email)
- Next.js API Routes (thin HTTP layer)

## Background

Sprint 1 delivered a complete Application Layer with all use cases, DTOs, and port interfaces in `packages/application`. Sprint 2 implements the concrete infrastructure — Prisma repositories, email service, DI container, and the first API endpoint.

The `packages/infra` package:
- Imports from `packages/core` (domain) and `packages/application` (ports)
- Implements repository interfaces with Prisma
- Implements `IEmailService` with Resend
- Must never import React, Next.js UI components, or application business logic

## Goals

1. Configure `packages/infra` with Prisma + Supabase
2. Implement `PrismaProjectRepository`
3. Implement `PrismaExperienceRepository`
4. Implement `PrismaProfileRepository`
5. Implement `ResendEmailService`
6. Create the dependency injection container
7. Define the response envelope and implement `GET /api/v1/projects/:slug`

## Out of Scope

- Frontend / Next.js pages (Sprint 3)
- Remaining API endpoints beyond `GET /api/v1/projects/:slug` (Sprint 3)
- CI/CD (Sprint 4)

---

## Tasks

### T-25 — Configure packages/infra with Prisma + Supabase

**GitHub Issue**: #283
**Priority**: High
**Dependencies**: none

Configure the `packages/infra` package from scratch with Prisma ORM connected to Supabase (Postgres). Create the complete schema and initial migration.

**Acceptance Criteria**:

- `packages/infra/package.json` configured with Prisma
- `schema.prisma` with models: `Project`, `Experience`, `Skill`, `ExperienceSkill`, `Profile`, `ProfileStat`, `SocialNetwork`
- Initial migration created and applied on Supabase
- `prisma/client.ts` exports a singleton PrismaClient instance
- `.env.example` updated with `DATABASE_URL` and `DIRECT_URL`
- `pnpm run db:migrate` and `pnpm run db:generate` working

**Files**:

- `packages/infra/package.json` ← create
- `packages/infra/tsconfig.json` ← create
- `packages/infra/prisma/schema.prisma` ← create
- `packages/infra/src/prisma/client.ts` ← create
- `.env.example` ← create/update

---

### T-26 — Implement PrismaProjectRepository

**GitHub Issue**: #284
**Priority**: High
**Dependencies**: T-25

Implement `IProjectRepository` using Prisma + Supabase, including a mapper from Prisma model to domain entity.

**Acceptance Criteria**:

- Implements all methods of `IProjectRepository`
- `ProjectMapper` converts `PrismaProject` → `Project` entity
- `findFeatured()` filters by `featured: true` and `status: PUBLISHED`
- `findBySlug()` searches by unique slug
- `findRelated()` returns related projects excluding the current one

**Files**:

- `packages/infra/src/repositories/PrismaProjectRepository.ts` ← create
- `packages/infra/src/mappers/ProjectMapper.ts` ← create

---

### T-27 — Implement PrismaExperienceRepository

**GitHub Issue**: #285
**Priority**: High
**Dependencies**: T-25

Implement `IExperienceRepository` with Prisma, including the join with `ExperienceSkill` to return skills with `workDescription`.

**Acceptance Criteria**:

- Implements all methods of `IExperienceRepository`
- `findAll()` includes skills via join (`include: { experienceSkills: { include: { skill: true } } }`)
- `ExperienceMapper` converts Prisma result → `Experience` entity with `ExperienceSkill[]`
- Results ordered by `startAt DESC`

**Files**:

- `packages/infra/src/repositories/PrismaExperienceRepository.ts` ← create
- `packages/infra/src/mappers/ExperienceMapper.ts` ← create

---

### T-28 — Implement PrismaProfileRepository

**GitHub Issue**: #286
**Priority**: High
**Dependencies**: T-25

Implement `IProfileRepository` with Prisma, including stats and social networks.

**Acceptance Criteria**:

- `find()` returns the single profile including `stats` and `socialNetworks`
- `ProfileMapper` converts Prisma result → `Profile` entity
- Returns `null` if not found (use case handles as `NotFoundError`)

**Files**:

- `packages/infra/src/repositories/PrismaProfileRepository.ts` ← create
- `packages/infra/src/mappers/ProfileMapper.ts` ← create

---

### T-29 — Implement ResendEmailService

**GitHub Issue**: #287
**Priority**: Medium
**Dependencies**: T-25
**Status**: Done

Implement `IEmailService` using the Resend API for sending contact form emails.

**Acceptance Criteria**:

- Implements `IEmailService.send(ContactMessageDTO)`
- Email template includes sender's name, email, and message
- `RESEND_API_KEY`, `CONTACT_EMAIL_TO`, `CONTACT_EMAIL_FROM` documented in `.env.example`
- Returns `Either<DomainError, void>`

**Implementation notes**:

- **Critical**: Resend SDK never throws for API errors (e.g. 403 sending to unverified address). It always returns `{ data, error }`. The service must destructure `{ error }` and return `left(new DomainError(...))` when `error` is truthy — a plain `try/catch` is insufficient.
- `send-email-manual.ts` integration script added to `packages/infra/scripts/` for manual validation with real Resend credentials. Run via `pnpm send:email:manual` with `.env` populated.

**Files**:

- `packages/infra/src/services/ResendEmailService.ts` ← created
- `packages/infra/scripts/send-email-manual.ts` ← created
- `.env.example` ← updated with `RESEND_API_KEY`, `CONTACT_EMAIL_TO`, `CONTACT_EMAIL_FROM`

---

### T-30 — Create dependency injection container

**GitHub Issue**: #288
**Priority**: High
**Dependencies**: T-26, T-27, T-28, T-29
**Status**: Done

Create a factory/container that resolves concrete implementations of the port interfaces. Exported for consumption in `apps/web` Server Components.

**Acceptance Criteria**:

- `container.ts` exports `makeContainer()` and singleton `getContainer()`
- Resolves: `IProjectRepository` → `PrismaProjectRepository`
- Resolves: `IExperienceRepository` → `PrismaExperienceRepository`
- Resolves: `IProfileRepository` → `PrismaProfileRepository`
- Resolves: `IEmailService` → `ResendEmailService`
- Validates required env vars on startup; throws with all missing names in a single error
- `packages/infra/src/index.ts` exports the container

**Implementation notes**:

- `validateEnv(vars: readonly string[])` utility extracted to `packages/utils/src/env/validateEnv.ts` and exported as `@repo/utils/env` subpath. Throws with all missing variable names listed in one error — never silently ignores missing config.
- `env` object with lazy getters added to `packages/infra/src/env.ts` (`RESEND_API_KEY`, `CONTACT_EMAIL_TO`, `CONTACT_EMAIL_FROM`). Container calls `validateEnv(Object.keys(env))` before wiring dependencies. Avoids scattered `process.env` accesses.

**Files**:

- `packages/infra/src/container.ts` ← created
- `packages/infra/src/env.ts` ← created
- `packages/infra/src/index.ts` ← created
- `packages/utils/src/env/validateEnv.ts` ← created
- `packages/utils/src/env/index.ts` ← created
- `packages/utils/package.json` ← added `./env` subpath export

---

### T-31 — Define Response Envelope and GET /api/v1/projects/:slug endpoint

**GitHub Issue**: #289
**Priority**: Medium
**Dependencies**: T-30
**Status**: DEFERRED → moved to Sprint 3

This task was deferred. The development order is: core → infra → API → frontend. `apps/web` (including API routes hosted there) is the last layer to be touched. See Sprint 3 PRD for the rescheduled implementation.

**Rationale**: API routes in `apps/web/src/app/api/` are part of the frontend application. Implementing them before the presentation layer sprint introduces premature coupling and violates the established build order.

---

---

### T-ID1 — Identity: Core domain (Email, Role, User, UnauthorizedError, IUserRepository, AccessPolicy)

**GitHub Issue**: #404
**Priority**: Low
**Dependencies**: T-25

Implement the Identity bounded context in `packages/core`. Authentication via Supabase Auth; authorization model is binary (`ADMIN | VISITOR`).

**Acceptance Criteria**:

- `Email` Value Object with format validation
- `Role` enum: `ADMIN | VISITOR`
- `User` entity: `id: Id`, `email: Email`, `role: Role`; `User.create()` returns `Either<DomainError, User>`
- `UnauthorizedError` extends `DomainError` with code `UNAUTHORIZED`
- `IUserRepository`: `findById(id: Id): Promise<User | null>`, `findByEmail(email: Email): Promise<User | null>`
- `AccessPolicy.isAdmin(user: User): boolean`
- All exported from `packages/core/src/identity/index.ts`
- Unit tests for `User.create()` and `AccessPolicy`

**Out of scope for MVP**: logout, magic link/OAuth, audit log, notifications.

**Files**:

- `packages/core/src/identity/vo/Email.ts` ← create
- `packages/core/src/identity/model/User.ts` ← create
- `packages/core/src/identity/policy/AccessPolicy.ts` ← create
- `packages/core/src/identity/repositories/IUserRepository.ts` ← create
- `packages/core/src/shared/errors/UnauthorizedError.ts` ← create
- `packages/core/src/identity/index.ts` ← create

---

### T-ID2 — Identity: Infrastructure (migration users, SupabaseUserRepository, seed admin)

**GitHub Issue**: #405
**Priority**: Low
**Dependencies**: T-ID1

Implement the infrastructure for the Identity bounded context.

**Acceptance Criteria**:

- Prisma migration creating `users` table with columns `id`, `email`, `role`
- `SupabaseUserRepository` implements `IUserRepository`
- Seed script creates initial admin user
- `makeContainer()` wires `SupabaseUserRepository` → `IUserRepository`

**Files**:

- `packages/infra/prisma/migrations/...` ← create migration
- `packages/infra/src/repositories/identity/SupabaseUserRepository.ts` ← create
- `packages/infra/prisma/seed.ts` ← update with admin seed

---

### T-ID3 — Identity: Application (GetCurrentUserUseCase, EnsureAdminUseCase)

**GitHub Issue**: #406
**Priority**: Low
**Dependencies**: T-ID1, T-ID2

Implement the application use cases for the Identity bounded context.

**Acceptance Criteria**:

- `GetCurrentUserUseCase`: input `{ userId: string }` → `Either<NotFoundError, UserDTO>`
- `EnsureAdminUseCase`: input `{ userId: string }` → `Either<UnauthorizedError | NotFoundError, void>`; uses `AccessPolicy.isAdmin()`
- `UserDTO`: `{ id: string, email: string, role: string }`
- All exported from `packages/application/src/identity/index.ts`
- Unit tests for both use cases with mocked repository

**Files**:

- `packages/application/src/identity/use-cases/GetCurrentUserUseCase.ts` ← create
- `packages/application/src/identity/use-cases/EnsureAdminUseCase.ts` ← create
- `packages/application/src/identity/dtos/UserDTO.ts` ← create
- `packages/application/src/identity/index.ts` ← create

---

## Execution Order

```
T-25 (packages/infra scaffold + Prisma schema)
  ├── T-26 (PrismaProjectRepository)
  ├── T-27 (PrismaExperienceRepository)
  ├── T-28 (PrismaProfileRepository)
  └── T-29 (ResendEmailService)
        └── T-30 (DI container)

T-ID1 (Identity core)
  └── T-ID2 (Identity infra)
        └── T-ID3 (Identity application)

T-31 → DEFERRED to Sprint 3
```

## Definition of Done

- [x] `packages/infra` package configured and building
- [x] All Prisma repositories implemented and returning domain entities
- [x] `ResendEmailService` implemented and functional (with correct `{ data, error }` handling)
- [x] `validateEnv` utility in `@repo/utils/env`; `env` object with lazy getters in `packages/infra/src/env.ts`
- [x] DI container wiring all dependencies with startup env validation
- [ ] Identity bounded context: core, infra, application layers complete
- [ ] `GET /api/v1/projects/:slug` → DEFERRED to Sprint 3
- [ ] `.env.example` documents all required environment variables
- [ ] Ready to start Sprint 3 (Presentation Layer)
