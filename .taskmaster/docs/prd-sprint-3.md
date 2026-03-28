# PRD — Sprint 3: Presentation Layer

## Overview

This sprint implements the Presentation Layer: REST API routes in `apps/web`, the Identity web integration (middleware, login, admin layout), and the replacement of all static data with live fetches from the API. It is the last development sprint before quality and deploy.

## Project Context

- **Repository**: https://github.com/wallace-sf/portfolio
- **Packages**: `apps/web` (Next.js 14 App Router)
- **Architecture**: DDD + Clean Architecture
- **Monorepo**: Turborepo + pnpm + TypeScript strict

## Stack

- Next.js 14 (App Router, Server Components, Route Handlers)
- Supabase Auth (`@supabase/supabase-js`, `@supabase/ssr`)
- next-intl (i18n)
- Vitest / Jest (tests)

## Background

Sprint 2 delivered the complete infrastructure layer — Prisma repositories, Resend email service, DI container, and Identity core/infra/application. Sprint 3 wires everything to the HTTP and UI layer.

**Development order respected**: `apps/web` is touched last, after core → infra → API → frontend.

## Goals

1. Define the REST response envelope and implement the first API endpoints
2. Wire the contact form to the real `SendContactMessage` use case
3. Replace static data on pages with fetches via use cases / API
4. Implement the Identity web layer (middleware, login page, admin layout)

## Out of Scope

- New domain entities or use cases (Sprint 1 and 2)
- CI/CD configuration (Sprint 4)
- Blog bounded context (post-MVP)

---

## Tasks

### T-ENV — Define Response Envelope and implement API endpoints

**GitHub Issue**: #289
**Priority**: Medium
**Dependencies**: Sprint 2 complete (DI container, use cases)

Introduce a consistent REST response envelope and implement the portfolio API endpoints. The API layer must be thin — only calls use cases and maps errors to HTTP.

**Acceptance Criteria**:

- `ApiResponse<T>` discriminated union type:
  - Success: `{ success: true; data: T }`
  - Failure: `{ success: false; error: { code: string; message: string } }`
- `successResponse<T>(data: T)` and `errorResponse(code, message)` helpers
- `mapDomainErrorToHttp(error: DomainError)`: `NotFoundError` → 404, `ValidationError` → 422, `DomainError` → 500 (opaque message)
- Endpoints implemented:
  - `GET /api/v1/projects/[slug]` — calls `GetProjectBySlug`, locale via `?locale=` param (defaults to `pt-BR`)
  - `GET /api/v1/projects` — calls `GetPublishedProjects`
  - `GET /api/v1/profile` — calls `GetProfile`
  - `GET /api/v1/experiences` — calls `GetExperiences`
  - `POST /api/v1/contact` — calls `SendContactMessage`
- No domain logic in handlers
- Unit tests for envelope helpers, error mapper, and each route handler

**Files**:

- `apps/web/src/lib/api/envelope.ts` ← create
- `apps/web/src/lib/api/error-mapper.ts` ← create
- `apps/web/src/app/api/v1/projects/[slug]/route.ts` ← create
- `apps/web/src/app/api/v1/projects/route.ts` ← create
- `apps/web/src/app/api/v1/profile/route.ts` ← create
- `apps/web/src/app/api/v1/experiences/route.ts` ← create
- `apps/web/src/app/api/v1/contact/route.ts` ← create

---

### T-PAGES — Replace static data with live API fetches

**Priority**: High
**Dependencies**: T-ENV

Replace all hardcoded arrays and static data in page components with fetches from the use cases via the DI container (Server Components) or via the internal API (Client Components).

**Acceptance Criteria**:

- Home page: featured projects from `GetFeaturedProjects`, profile from `GetProfile`
- Projects page: published projects from `GetPublishedProjects`
- Project detail page: project from `GetProjectBySlug`; related projects from DTO
- Experiences: data from `GetExperiences`
- Contact form submits to `POST /api/v1/contact`; error codes mapped to i18n messages
- No hardcoded data arrays remain in page components

**Files**:

- `apps/web/src/app/[locale]/page.tsx` ← update
- `apps/web/src/app/[locale]/projects/page.tsx` ← update
- `apps/web/src/app/[locale]/projects/[slug]/page.tsx` ← create
- `apps/web/src/components/Forms/ContactForm/` ← update

---

### T-ID4 — Identity: Web (getAuthenticatedUser, middleware, login page, admin layout)

**GitHub Issue**: #407
**Priority**: Low
**Dependencies**: T-ID1, T-ID2, T-ID3 (from Sprint 2)

Implement the presentation layer of the Identity bounded context.

**Acceptance Criteria**:

- `getAuthenticatedUser()` server helper resolves the current user from the Supabase session
- Next.js middleware protects `/[locale]/admin/*`; redirects to `/[locale]/login` if unauthenticated
- Login page at `/[locale]/login` with Supabase Auth form
- Admin layout at `/[locale]/admin/layout.tsx` calls `EnsureAdminUseCase`; redirects if not admin
- Middleware excludes `/api/*`, `/_next/*`, static assets

**Files**:

- `apps/web/src/lib/auth/getAuthenticatedUser.ts` ← create
- `apps/web/src/middleware.ts` ← update (add auth guard alongside i18n)
- `apps/web/src/app/[locale]/login/page.tsx` ← create
- `apps/web/src/app/[locale]/admin/layout.tsx` ← create

---

## Execution Order

```
T-ENV (Response Envelope + API endpoints)
  └── T-PAGES (Replace static data with live fetches)

T-ID4 (Identity web — can run in parallel with T-ENV after Sprint 2 identity tasks)
```

## Definition of Done

- [ ] All API endpoints implemented with correct envelope and error mapping
- [ ] No static data arrays remain in page components
- [ ] Contact form delivers emails via `SendContactMessage` use case
- [ ] Identity middleware and login page functional
- [ ] `apps/web` builds without errors (`pnpm --filter web build`)
- [ ] All new route handlers have unit tests
- [ ] Ready to start Sprint 4 (Quality & Deploy)
