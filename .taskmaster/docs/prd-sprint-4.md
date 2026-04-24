# PRD — Sprint 4: Quality, Deploy & Admin API surface

## Overview

This sprint covers **admin REST endpoints** under `/api/v1/admin/*`, hardening, CI/CD, and deployment — after core presentation and public API are stable. Aligned with GitHub milestone **Sprint 4 — Quality & Deploy** and [docs/ROADMAP.md](../../docs/ROADMAP.md).

## Goals

1. Admin write use cases in `@repo/application` — prerequisite for admin REST (**GitHub #453**).
2. Implement **`/api/v1/admin/*`** mutations with `EnsureAdmin` (**GitHub #446**).
3. Segregar exports de `@repo/utils` em subpaths seguros (sem arrastar React para `core`) (**#319**).
4. GitHub Actions CI pipeline (lint, typecheck, tests on PR) (**#302**).
5. Deploy automático na Vercel via CI/CD (**#303**).
6. Testes de componentes críticos com Vitest + Testing Library (**#304**).
7. Garantir cobertura 100% do domain após refatorações (**#305**).
8. Seed de dados iniciais no Supabase (**#306**).

## Tasks

### T-ADMIN-WRITE — Write use cases em @repo/application

**GitHub Issue**: #453  
**Priority**: High  
**Dependencies**: Identity pipeline (#442–#445); domain entities (Sprint 0–1)

Implement admin write use cases in `packages/application/src/admin/use-cases/`:
- `CreateProject`, `UpdateProject`, `DeleteProject`
- `CreateExperience`, `UpdateExperience`
- `UpdateProfile`

Each use case must: validate input via domain entities, call the repository port, return `Either<DomainError, OutputDTO>`. No Prisma/Supabase inside use cases.

**Acceptance criteria**:
- Use cases in `@repo/application` with unit tests (fake repositories)
- Input validated through domain `create()` — no raw Prisma calls
- Output DTOs align with admin REST contract in `05-API-CONTRACTS`

---

### T-ADMIN-API — REST admin endpoints with EnsureAdmin

**GitHub Issue**: #446  
**Priority**: Medium  
**Dependencies**: #453 (admin write use cases), Identity session pipeline (#445)

Handlers under `/api/v1/admin/...` call `EnsureAdmin` before writes; responses per [05-API-CONTRACTS](../../docs/05-API-CONTRACTS.md).

**Acceptance criteria**:
- At least `POST /api/v1/admin/projects`, `PUT /api/v1/admin/projects/:slug`, `DELETE /api/v1/admin/projects/:slug`
- 401 when unauthenticated, 403 when authenticated but not ADMIN
- No business logic in handlers beyond mapping and status codes

---

### T-UTILS-EXPORTS — Segregar exports do @repo/utils por categoria

**GitHub Issue**: #319  
**Priority**: Medium  
**Dependencies**: None

Split `packages/utils/src/index.ts` barrel so that React hooks (`useEffect`, `useRef`, etc.) are only reachable via `@repo/utils/hooks`, never pulled in by `@repo/utils` directly. Prevents `packages/core` from accidentally importing React.

**Acceptance criteria**:
- `@repo/utils` (barrel) exports only framework-free utilities (constants, formatters, types, validations, validator)
- `@repo/utils/hooks` exports React hooks exclusively
- `packages/core` imports `@repo/utils` without triggering "use client" errors
- All existing consumers updated to the new subpaths

---

### T-CI — GitHub Actions CI pipeline

**GitHub Issue**: #302  
**Priority**: Medium  
**Dependencies**: None

Create `.github/workflows/ci.yml` that runs on every PR:
- `pnpm install`
- `pnpm typecheck` (tsc --noEmit across all packages)
- `pnpm lint` (ESLint)
- `pnpm test` (Vitest)
- Fail fast on first error

**Acceptance criteria**:
- CI runs automatically on PRs against `develop` and `master`
- All steps pass on the current codebase
- Build artifacts not published in CI (deploy handled separately)

---

### T-DEPLOY — Deploy automático na Vercel

**GitHub Issue**: #303  
**Priority**: Medium  
**Dependencies**: T-CI (CI pipeline established)

Configure Vercel project and GitHub integration:
- Production deploy on merge to `master`
- Preview deploy on every PR
- Environment variables documented in `.env.example`

**Acceptance criteria**:
- `apps/web` deploys automatically to Vercel on merge to `master`
- Preview URL available on PRs
- No secrets committed to the repository

---

### T-TEST-COMPONENTS — Testes de componentes críticos

**GitHub Issue**: #304  
**Priority**: Low  
**Dependencies**: Sprint 3 components complete

Vitest + Testing Library tests for critical UI components: `ContactForm` (submit flow, validation errors), `ProjectCard`, auth-gated layout (redirect when unauthenticated).

**Acceptance criteria**:
- Tests for at least: `ContactForm`, `ProjectCard`, admin `layout.tsx` redirect
- Tests run in Vitest (not Playwright/E2E)
- No mocking of domain logic; mock only HTTP (`fetch`) at the boundary

---

### T-TEST-DOMAIN — Garantir cobertura 100% do domain

**GitHub Issue**: #305  
**Priority**: Low  
**Dependencies**: Sprint 0–1 refactors complete

Audit `packages/core` test coverage after all Sprint 0–3 refactors. Add missing unit tests for VOs, entities, and use-case edge cases until 100% line coverage is reached.

**Acceptance criteria**:
- `pnpm --filter core test --coverage` reports 100% lines
- No tests skipped without `skip` annotation and justification
- All Either branches (left and right) covered

---

### T-SEED — Seed de dados iniciais no Supabase

**GitHub Issue**: #306  
**Priority**: Low  
**Dependencies**: Prisma schema stable (Sprint 2); Supabase cloud environment (#387)

Script at `packages/infra/prisma/seed.ts` (or `scripts/seed.ts`) that populates:
- Profile with sample data
- 3–5 Projects (mix of featured and non-featured)
- 2–3 Experiences with skills

**Acceptance criteria**:
- `pnpm seed` (or `prisma db seed`) runs without errors on a fresh Supabase cloud DB
- Idempotent: running twice does not duplicate records
- Seed data realistic enough for demo/screenshots

---

## Definition of Done

- [ ] Admin write use cases in `@repo/application` with unit tests
- [ ] At least one admin mutation shipped with documented scope in PR
- [ ] 401/403 behaviour matches authorization table in `05`
- [ ] `@repo/utils` barrel safe for `packages/core` (no React leak)
- [ ] CI pipeline green on all PRs (typecheck + lint + tests)
- [ ] Vercel deploy automated on merge to `master`
- [ ] Domain coverage 100% in `packages/core`
- [ ] Seed script runs idempotently on Supabase cloud DB
- [ ] `pnpm --filter web build` passes
