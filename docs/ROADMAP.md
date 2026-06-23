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

### Presentation — `apps/site` (Sprint 3–5)

- [x] i18n (`next-intl`): `pt-BR`, `en-US`, `es`
- [x] Pages: Home, Projects, Projects/[slug], About, Login, Admin
- [x] `error.tsx` per route segment
- [x] Locale middleware (next-intl)
- [x] Contact form with validation (React Hook Form + Zod)

### Design System — `@repo/ui` (Sprint 6+)

- [x] `Badge` component with variants
- [x] `Button` with appearance variants
- [x] `SectionHeader`
- [x] `TextRich` with Markdown + Mermaid diagram support (React.lazy, client-side rendering)
- [x] OG image generation (`/og` route with `@vercel/og`)

---

## MVP Round 2 — In Planning

Items required before MVP launch, using [Paul Scanlon's portfolio](https://www.paulie.dev/) as a reference.

- [ ] **Styling review** — Figma round to identify what needs to be finished and changed in components
- [x] **Realistic data** — seeds updated with production-representative content
- [x] **i18n in core** — `LocalizedText` VO implemented in `@repo/core`; use cases resolve locale via `.get(locale)`
- [ ] **Remove hardcoded texts** — fixed strings in `@repo/core` should use localizable messages
- [ ] **Move admin to a dedicated app** — extract `/{locale}/login` and `/{locale}/admin` to `apps/admin`
- [ ] **General code review** — quality pass before launch

---

## Post-MVP

- [ ] **Blog** (`apps/blog`) — `BlogPost`, `Tag`, public API, listing and detail pages
- [ ] **`IAuthenticationGateway`** — pluggable Supabase gateway, `authSubject`, `EnsureAppUserForAuthSession`
- [ ] **Dedicated backend** — REST API in a separate repository; `apps/site` remains a pure SSG consumer
- [ ] **Playwright E2E** — end-to-end tests for critical flows
- [ ] **CI/CD** — re-enable GitHub Actions when the plan allows runners

---

## Continuous Improvements

- **Validation:** Zod in APIs and row decoding; gradual migration to Zod in forms
- **Errors:** complete `ERROR_MESSAGE` with `es`; standardize codes and HTTP mapping
- **Tests:** coverage for use cases and repositories (local DB)
- **Documentation:** keep `docs/` in sync with decisions and code
