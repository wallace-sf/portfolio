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

1. Refactor `Validator` in `@repo/utils` to use Zod internally and rename `new` → `of`
2. Migrate all core Value Objects (Slug, LocalizedText, DateRange, Profile) to use the refactored Validator
3. Refactor documentation: unify, deduplicate, and reorganize all `.md` files under `docs/`
4. Create and configure `packages/application` from scratch
5. Define output DTOs for all aggregate roots (Project, Experience, Profile)
6. Define the `IEmailService` output port for the contact use case
7. Implement use cases: GetFeaturedProjects, GetPublishedProjects, GetProjectBySlug, GetExperiences, GetProfile, SendContactMessage
8. Unit-test every use case with mocked repositories

## Out of Scope

- Infrastructure / Prisma (Sprint 2)
- Frontend / Next.js (Sprint 3)
- CI/CD (Sprint 4)

---

## Tasks

### T-42 — Refactor Validator to use Zod and rename new→of

**GitHub Issue**: #329
**Priority**: Critical
**Dependencies**: none

Refactor `Validator` in `packages/utils` to use Zod internally, rename `Validator.new` to `Validator.of`, and add the methods required for migrating Value Objects away from manual `if` guards.

**Acceptance Criteria**:

- `zod` added as dependency in `packages/utils/package.json`
- `Validator.new` renamed to `Validator.of` in `Validator.ts` and all 9 VOs that use it (Id, Text, Url, DateTime, Name, EmploymentType, Fluency, SkillType, LocationType)
- Validator internals replaced with Zod schemas; external API (`{ isValid, error }` and "first error" behaviour) preserved
- New methods added: `.regex(pattern, error)`, `.refine(predicate, error)`, `.notEmpty(error)`
- `packages/utils/test/node/Validator.test.ts` updated to match renamed API
- `pnpm test` passes at root

**Files**:

- `packages/utils/src/validator/Validator.ts` ← refactor
- `packages/utils/package.json` ← add zod
- 9 VOs in `packages/core` ← rename `Validator.new` → `Validator.of`
- `packages/utils/test/node/Validator.test.ts` ← update

---

### T-43 — Migrate Slug, LocalizedText, DateRange and Profile to use Validator

**GitHub Issue**: #330
**Priority**: Critical
**Dependencies**: T-42

Eliminate all manual `if` validation guards in core Value Objects and the Profile entity. All validation rules must go through `Validator`.

**Acceptance Criteria**:

- `Slug.ts`: replace `if` guards with `Validator.of(raw).length(3, ...).regex(SLUG_REGEX, ...).validate()`
- `LocalizedText.ts`: replace `if` guards with `Validator.of(input['pt-BR']).notNil(...).notEmpty(...)`
- `DateRange.ts`: replace `if` guard with `Validator.of(...).refine(start <= end, ...)`
- `Profile.ts`: replace `if` guard for `featuredProjectSlugs.length > 6` with `Validator.of(...).refine(...)`
- All existing ERROR_CODEs and messages preserved
- All tests passing

**Files**:

- `packages/core/src/shared/vo/Slug.ts` ← refactor
- `packages/core/src/shared/i18n/LocalizedText.ts` ← refactor
- `packages/core/src/shared/vo/DateRange.ts` ← refactor
- `packages/core/src/portfolio/entities/profile/model/Profile.ts` ← refactor

---

### T-44 — Refactor documentation: unify, deduplicate and reorganize .md files

**GitHub Issue**: #336
**Priority**: Critical
**Dependencies**: none

The current documentation is scattered, redundant and lacks clear hierarchy. Consolidate everything into a numbered structure under `docs/`, slim down `CLAUDE.md` to ~200 lines, and ensure every concept appears exactly once.

**Acceptance Criteria**:

- `docs/INDEX.md` created as the single navigation entry point
- `docs/00-INTRODUCTION.md` through `docs/10-GLOSSARY.md` created (prefixed for logical order)
- `CLAUDE.md` reduced to ~200 lines (Role, Monorepo structure, link to INDEX, code templates, Workflow, Task Master)
- No concept appears in more than one document
- All internal links resolve
- No document references a file that does not exist
- Deprecated/duplicated docs removed

**Files**:

- `docs/INDEX.md` ← create
- `docs/00-INTRODUCTION.md` through `docs/10-GLOSSARY.md` ← create
- `CLAUDE.md` ← slim down
- `docs/ARCHITECTURE.md`, `docs/BOUNDED_CONTEXTS.md`, etc. ← remove or merge

---

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

### T-18 — Enforce VO vs primitive+Validator rule on core entities

**GitHub Issue**: #363
**Priority**: Medium
**Dependencies**: T-42, T-43

Audit all entities in `packages/core/src/portfolio/entities/` and ensure every primitive or enum property has domain invariant validation in `create()` using `Validator`. Do not create new VOs for simple cases; use `Validator.of(value).in([...])` or `.refine()` with a single `left` return.

**Acceptance Criteria**:

- Every primitive/enum property in an entity has at least one `Validator` rule in `create()`
- Gap identified: `Project.status: ProjectStatus` — add `Validator.of(props.status).in(Object.values(ProjectStatus), '...')` in `Project.create()`
- No new VOs created for stable enums or boolean properties
- All existing tests continue to pass

**Files**:

- `packages/core/src/portfolio/entities/project/model/Project.ts` ← fix status validation
- Other entity files as identified in audit

---

### T-19 — Document VO vs primitive+Validator rule in CLAUDE.md

**GitHub Issue**: #364
**Priority**: Medium
**Dependencies**: T-18

Add a subsection **"Entity properties: VO vs primitive + Validator"** inside **"🧩 DDD Code Templates"** in `CLAUDE.md`, after **"Domain Validation (core)"**. The rule must be clear enough to guide implementation without ambiguity.

**Acceptance Criteria**:

- Subsection present in CLAUDE.md within "🧩 DDD Code Templates"
- Rule documented: VO for rich/reused concepts; primitive/enum + Validator for simple cases
- Examples provided (Slug, Name → VO; ProjectStatus, boolean → primitive + Validator)

**Files**:

- `CLAUDE.md` ← add subsection

---

### T-20 — Update docs/ to reflect VO vs primitive+Validator rule

**GitHub Issue**: #365
**Priority**: Low
**Dependencies**: T-19

Update `docs/09-PATTERNS.md` and `docs/06-VALIDATION.md` to reference the VO vs primitive+Validator rule. Keep additions concise — do not duplicate CLAUDE.md content, just reinforce and cross-reference.

**Acceptance Criteria**:

- `docs/09-PATTERNS.md` contains bullet/paragraph on VO vs primitive+Validator in Entity or VO section
- `docs/06-VALIDATION.md` mentions Validator usage for primitive/enum invariants in `create()`
- No duplication of content already in CLAUDE.md

**Files**:

- `docs/09-PATTERNS.md` ← update
- `docs/06-VALIDATION.md` ← update

---

---

### T-DDD1 — Remove ExperienceSkill and reference Skill by Id

**GitHub Issue**: #400
**Priority**: Medium
**Dependencies**: T-08

Remove the `ExperienceSkill` VO and replace it with `Id[]` references inside the `Experience` aggregate. In strict DDD, distinct aggregates reference each other by `Id`, not by embedded object.

**Motivation**: `ExperienceSkill` was created to carry `workDescription` per skill. `Experience.description` is sufficient, making the VO superfluous.

**Acceptance Criteria**:

- `Experience.skills` typed as `Id[]`; `IExperienceProps.skills: string[]`
- `ExperienceSkill.ts` and its test deleted
- `ExperienceBuilder.withSkills` accepts `string[]` (IDs)
- `ExperienceDTO.skills` changed to `string[]`
- `ExperienceSkillDTO.ts` deleted
- `GetExperiences` use case updated: `skills: experience.skills.map(id => id.value)`
- `ExperienceMapper` maps skill IDs; `toPrisma` drops `workDescription`
- `PrismaExperienceRepository.save` uses `{ skillId: id.value }`
- `schema.prisma`: `workDescription` column removed from `ExperienceSkill` model
- New Prisma migration dropping the column
- All tests passing

**Files**:

- `packages/core/.../experience/model/Experience.ts` ← update
- `packages/core/.../experience/model/ExperienceSkill.ts` ← delete
- `packages/application/.../dtos/ExperienceDTO.ts` ← update
- `packages/application/.../dtos/ExperienceSkillDTO.ts` ← delete
- `packages/application/.../use-cases/GetExperiences.ts` ← update
- `packages/infra/.../experience/ExperienceMapper.ts` ← update
- `packages/infra/prisma/schema.prisma` ← update

---

### T-DDD2 — Convert SkillType, Fluency, LocationType, EmploymentType to inline enums

**GitHub Issue**: #401
**Priority**: Medium
**Dependencies**: T-DDD1

These four VOs each contain only a single `.in([...])` rule and are used by exactly one entity. Per `CLAUDE.md`, stable enums with a single rule must be primitives/enums validated with `Validator.of(...).in([...])` inside the owning entity's `create()`. They do not belong in the Shared Kernel.

**Acceptance Criteria**:

- `SkillType.ts`, `Fluency.ts`, `LocationType.ts`, `EmploymentType.ts` deleted from `shared/vo/`
- Each entity exports its own `SKILL_TYPES`, `FLUENCY_LEVELS`, `LOCATION_TYPES`, `EMPLOYMENT_TYPES` constants and value types
- Each entity's `create()` validates the property with `Validator.of(value).in([...]).validate()`
- `shared/vo/index.ts` no longer exports the four removed VOs
- All importers (entities, mappers, DTOs, tests) updated
- `ExperienceMapper` `LOCATION_TYPE_MAP` / `LOCATION_TYPE_REVERSE_MAP` preserved with updated imports
- All tests passing

**Files**:

- `packages/core/src/shared/vo/SkillType.ts` ← delete
- `packages/core/src/shared/vo/Fluency.ts` ← delete
- `packages/core/src/shared/vo/LocationType.ts` ← delete
- `packages/core/src/shared/vo/EmploymentType.ts` ← delete
- `packages/core/src/shared/vo/index.ts` ← remove exports
- `packages/core/.../skill/model/Skill.ts` ← inline SkillType
- `packages/core/.../language/model/Language.ts` ← inline Fluency (if applicable)
- `packages/core/.../experience/model/Experience.ts` ← inline LocationType, EmploymentType

---

### T-DDD3 — Create IRepository<T> base interface in Shared Kernel

**GitHub Issue**: #402
**Priority**: Medium
**Dependencies**: T-08

`IExperienceRepository`, `ISkillRepository`, and `IProjectRepository` repeat the same four method signatures without a shared contract. A generic base interface enforces consistent naming and makes the pattern explicit. `IProfileRepository` stays independent — `Profile` is a singleton with no `findById` or `delete`.

**Acceptance Criteria**:

- `IRepository<T>` created in `core/src/shared/base/IRepository.ts` with `findAll()`, `findById(id: Id)`, `save(entity: T)`, `delete(id: Id)`
- `core/src/shared/base/index.ts` exports `IRepository`
- `IExperienceRepository` extends `IRepository<Experience>`
- `ISkillRepository` extends `IRepository<Skill>`
- `IProjectRepository` extends `IRepository<Project>` (retains extra methods)
- `IProfileRepository` unchanged
- All tests passing

**Files**:

- `packages/core/src/shared/base/IRepository.ts` ← create
- `packages/core/src/shared/base/index.ts` ← export
- `packages/core/.../experience/repositories/IExperienceRepository.ts` ← extend
- `packages/core/.../skill/repositories/ISkillRepository.ts` ← extend
- `packages/core/.../project/repositories/IProjectRepository.ts` ← extend

---

### T-DDD4 — Create AggregateRoot class and classify internal entities

**GitHub Issue**: #403
**Priority**: Medium
**Dependencies**: T-05, T-06, T-DDD1

Create a semantic `AggregateRoot` base class that communicates design intent. With `BlogPost` on the roadmap, the pattern will appear in multiple bounded contexts and the base class pays for itself.

**Acceptance Criteria**:

- `AggregateRoot<T, TProps> extends Entity<T, TProps>` created (empty body for now)
- `core/src/shared/base/index.ts` exports `AggregateRoot`
- `Experience`, `Skill`, `Project`, `Profile` extend `AggregateRoot` instead of `Entity`
- Decision documented: `Language`, `ProfessionalValue`, `SocialNetwork` evaluated — if they have their own identity and lifecycle → aggregate roots (get repository + extend `AggregateRoot`); if only meaningful inside `Profile` → internal entities or VOs
- `ProfileStat` evaluated: adopt `Entity` or `ValueObject` base, or remain a plain class with documented rationale
- All tests passing

**Files**:

- `packages/core/src/shared/base/AggregateRoot.ts` ← create
- `packages/core/src/shared/base/index.ts` ← export
- `packages/core/.../experience/model/Experience.ts` ← extend AggregateRoot
- `packages/core/.../skill/model/Skill.ts` ← extend AggregateRoot
- `packages/core/.../project/model/Project.ts` ← extend AggregateRoot
- `packages/core/.../profile/model/Profile.ts` ← extend AggregateRoot

---

## Execution Order

```
T-42 (Validator + Zod)
  └── T-43 (Migrate VOs)
        └── T-18 (Enforce VO vs primitive+Validator on entities)
              └── T-19 (Document rule in CLAUDE.md)
                    └── T-20 (Update docs/)

T-44 (Docs refactor — independent, can run in parallel)

T-09 (packages/application scaffold)
  ├── T-10 (Output DTOs)
  │     ├── T-12 (GetFeaturedProjects)
  │     ├── T-13 (GetPublishedProjects)
  │     ├── T-14 (GetProjectBySlug)
  │     ├── T-15 (GetExperiences)
  │     └── T-16 (GetProfile)
  └── T-11 (IEmailService port)
        └── T-17 (SendContactMessage)

T-DDD1 (Remove ExperienceSkill)
  └── T-DDD2 (Enum VOs inline)

T-DDD3 (IRepository<T>) — independent, can run in parallel with T-DDD1
T-DDD4 (AggregateRoot) — depends on T-DDD1
```

## Definition of Done

- [ ] All tasks completed and tests passing
- [ ] `pnpm test` passes in `packages/application` with Vitest
- [ ] No imports of React, Next.js, Prisma, or HTTP clients in `packages/application`
- [ ] Every use case has unit tests with mocked repositories
- [ ] All DTOs and ports exported from `packages/application/src/index.ts`
- [ ] `turbo.json` pipeline updated
- [ ] Ready to start Sprint 2 (Infrastructure Layer)
