# PRD — Sprint 3: Presentation Layer

## Overview

This sprint implements the **Presentation Layer** in `apps/web`: **REST route handlers** under `/api/v1`, then **pages and components** that consume the API **only via HTTP** (no direct `@repo/application` or DI container from `page.tsx`). Identity UI follows [docs/11-IDENTITY.md](../../docs/11-IDENTITY.md) and [plans/identity-mvp.md](../../plans/identity-mvp.md).

## Project Context

- **Repository**: https://github.com/wallace-sf/portfolio
- **Packages**: `apps/web` (Next.js App Router — route handlers + UI)
- **Architecture**: DDD + Clean Architecture ([docs/02-ARCHITECTURE.md](../../docs/02-ARCHITECTURE.md))
- **Monorepo**: Turborepo + pnpm + TypeScript strict

## Stack

- Next.js (App Router, Server Components, Route Handlers)
- **REST** as the only external boundary for the browser ([docs/05-API-CONTRACTS.md](../../docs/05-API-CONTRACTS.md))
- next-intl (i18n)
- Vitest (tests where applicable)
- **Not** in `apps/web` UI: `@supabase/*` or other IdP SDKs on pages/middleware (see `11-IDENTITY`)

## Background

Sprint 2 delivered infrastructure (Prisma, container, repositories). Sprint 3 wires **HTTP** first: handlers compose `@repo/infra` + use cases; **pages** use `fetch` (RSC or TanStack Query) to same-origin `/api/v1/...`.

**Development order**: route handlers (API) → connect pages → identity UI (depends on auth REST from parallel identity issues).

## Goals

1. Implement REST envelope and portfolio/contact routes per [05-API-CONTRACTS](../../docs/05-API-CONTRACTS.md) (**GitHub #289**).
2. Connect contact form: RHF + Zod + `POST /api/v1/contact` (**#290**).
3. Replace static data: Home, Projects, Project detail, Experiences via documented `GET` paths (**#291–#294**).
4. UI components: ProjectCard, StatCard, ThemeToggle, LanguageSelector, route `loading`/`error`, not-found (**#295–#300**).
5. Internacionalizar textos hardcoded (**#301**).
6. Rate limiting em `POST /api/v1/contact` (**#452**).
7. Identity web: login, middleware, admin layout — **REST only** (**#407**, depends on **#442–#445**).

## Out of Scope

- New domain entities (Sprints 0–1)
- Implementing `IAuthenticationGateway` adapter (**Sprint 2 / #444**)
- CI/CD depth (**Sprint 4**)
- Blog bounded context (post-MVP)

---

## Tasks

### T-ENV — REST envelope + portfolio & contact API routes

**GitHub Issue**: #289  
**Priority**: High  
**Dependencies**: Sprint 2 DI container and use cases available

Implement route handlers that call use cases and return JSON using the envelope `{ data, error, meta }` from [05-API-CONTRACTS](../../docs/05-API-CONTRACTS.md). Map domain errors to HTTP status codes as documented.

**Acceptance criteria** (summary):

- Helpers for success/failure responses aligned with `05` (not the legacy `{ success: boolean }` shape).
- Endpoints: `GET /api/v1/projects`, `GET /api/v1/projects/featured`, `GET /api/v1/projects/:slug`, `GET /api/v1/profile`, `GET /api/v1/experiences`, `POST /api/v1/contact`.
- No business logic in handlers beyond mapping and status codes.
- Tests for mappers/handlers as appropriate.

---

### T-CONTACT — ContactForm: RHF + Zod + POST /api/v1/contact

**GitHub Issue**: #290  
**Priority**: High  
**Dependencies**: T-ENV (contact route) or parallel once route exists

Migrate from Formik/Yup; submit via `fetch` to `POST /api/v1/contact` with envelope handling.

---

### T-PAGE-HOME — Home page via REST

**GitHub Issue**: #291  
**Priority**: High  
**Dependencies**: T-ENV (featured + profile routes)

`GET /api/v1/profile` and `GET /api/v1/projects/featured` — no `@repo/application` in pages.

---

### T-PAGE-PROJECTS — Portfolio list via REST

**GitHub Issue**: #292  
**Dependencies**: T-ENV

`GET /api/v1/projects`.

---

### T-PAGE-PROJECT-DETAIL — Project detail via REST

**GitHub Issue**: #293  
**Dependencies**: T-ENV

`GET /api/v1/projects/:slug`; `loading.tsx` / `error.tsx`; `generateStaticParams` if applicable.

---

### T-PAGE-EXPERIENCES — Experiences page via REST

**GitHub Issue**: #294  
**Dependencies**: T-ENV

`GET /api/v1/experiences`; SkillAccordion + ExperienceCard updates.

---

### T-UI-PROJECT-CARD — ProjectCard aligned to API payload

**GitHub Issue**: #295  
**Dependencies**: T-PAGE-PROJECTS (or parallel)

---

### T-UI-STAT-CARD — StatCard component

**GitHub Issue**: #296  
**Dependencies**: T-PAGE-HOME

---

### T-UI-THEME — ThemeToggle functional

**GitHub Issue**: #297  

---

### T-UI-LANG — LanguageSelector functional

**GitHub Issue**: #298  

---

### T-UI-LOADING-ERROR — loading.tsx & error.tsx per segment

**GitHub Issue**: #299  

---

### T-UI-NOT-FOUND — not-found.tsx customizado

**GitHub Issue**: #300  
**Priority**: Medium  
**Dependencies**: None (standalone UI)

Custom 404 page at `apps/web/src/app/[locale]/not-found.tsx` aligned with the design system. Must handle both locale-aware routing and the global not-found fallback.

**Acceptance criteria**:
- `not-found.tsx` renders a styled 404 page consistent with the rest of the UI
- Works with next-intl locale prefix routing
- No broken links or missing translations

---

### T-UI-I18N — Internacionalizar textos hardcoded dos componentes

**GitHub Issue**: #301  
**Priority**: Low  
**Dependencies**: T-UI-LANG (LanguageSelector functional)

Audit all components for hardcoded Portuguese/English strings and move them to the `@repo/i18n` translation files consumed via `next-intl`. Covers page titles, button labels, aria-labels, and error messages not yet extracted.

**Acceptance criteria**:
- No hardcoded UI strings in `apps/web/src/` (except dynamic content from API)
- All locale files (`en`, `pt`) complete and in sync
- `pnpm --filter web build` passes in all locales

---

### T-RATE-LIMIT — Rate limiting para POST /api/v1/contact

**GitHub Issue**: #452  
**Priority**: Medium  
**Dependencies**: T-ENV (contact route must exist)

Protect `POST /api/v1/contact` against abuse with a request-rate strategy (e.g. IP-based in-memory or edge middleware). Excessive requests must receive `429 Too Many Requests` with `Retry-After` header per [05-API-CONTRACTS](../../docs/05-API-CONTRACTS.md).

**Acceptance criteria**:
- Requests exceeding the configured limit return `429` with `Retry-After`
- Legitimate traffic (≤ threshold) unaffected
- No Supabase or external dependency required for the rate-limit mechanism
- Threshold configurable via environment variable

---

### T-ID-WEB — Identity: login, middleware, admin UI (REST only)

**GitHub Issue**: #407  
**Priority**: Medium  
**Dependencies**: #442, #443, #444, #445 (identity phases 0–3)

`GET /api/v1/me`, `POST /api/v1/auth/sign-in`, middleware and admin layout **without** IdP SDK in `apps/web` per `11-IDENTITY`.

---

### T-ID-REST-AUTH — Identity: REST auth + GET /me (handlers)

**GitHub Issue**: #445  
**Priority**: High  
**Dependencies**: #442, #443, #444  

Route handlers for `auth/*` and `GET /api/v1/me` (may overlap scheduling with T-ENV; coordinate ordering).

---

## Execution order

```
T-ENV (core API surface)
  ├── T-CONTACT
  ├── T-RATE-LIMIT (após T-CONTACT)
  ├── T-PAGE-HOME, T-PAGE-PROJECTS, T-PAGE-PROJECT-DETAIL, T-PAGE-EXPERIENCES
  │     └── T-UI-PROJECT-CARD, T-UI-STAT-CARD
  ├── T-UI-THEME, T-UI-LANG, T-UI-LOADING-ERROR, T-UI-NOT-FOUND (paralelo)
  └── T-UI-I18N (após T-UI-LANG)

Identity (parallel track):
  #442 → #443 → #444 → #445 → T-ID-WEB (#407)
```

## Definition of Done

- [ ] Public portfolio data and contact flow work through documented REST contract
- [ ] No direct use-case imports from `apps/web` pages/components
- [ ] Contact email path uses handler + `SendContactMessage`
- [ ] `POST /api/v1/contact` returns 429 when rate limit exceeded
- [ ] Custom not-found page renders correctly with locale routing
- [ ] No hardcoded UI strings remain outside i18n files
- [ ] Identity UI blocked until auth REST exists; no Supabase SDK in client-facing `apps/web` layers per `11-IDENTITY`
- [ ] `pnpm --filter web build` passes
