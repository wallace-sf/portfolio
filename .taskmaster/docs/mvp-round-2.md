# PRD — MVP Round 2

## Overview

MVP Round 2 is the final set of work items required before launching the portfolio publicly. The goal is to close gaps in quality, data realism, architectural correctness, and i18n coverage. Reference design: [Paul Scanlon's portfolio](https://www.paulie.dev/).

All items map to GitHub issues in the **MVP Round 2** milestone (issues #543, #588–#594).

---

## 1. Endpoint Testing

**GitHub issue:** #588  
**Priority:** High

Manually validate every route handler under `/api/v1/` against the documented response envelope contract (`{ data, error }`). Cover happy path and key error cases (400, 401, 404, 500) for all public, auth, identity, and admin endpoints.

### Scope

- Public portfolio: `GET /api/v1/projects`, `/projects/featured`, `/projects/:slug`, `/experiences`, `/profile`
- Contact: `POST /api/v1/contact` (including rate-limit check)
- Auth: `POST /api/v1/auth/sign-in`, `sign-out`, `refresh`
- Identity: `GET /api/v1/me`
- Admin: all routes under `/api/v1/admin/*` (projects CRUD, publish/archive, profile, experiences CRUD)

### Acceptance criteria

- Every endpoint returns the correct envelope and HTTP status
- Error cases (missing auth, not admin, not found, invalid input) return correct codes
- Findings documented; broken endpoints tracked as follow-up issues

---

## 2. Realistic Seed Data

**GitHub issue:** #590  
**Priority:** Medium

Replace placeholder seeds with content close to the real portfolio: real projects, real experiences, real skills, and a realistic profile. Seeds must run without errors via `pnpm prisma db seed`.

### Scope

- `packages/infra/prisma/seed.ts`
- Entities: `Project`, `Experience`, `Skill`, `Profile`

### Acceptance criteria

- Seeds reflect real or near-real data for all entities
- `pnpm prisma db seed` completes without errors
- At least 2 published projects and 2 experiences in the seed

---

## 3. i18n in Core — LocalizedText and Domain Error Messages

**GitHub issue:** #591  
**Priority:** High

Implement full i18n support in `@repo/core`: ensure `ERROR_MESSAGE` covers all existing error codes for `pt-BR` and `en-US`, and audit all domain entities and VOs to use stable codes rather than inline strings.

### Scope

- `packages/core/src/shared/i18n/` — `ERROR_MESSAGE`, `Locale`
- All entities and VOs that produce `ValidationError`

### Acceptance criteria

- `ERROR_MESSAGE` has entries for all codes in `pt-BR` and `en-US`
- Domain code never produces a human-readable string directly — only a code
- Edge (`apps/site`) resolves messages from `ERROR_MESSAGE[locale][code]`
- Unit tests verify code-to-message resolution

---

## 4. Remove Hardcoded Strings from @repo/core

**GitHub issue:** #592  
**Priority:** Medium  
**Depends on:** #591 (i18n in core)

Replace any remaining hardcoded human-readable strings in `@repo/core` with stable error codes that can be resolved to localized messages at the edge.

### Scope

- `packages/core/src/` — entities, VOs, error constructors

### Acceptance criteria

- No plain human-readable string literals in `ValidationError` or `DomainError` instantiations beyond the `code` field
- All `ValidationError` instances use a static `ERROR_CODE` constant
- ESLint passes; existing tests updated if needed

---

## 5. Application-Layer Orchestration Audit

**GitHub issue:** #543  
**Priority:** High

Audit route handlers in `apps/site/app/api/` to ensure no application-layer orchestration logic (branching on domain results, multiple use-case calls in sequence, business decisions) leaks into the web adapter. Route handlers should: resolve the container, call one use case, map the result to HTTP.

### Scope

- `apps/site/app/api/` — all route handlers
- `packages/application/` — use cases (may need extraction of orchestration logic)

### Acceptance criteria

- Each route handler calls exactly one use case (or delegates to a thin orchestrator use case)
- No `if/else` on domain model internals inside route handlers
- Architecture ESLint rules pass

---

## 6. Move Admin and Login to apps/admin

**GitHub issue:** #593  
**Priority:** Medium

Extract `/{locale}/login` and `/{locale}/admin/*` from `apps/site` into a new dedicated `apps/admin` Next.js app. The public portfolio app should contain no admin or login routes.

### Scope

- Create `apps/admin` with Next.js App Router
- Move login and admin pages
- Scope auth middleware to `apps/admin`
- Update `turbo.json`, root `package.json`, and workspace config

### Acceptance criteria

- `apps/site` has no login or admin routes
- `apps/admin` runs independently (`pnpm --filter admin dev`)
- Both apps build without errors
- Auth middleware only active in `apps/admin`

---

## 7. Figma Styling Review

**GitHub issue:** #589  
**Priority:** Medium

Conduct a Figma review round to identify components that are unfinished or need visual changes before launch. Implement all identified changes in `@repo/ui` and `apps/site`.

### Scope

- `packages/ui/src/` — design system components
- `apps/site/src/` — page-level layout and feature components

### Acceptance criteria

- All components reviewed against the Figma design
- List of required changes documented and implemented
- No obvious visual regressions on Home, Projects, About pages

---

## 8. General Code Review

**GitHub issue:** #594  
**Priority:** High

Quality pass across the full codebase before MVP launch. Enforce architectural rules, remove `any` types, verify the REST boundary is respected, and ensure all tests pass.

### Scope

- All packages and apps

### Acceptance criteria

- Zero `any` types across TypeScript codebase
- No direct imports between bounded contexts
- No use cases called from pages, layouts, or client components
- No `@supabase/*` outside `@repo/infra`
- All route handlers follow the response envelope
- `pnpm lint` and `pnpm test` pass with zero errors

---

## Dependencies Between Tasks

```
#591 (i18n in core) → #592 (remove hardcoded strings)
#588 (endpoint testing) → #594 (general code review) [inform findings]
#543 (app layer audit) → #594 (general code review)
```

## Out of Scope (Post-MVP)

- Blog (`apps/blog`)
- `IAuthenticationGateway` full implementation
- Playwright E2E tests
- CI/CD re-enablement
