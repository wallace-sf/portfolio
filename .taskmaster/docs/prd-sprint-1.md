# PRD — Sprint 1: Application Layer

## Overview

This sprint builds the Application Layer (`packages/application`) on top of the domain foundation established in Sprint 0. The goal is to create all use cases, output DTOs, and output ports required for the portfolio MVP.

## Project Context

- **Repository**: https://github.com/wallace-sf/portfolio
- **Package**: `packages/application` (Application Layer)
- **Architecture**: DDD + Clean Architecture
- **Monorepo**: Turborepo + pnpm + TypeScript strict

## Stack

- TypeScript (strict mode)
- Vitest (test runner)
- DDD patterns: Use Cases, DTOs, Ports (output interfaces)
- Either pattern for error handling (from `@repo/core`)

## Background

Sprint 0 delivered a complete domain layer with all entities, value objects, repository interfaces, and the Either pattern in `packages/core`. Sprint 1 creates the Application Layer that orchestrates these domain artifacts without depending on infrastructure (Prisma, HTTP, etc.).

The `packages/application` package:
- Imports from `packages/core` (domain)
- Defines output DTOs (plain objects for the presentation layer)
- Defines output ports (e.g., `IEmailService`)
- Implements use cases that call repository interfaces and transform domain objects into DTOs
- Must never import React, Next.js, Prisma, or any HTTP library

## Goals

1. Create and configure `packages/application` from scratch
2. Define output DTOs for all aggregate roots (Project, Experience, Profile)
3. Define the `IEmailService` output port for the contact use case
4. Implement use cases: GetFeaturedProjects, GetPublishedProjects, GetProjectBySlug, GetExperiences, GetProfile, SendContactMessage
5. Unit-test every use case with mocked repositories

## Out of Scope

- Infrastructure / Prisma (Sprint 2)
- Frontend / Next.js (Sprint 3)
- CI/CD (Sprint 4)

---

## Tasks

### T-09 — Create and configure packages/application

**GitHub Issue**: #274
**Priority**: High
**Dependencies**: none (Sprint 0 complete)

Create the `packages/application` package from scratch. This is the foundation that all Sprint 1 use cases depend on.

**Acceptance Criteria**:

- `package.json` configured with name `@repo/application`
- `tsconfig.json` extending `@repo/typescript-config/base` with path alias `@repo/core/*`
- Barrel export in `src/index.ts`
- ESLint rule `no-restricted-imports` configured (forbids React, Next.js, Prisma, HTTP clients)
- `turbo.json` updated with `@repo/application` build dependency
- `pnpm-workspace.yaml` includes the new package
- `vitest.config.ts` created for unit tests

**Files**:

- `packages/application/package.json` ← create
- `packages/application/tsconfig.json` ← create
- `packages/application/vitest.config.ts` ← create
- `packages/application/src/index.ts` ← create
- `packages/eslint-config/application.js` ← create
- `turbo.json` ← update build pipeline

---

### T-10 — Create output DTOs

**GitHub Issue**: #275
**Priority**: High
**Dependencies**: T-09

Create all Data Transfer Objects that flow between the Application Layer and the Presentation Layer. DTOs are plain TypeScript interfaces — no domain logic, no constructors.

**Acceptance Criteria**:

- `ProjectSummaryDTO`: `{ id: string, slug: string, title: string, caption: string, coverImage: { url: string, alt: string }, theme?: string, skills: string[], publishedAt: string }`
- `ProjectDetailDTO`: superset of Summary + `{ content: string, summary?: string, objectives?: string, role?: string, team?: string, period: { startAt: string, endAt?: string }, relatedProjects: ProjectSummaryDTO[] }`
- `ExperienceSkillDTO`: `{ id: string, name: string, type: string, workDescription: string }`
- `ExperienceDTO`: `{ id: string, company: string, position: string, location: string, description?: string, logo?: { url: string, alt: string }, employmentType: string, locationType: string, startAt: string, endAt?: string, skills: ExperienceSkillDTO[] }`
- `ProfileStatDTO`: `{ label: string, value: string, icon: string }`
- `SocialNetworkDTO`: `{ id: string, name: string, url: string }`
- `ProfileDTO`: `{ id: string, name: string, headline: string, bio: string, photo: { url: string, alt: string }, stats: ProfileStatDTO[], featuredProjectSlugs: string[], socialNetworks: SocialNetworkDTO[] }`
- All DTOs are in `packages/application/src/portfolio/dtos/`
- All DTOs exported from `packages/application/src/index.ts`

**Files**:

- `packages/application/src/portfolio/dtos/ProjectSummaryDTO.ts` ← create
- `packages/application/src/portfolio/dtos/ProjectDetailDTO.ts` ← create
- `packages/application/src/portfolio/dtos/ExperienceDTO.ts` ← create
- `packages/application/src/portfolio/dtos/ProfileDTO.ts` ← create
- `packages/application/src/portfolio/dtos/index.ts` ← create

---

### T-11 — Create IEmailService port

**GitHub Issue**: #276
**Priority**: High
**Dependencies**: T-09

Create the output port interface `IEmailService` for the contact use case. The infrastructure layer will implement this with Resend in Sprint 2.

**Acceptance Criteria**:

- `IEmailService.send(dto: ContactMessageDTO): Promise<Either<DomainError, void>>`
- `ContactMessageDTO`: `{ name: string, email: string, message: string }`
- Exported from `packages/application/src/index.ts`

**Files**:

- `packages/application/src/contact/ports/IEmailService.ts` ← create
- `packages/application/src/contact/dtos/ContactMessageDTO.ts` ← create
- `packages/application/src/contact/index.ts` ← create

---

### T-12 — Implement use case GetFeaturedProjects

**GitHub Issue**: #277
**Priority**: High
**Dependencies**: T-09, T-10

Use case that returns projects marked as `featured: true` for display on the Home page.

**Acceptance Criteria**:

- Input: `{ locale: Locale }`
- Output: `Either<DomainError, ProjectSummaryDTO[]>`
- Uses `IProjectRepository.findFeatured()` via constructor injection
- Maps domain `Project` to `ProjectSummaryDTO` using the given locale
- Unit test: happy path returns mapped DTOs; repository error propagated

**Files**:

- `packages/application/src/portfolio/use-cases/GetFeaturedProjects.ts` ← create
- `packages/application/test/portfolio/GetFeaturedProjects.test.ts` ← create

---

### T-13 — Implement use case GetPublishedProjects

**GitHub Issue**: #278
**Priority**: High
**Dependencies**: T-09, T-10

Use case that returns all projects with `status: PUBLISHED` for the Portfolio page.

**Acceptance Criteria**:

- Input: `{ locale: Locale }`
- Output: `Either<DomainError, ProjectSummaryDTO[]>`
- Uses `IProjectRepository.findPublished()`
- Results ordered by `publishedAt DESC`
- Unit test: happy path, empty list

**Files**:

- `packages/application/src/portfolio/use-cases/GetPublishedProjects.ts` ← create
- `packages/application/test/portfolio/GetPublishedProjects.test.ts` ← create

---

### T-14 — Implement use case GetProjectBySlug

**GitHub Issue**: #279
**Priority**: High
**Dependencies**: T-09, T-10

Use case that finds a project by slug for the Project Detail page. Includes related projects in the output DTO.

**Acceptance Criteria**:

- Input: `{ slug: string, locale: Locale }`
- Output: `Either<NotFoundError | DomainError, ProjectDetailDTO>`
- `ProjectDetailDTO.relatedProjects` populated via `IProjectRepository.findRelated()`
- Returns `NotFoundError` when slug not found
- Returns `ValidationError` (via `Slug.create()`) when slug is invalid
- Unit tests: happy path, not found, invalid slug

**Files**:

- `packages/application/src/portfolio/use-cases/GetProjectBySlug.ts` ← create
- `packages/application/test/portfolio/GetProjectBySlug.test.ts` ← create

---

### T-15 — Implement use case GetExperiences

**GitHub Issue**: #280
**Priority**: High
**Dependencies**: T-09, T-10

Use case that returns all professional experiences for the Experiences page, including skills with contextual `workDescription`.

**Acceptance Criteria**:

- Input: `{ locale: Locale }`
- Output: `Either<DomainError, ExperienceDTO[]>`
- Uses `IExperienceRepository.findAll()`
- Results ordered by `startAt DESC`
- `ExperienceSkillDTO` includes `workDescription` (localized)
- Unit test: happy path with skills, empty list

**Files**:

- `packages/application/src/portfolio/use-cases/GetExperiences.ts` ← create
- `packages/application/test/portfolio/GetExperiences.test.ts` ← create

---

### T-16 — Implement use case GetProfile

**GitHub Issue**: #281
**Priority**: High
**Dependencies**: T-09, T-10

Use case that returns profile data for the Home hero and sidebar.

**Acceptance Criteria**:

- Input: `{ locale: Locale }`
- Output: `Either<NotFoundError, ProfileDTO>`
- Uses `IProfileRepository.find()`
- Returns `NotFoundError` when profile not registered
- `ProfileDTO` includes `stats[]` and `socialNetworks[]`
- Unit test: happy path, not found

**Files**:

- `packages/application/src/portfolio/use-cases/GetProfile.ts` ← create
- `packages/application/test/portfolio/GetProfile.test.ts` ← create

---

### T-17 — Implement use case SendContactMessage

**GitHub Issue**: #282
**Priority**: Medium
**Dependencies**: T-09, T-11

Use case that validates and sends the contact form message via `IEmailService`.

**Acceptance Criteria**:

- Input: `{ name: string, email: string, message: string }`
- Output: `Either<ValidationError | DomainError, void>`
- Validates: name not empty, valid email format, message not empty
- Calls `IEmailService.send()` only after validation passes
- Returns `IEmailService` error if send fails
- Tests: happy path, name empty, invalid email, message empty, email service error

**Files**:

- `packages/application/src/contact/use-cases/SendContactMessage.ts` ← create
- `packages/application/test/contact/SendContactMessage.test.ts` ← create

---

## Execution Order

```
T-09
  ├── T-10
  │     ├── T-12 (GetFeaturedProjects)
  │     ├── T-13 (GetPublishedProjects)
  │     ├── T-14 (GetProjectBySlug)
  │     ├── T-15 (GetExperiences)
  │     └── T-16 (GetProfile)
  └── T-11
        └── T-17 (SendContactMessage)
```

## Definition of Done

- [ ] All tasks completed and tests passing
- [ ] `pnpm test` passes in `packages/application` with Vitest
- [ ] No imports of React, Next.js, Prisma, or HTTP clients in `packages/application`
- [ ] Every use case has unit tests with mocked repositories
- [ ] All DTOs and ports exported from `packages/application/src/index.ts`
- [ ] `turbo.json` pipeline updated
- [ ] Ready to start Sprint 2 (Infrastructure Layer)
