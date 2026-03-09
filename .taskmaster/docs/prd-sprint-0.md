# PRD — Sprint 0: Domain Foundation

## Overview

This sprint establishes the domain foundation for the portfolio monorepo. All subsequent sprints depend on the artifacts produced here. The goal is to implement the Either pattern, migrate all Value Objects and Entities to use it, create missing VOs, complete the domain model, and define repository interfaces.

## Project Context

- **Repository**: https://github.com/wallace-sf/portfolio
- **Package**: `packages/core` (Domain Layer)
- **Architecture**: DDD + Clean Architecture
- **Monorepo**: Turborepo + pnpm + TypeScript strict

## Stack

- TypeScript (strict mode)
- Vitest (test runner — replacing Jest in this sprint)
- DDD patterns: Value Objects, Entities, Either pattern, Repository interfaces

## Background

`packages/core` currently has a solid foundation (error hierarchy, base ValueObject, base Entity, primitive VOs) but uses `throw` for domain errors instead of the mandatory Either pattern defined in `CLAUDE.md`. This blocks the Application Layer from being built safely. Additionally, several VOs and entities are incomplete or missing entirely.

## Goals

1. Implement the Either pattern as the standard error-handling mechanism for the domain
2. Migrate all existing VOs and Entities from `throw` to Either
3. Create missing Value Objects required by the domain model
4. Complete the Project and Experience entities with all fields from the Figma design
5. Create the Profile entity with the featured projects invariant
6. Define repository interfaces (contracts) for the infrastructure layer
7. Fix known bugs (ValueObject.equals, Entity.props mutation)
8. Migrate test runner from Jest to Vitest

## Out of Scope

- Application Layer (Sprint 1)
- Infrastructure / Prisma (Sprint 2)
- Frontend / Next.js (Sprint 3)
- CI/CD (Sprint 4)

---

## Tasks

### T-01 — Implement Either pattern

**GitHub Issue**: #264
**Priority**: High
**Dependencies**: none

Implement `src/shared/either.ts` with `Either<L, R>`, `Left`, `Right`, `left()`, `right()`. This is the foundation that all other tasks in this sprint depend on.

**Acceptance Criteria**:

- `packages/core/src/shared/either.ts` created exporting `Left`, `Right`, `left()`, `right()`
- `Either<L, R>` is a type alias: `Left<L, R> | Right<L, R>`
- `Left` and `Right` have `isLeft()`, `isRight()` and `value` getter
- `packages/core/src/shared/index.ts` exports `Either`, `Left`, `Right`, `left`, `right`
- Unit tests covering: Left creation, Right creation, type narrowing via `isLeft()`/`isRight()`

**Files**:

- `packages/core/src/shared/either.ts` ← create
- `packages/core/src/shared/index.ts` ← update
- `packages/core/test/shared/either.test.ts` ← create

---

### T-00a — Migrate packages/core from Jest to Vitest

**GitHub Issue**: #272
**Priority**: Medium
**Dependencies**: none (can run in parallel with T-01)

The monorepo uses Vitest as the standard test runner per `CLAUDE.md`. `packages/core` currently uses Jest (`jest.config.ts`, `ts-jest`), causing inconsistency across the monorepo.

**Acceptance Criteria**:

- `jest.config.ts` removed
- `vitest.config.ts` created with `globals: true` and `environment: 'node'`
- `package.json` updated: `"test": "vitest run"`, `"test:watch": "vitest"`
- `devDependencies`: `jest`, `ts-jest`, `@types/jest` removed; `vitest` added
- Coverage exclusion `!**/base/*.ts` removed (Entity and ValueObject have tests and should be measured)
- All tests passing with Vitest

**Files**:

- `packages/core/jest.config.ts` ← remove
- `packages/core/vitest.config.ts` ← create
- `packages/core/package.json` ← update scripts and deps

---

### T-02 — Migrate Value Objects to Either pattern

**GitHub Issue**: #265
**Priority**: High
**Dependencies**: T-01

Migrate all VOs from `throw` to `Either`. Fix known bugs identified in the core analysis: `ValueObject.equals()` broken for object types, `isNew` concept in VO, inconsistent `ERROR_CODE` naming, Portuguese error messages, abandoned `ERROR_MESSAGE.ts`, incorrect tsconfig path alias.

**Acceptance Criteria**:

- No VO uses `throw` for domain errors
- All VOs expose `static create()` returning `Either<DomainError, T>`
- `Id.generate()` created (no Either, generates random UUID) and `Id.create(value)` returns `Either<ValidationError, Id>`
- `ValueObject.equals()` fixed for deep comparison when `TValue` is an object
- `isNew` removed from `IValueObjectProps`
- All error messages in English
- `ERROR_CODE` standardized: `INVALID_<NAME>` across all VOs
- `ERROR_MESSAGE.ts` removed
- Path alias `~components/*` removed from `tsconfig.json`
- VOs affected: `Id`, `DateTime`, `Text`, `Name`, `Url`, `EmploymentType`, `Fluency`, `LocationType`, `SkillType`, `LocalizedText`
- Existing tests rewritten to use Either pattern (no `toThrow()`)
- Test added for `equals()` bug in `LocalizedText`

**Files**:

- `packages/core/src/shared/vo/*.ts` ← update all
- `packages/core/src/shared/base/ValueObject.ts` ← fix `equals()`, remove `isNew`
- `packages/core/src/shared/i18n/ERROR_MESSAGE.ts` ← remove
- `packages/core/tsconfig.json` ← remove `~components/*`
- `packages/core/test/shared/vo/*.test.ts` ← rewrite assertions

---

### T-03 — Migrate Entities to Either pattern

**GitHub Issue**: #266
**Priority**: High
**Dependencies**: T-02

Migrate all entity factory methods to return `Either<DomainError, Entity>`. Fix `Entity.props` being public and mutated in constructor. Reorganize directory structure to match `CLAUDE.md`. Update `SkillFactory.bulk()`.

**Acceptance Criteria**:

- All entity constructors are `private`
- All `static create()` return `Either<DomainError, Entity>`
- `Entity.props` is `private` and constructor does not mutate input object (use spread: `Object.freeze({ ...props, id: this.id.value })`)
- `SkillFactory.bulk()` returns `Either<DomainError, Skill[]>` with index in error message
- Entities reorganized to `src/portfolio/entities/<name>/model/<Name>.ts`
- `Experience` aligned to `model/` pattern
- `src/portfolio/index.ts` re-exports everything from new paths
- Test builders updated to handle Either
- All tests passing

**Files**:

- `packages/core/src/portfolio/entities/*/model/*.ts` ← create/move
- `packages/core/src/shared/base/Entity.ts` ← fix `props` and mutation
- `packages/core/src/portfolio/skill/factory/SkillFactory.ts` ← update
- `packages/core/src/portfolio/index.ts` ← update exports
- `packages/core/test/data/*.builder.ts` ← update

---

### T-04 — Create missing Value Objects (Slug, Image, DateRange)

**GitHub Issue**: #267
**Priority**: High
**Dependencies**: T-02

Create the three Value Objects required by the domain model that do not yet exist.

**Acceptance Criteria**:

- `Slug.create()` returns `Either<ValidationError, Slug>`. Validates kebab-case regex `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`, min 3 chars. `toPath()` returns `/my-project`
- `Image.create()` composes `Url` and `LocalizedText` with Either. Fields: `url` (Url VO) + `alt` (LocalizedText VO)
- `DateRange.create()` validates `startAt <= endAt` when `endAt` present. `isActive()` returns `true` when no end date
- Unit tests for each VO (happy path + each validation rule)
- Data providers `SlugData`, `ImageData` created in `test/data/bases/`

**Files**:

- `packages/core/src/shared/vo/Slug.ts` ← create
- `packages/core/src/shared/vo/Image.ts` ← create
- `packages/core/src/shared/vo/DateRange.ts` ← create
- `packages/core/src/shared/vo/index.ts` ← update exports
- `packages/core/test/shared/vo/Slug.test.ts` ← create
- `packages/core/test/shared/vo/Image.test.ts` ← create
- `packages/core/test/shared/vo/DateRange.test.ts` ← create
- `packages/core/test/data/bases/SlugData.ts` ← create
- `packages/core/test/data/bases/ImageData.ts` ← create

---

### T-05 — Create Profile entity

**GitHub Issue**: #268
**Priority**: High
**Dependencies**: T-03, T-04

Create the `Profile` entity representing personal data shown in the Home hero, stats, and sidebar. Does not exist in the domain yet. Critical business invariant: maximum 6 featured projects.

**Acceptance Criteria**:

- `Profile.create()` returns `Either<DomainError, Profile>`
- Fields: `name` (Name), `headline` (LocalizedText), `bio` (LocalizedText), `photo` (Image), `stats` (ProfileStat[]), `featuredProjectSlugs` (Slug[])
- `ProfileStat`: `{ label: LocalizedText, value: string, icon: Text }`
- Invariant enforced in `create()`: maximum 6 featured projects (`featuredProjectSlugs.length <= 6`)
- Tests cover: valid creation, invariant violation (7+ slugs), empty featured list
- `ProfileBuilder` created in `test/data/`
- `src/portfolio/index.ts` exports `Profile` and `ProfileStat`

**Files**:

- `packages/core/src/portfolio/entities/profile/model/Profile.ts` ← create
- `packages/core/src/portfolio/entities/profile/model/ProfileStat.ts` ← create
- `packages/core/src/portfolio/index.ts` ← update exports
- `packages/core/test/data/ProfileBuilder.ts` ← create
- `packages/core/test/portfolio/profile/Profile.test.ts` ← create

---

### T-06 — Update Project entity with design fields

**GitHub Issue**: #269
**Priority**: High
**Dependencies**: T-03, T-04

The existing `Project` entity is a stub with only 4 fields. Add all fields required to render the Portfolio and Project Detail pages per the Figma design.

**Acceptance Criteria**:

- New fields added: `slug` (Slug), `coverImage` (Image), `theme` (LocalizedText), `summary` (LocalizedText), `objectives` (LocalizedText), `role` (LocalizedText), `team` (string), `period` (DateRange), `featured` (boolean), `status` (ProjectStatus), `relatedProjects` (Slug[])
- `title` and `caption` migrated from `Text` to `LocalizedText`
- `content` with no upper character limit (or ≥ 500,000 chars)
- `ProjectStatus` enum created: `DRAFT | PUBLISHED | ARCHIVED`
- `Project.create()` returns `Either<DomainError, Project>`
- `ProjectBuilder` and tests updated

**Files**:

- `packages/core/src/portfolio/entities/project/model/Project.ts` ← update
- `packages/core/src/portfolio/entities/project/model/ProjectStatus.ts` ← create
- `packages/core/test/data/ProjectBuilder.ts` ← update
- `packages/core/test/portfolio/project/Project.test.ts` ← update

---

### T-07 — Update Experience entity + create ExperienceSkill VO

**GitHub Issue**: #270
**Priority**: High
**Dependencies**: T-03, T-04

Add missing fields to `Experience` and create the `ExperienceSkill` Value Object to support the skills modal with contextual `workDescription` per experience.

**Acceptance Criteria**:

- New fields added: `logo` (Image), `description` (LocalizedText)
- `company`, `position`, `location` migrated to `LocalizedText`
- `ExperienceSkill.create()` returns `Either<DomainError, ExperienceSkill>`. Fields: `{ skill: Skill, workDescription: LocalizedText }`
- `skills[]` typed as `ExperienceSkill[]`
- Date validation delegated to `DateRange` VO (no duplication)
- `ExperienceBuilder` and tests updated

**Files**:

- `packages/core/src/portfolio/entities/experience/model/Experience.ts` ← update
- `packages/core/src/portfolio/entities/experience/model/ExperienceSkill.ts` ← create
- `packages/core/test/data/ExperienceBuilder.ts` ← update
- `packages/core/test/portfolio/experience/Experience.test.ts` ← update

---

### T-08 — Create repository interfaces in the domain

**GitHub Issue**: #271
**Priority**: High
**Dependencies**: T-05, T-06, T-07

Create repository interfaces (ports) inside the domain. Without these, the infrastructure layer has no contract to implement and Clean Architecture is invalid.

**Acceptance Criteria**:

- `IProjectRepository`: `findAll()`, `findPublished()`, `findFeatured()`, `findBySlug(slug: Slug)`, `findRelated(id, limit?)`, `save(project)`, `delete(id)`
- `IExperienceRepository`: `findAll()`, `save()`, `delete()`
- `IProfileRepository`: `find()`, `save()`
- `ISkillRepository`: `findAll()`, `save()`, `delete()`
- All methods return `Promise<...>` with domain types
- None of these interfaces import external libraries (Prisma, Supabase, etc.)
- `src/portfolio/index.ts` exports all interfaces

**Files**:

- `packages/core/src/portfolio/entities/project/repositories/IProjectRepository.ts` ← create
- `packages/core/src/portfolio/entities/experience/repositories/IExperienceRepository.ts` ← create
- `packages/core/src/portfolio/entities/profile/repositories/IProfileRepository.ts` ← create
- `packages/core/src/portfolio/entities/skill/repositories/ISkillRepository.ts` ← create
- `packages/core/src/portfolio/index.ts` ← export interfaces

---

### T-00b — Create packages/core architecture documentation

**GitHub Issue**: #273
**Priority**: Low
**Dependencies**: none (can run in parallel)

Document bounded contexts, layer rules, and ubiquitous language for `packages/core`.

**Acceptance Criteria**:

- `packages/core/ARCHITECTURE.md` created with bounded context map, isolation rules, and dependency diagram
- `packages/core/GLOSSARY.md` created with Ubiquitous Language definitions
- ADR template created in `packages/core/decisions/adr-template.md`
- ADR-001 documenting why repository interfaces belong in core, not application

**Files**:

- `packages/core/ARCHITECTURE.md` ← create
- `packages/core/GLOSSARY.md` ← create
- `packages/core/decisions/adr-template.md` ← create
- `packages/core/decisions/ADR-001-repository-interfaces-in-core.md` ← create

---

## Execution Order

```
T-00a (parallel)     T-00b (parallel)
T-01
  └── T-02
        └── T-03
              ├── T-04
              │     ├── T-05
              │     ├── T-06
              │     └── T-07
              │           └── T-08
              └── (fixes: Entity.props, SkillFactory, dir structure)
```

## Definition of Done

- [ ] All tasks completed and tests passing
- [ ] `pnpm test` passes in `packages/core` with Vitest
- [ ] No `throw` for domain errors anywhere in `packages/core`
- [ ] All new VOs and entities have unit tests
- [ ] `src/portfolio/index.ts` exports all public domain artifacts
- [ ] Ready to start Sprint 1 (Application Layer)
