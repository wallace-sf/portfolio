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

Implement `IEmailService` using the Resend API for sending contact form emails.

**Acceptance Criteria**:

- Implements `IEmailService.send(ContactMessageDTO)`
- Email template includes sender's name, email, and message
- `RESEND_API_KEY` environment variable documented in `.env.example`
- Returns `Either<DomainError, void>`

**Files**:

- `packages/infra/src/services/ResendEmailService.ts` ← create
- `.env.example` ← update with `RESEND_API_KEY`

---

### T-30 — Create dependency injection container

**GitHub Issue**: #288
**Priority**: High
**Dependencies**: T-26, T-27, T-28, T-29

Create a factory/container that resolves concrete implementations of the port interfaces. Exported for consumption in `apps/web` Server Components.

**Acceptance Criteria**:

- `container.ts` exports a `makeContainer()` function with resolved repositories
- Resolves: `IProjectRepository` → `PrismaProjectRepository`
- Resolves: `IExperienceRepository` → `PrismaExperienceRepository`
- Resolves: `IProfileRepository` → `PrismaProfileRepository`
- Resolves: `IEmailService` → `ResendEmailService`
- `packages/infra/src/index.ts` exports the container

**Files**:

- `packages/infra/src/container.ts` ← create
- `packages/infra/src/index.ts` ← create

---

### T-31 — Define Response Envelope and GET /api/v1/projects/:slug endpoint

**GitHub Issue**: #289
**Priority**: Medium
**Dependencies**: T-30

Introduce a consistent REST response envelope and implement the minimum projects endpoint. The API layer must be thin — only calls use cases and maps errors to HTTP.

**Acceptance Criteria**:

- Response envelope defined and used in all endpoints:
  - Success: `{ data: T, error: null, meta?: {...} }`
  - Failure: `{ data: null, error: { code: string, message: string, details?: unknown }, meta?: {...} }`
- Endpoint implemented: `GET /api/v1/projects/:slug`
- Handler:
  - calls `GetProjectBySlug` use case
  - maps `NotFoundError` → HTTP 404
  - maps `ValidationError` / `DomainError` → HTTP 400
  - maps unexpected errors → HTTP 500
- Error message localized based on request locale
- No domain logic in the handler

**Files**:

- `apps/web/src/app/api/v1/projects/[slug]/route.ts` ← create
- `apps/web/src/lib/api/envelope.ts` ← create envelope helper
- `apps/web/src/lib/api/error-mapper.ts` ← create error mapping

---

## Execution Order

```
T-25 (packages/infra scaffold + Prisma schema)
  ├── T-26 (PrismaProjectRepository)
  ├── T-27 (PrismaExperienceRepository)
  ├── T-28 (PrismaProfileRepository)
  └── T-29 (ResendEmailService)
        └── T-30 (DI container)
              └── T-31 (Response Envelope + GET /api/v1/projects/:slug)
```

## Definition of Done

- [ ] `packages/infra` package configured and building
- [ ] All Prisma repositories implemented and returning domain entities
- [ ] `ResendEmailService` implemented and functional
- [ ] DI container wiring all dependencies
- [ ] `GET /api/v1/projects/:slug` endpoint responding with correct envelope
- [ ] `.env.example` documents all required environment variables
- [ ] Ready to start Sprint 3 (Presentation Layer)
