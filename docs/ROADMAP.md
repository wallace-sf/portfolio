# Roadmap — Portfolio

Evolution view for the portfolio, aligned with Clean Architecture, DDD, i18n, and Supabase.

---

## Index

- [Completed Sprints](#completed-sprints)
- [MVP Round 2 — In Planning](#mvp-round-2--in-planning)
- [Post-MVP](#post-mvp)

---

## Completed Sprints

### Core (Sprint 0)

- [x] Either pattern (`Left`, `Right`, `left`, `right`)
- [x] Base classes: `Entity`, `ValueObject`, `AggregateRoot`
- [x] `Validator` with chain of responsibility
- [x] Migrated test runner to Vitest

### Domain (Sprint 1)

- [x] Value Objects: `Slug`, `Name`, `Url`, `LocalizedText`, `DateRange`, `Email`
- [x] Entities: `Project`, `Experience`, `Profile`, `Skill`, `ContactMessage`
- [x] Repository interfaces: `IProjectRepository`, `IExperienceRepository`, `IProfileRepository`
- [x] `User`, `Role`, `IUserRepository`, `UnauthorizedError` (Identity context)

### Infrastructure (Sprint 2)

- [x] Prisma schema (Project, Experience, Skill, Profile, User)
- [x] Repositories: `PrismaProjectRepository`, `PrismaExperienceRepository`, `PrismaProfileRepository`, `PrismaUserRepository`
- [x] DI container (`makeContainer`, `getContainer`)
- [x] Email adapter (`ResendEmailService`)
- [x] Migrations and seed

### Application (Sprint 2–3)

- [x] Use cases: `GetPublishedProjects`, `GetFeaturedProjects`, `GetProjectBySlug`
- [x] Use cases: `GetExperiences`, `GetProfile`, `GetProfessionalValues`
- [x] Use case: `SendContactMessage`
- [x] Use cases: `GetCurrentUser`, `EnsureAdmin`
- [x] DTOs for all implemented contexts

### REST API — `apps/site` (Sprint 3–4)

- [x] Envelope and error mapper (`successResponse`, `errorResponse`, `mapErrorToResponse`)
- [x] `GET /api/v1/projects`, `/projects/featured`, `/projects/:slug`
- [x] `GET /api/v1/experiences`, `/profile`, `/professional-values`, `/me`
- [x] `POST /api/v1/contact` with rate limiting (Upstash)
- [x] `POST /api/v1/auth/sign-in`, `sign-out`, `refresh`
- [x] `GET|POST /api/v1/admin/projects`, `/admin/projects/:id`
- [x] `POST /api/v1/admin/projects/:id/publish`, `/archive`
- [x] `GET|PATCH /api/v1/admin/profile`
- [x] `GET|POST|PATCH|DELETE /api/v1/admin/experiences`

### Presentation — `apps/site` (Sprint 3–5)

- [x] i18n (`next-intl`): `pt-BR`, `en-US`, `es`
- [x] Pages: Home, Projects, Projects/[slug], About, Login, Admin
- [x] `loading.tsx` and `error.tsx` per route segment
- [x] Locale and authentication middleware
- [x] Contact form with validation (React Hook Form + Zod)
- [x] Login form

### Design System — `@repo/ui` (Sprint 6)

- [x] `Badge` component with variants
- [x] `Button` with appearance variants
- [x] `SectionHeader`

---

## MVP Round 2 — In Planning

Items required before MVP launch, using [Paul Scanlon's portfolio](https://www.paulie.dev/) as a reference.

- [ ] **Styling review** — Figma round to identify what needs to be finished and changed in components
- [ ] **Realistic data** — replace seeds with content closer to the real portfolio data
- [ ] **Endpoint testing** — manually validate all route handlers (`/api/v1/...`)
- [ ] **i18n in core** — implement `LocalizedText` and i18n in the domain (`@repo/core`)
- [ ] **Remove hardcoded texts** — fixed strings in `@repo/core` should use localizable messages
- [ ] **Move admin to a dedicated app** — extract `/{locale}/login` and `/{locale}/admin` to `apps/admin`
- [ ] **General code review** — quality pass before launch

---

## Post-MVP

- [ ] **Blog** (`apps/blog`) — `BlogPost`, `Tag`, public API, listing and detail pages
- [ ] **`IAuthenticationGateway`** — pluggable Supabase gateway, `authSubject`, `EnsureAppUserForAuthSession`
- [ ] **API in its own repository** — extract route handlers to a dedicated repository
- [ ] **Playwright E2E** — end-to-end tests for critical flows
- [ ] **CI/CD** — re-enable GitHub Actions when the plan allows runners

---

## Continuous Improvements

- **Validation:** Zod in APIs and row decoding; gradual migration to Zod in forms
- **Errors:** complete `ERROR_MESSAGE` with `es`; standardize codes and HTTP mapping
- **Tests:** coverage for use cases, repositories (local DB), and route handlers
- **Documentation:** keep `docs/` in sync with decisions and code
