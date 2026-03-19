# Roadmap — MVP and Next Steps

Evolution view for the portfolio, aligned with Clean Architecture, DDD, i18n, and Supabase. It can be mirrored in a project board or issue tracker.

---

## Index

- [MVP (Current and In Progress)](#mvp-current-and-in-progress)
- [Phase 1 — API and Infra](#phase-1--api-and-infra)
- [Phase 2 — Blog and Supabase](#phase-2--blog-and-supabase)
- [Phase 3 — Application and Contact Backend](#phase-3--application-and-contact-backend)
- [Phase 4 — Identity (Auth)](#phase-4--identity-auth)
- [Continuous Improvements](#continuous-improvements)

---

## MVP (Current and In Progress)

- [x] Monorepo (`pnpm` + Turborepo)
- [x] Next.js 14 (App Router) in `apps/web`
- [x] i18n (`next-intl`): `pt-BR`, `en-US`, `es`
- [x] Pages: Home, Projects, About
- [x] Domain in `@repo/core`: `Project`, `Experience`, `Skill`, `ProfessionalValue`, `Language`, `SocialNetwork`
- [x] Shared UI components in `@repo/ui`; Storybook in `apps/storybooks`
- [x] Contact form (Formik + Yup); still without backend delivery
- [x] Static data (projects in the page layer)
- [ ] Environment variables documented and optionally populated for links / contact data

---

## Phase 1 — API and Infra

- [ ] **`packages/infra`**
  - Supabase client (`@supabase/supabase-js`)
  - Env: `SUPABASE_URL`, `SUPABASE_ANON_KEY` (and `SUPABASE_SERVICE_ROLE_KEY` if needed, server only)
- [ ] **Supabase schema (Portfolio)**
  - Tables such as `projects`, `project_skills`, `skills`, `experiences`, etc., according to [../packages/infra/README.md](../packages/infra/README.md)
- [ ] **Mappers and repositories**
  - `ProjectMapper`, `ProjectRepositorySupabase` (and, if needed, equivalents for `Skill` and `Experience`)
- [ ] **REST API (Projects)**
  - `GET /api/projects`, `GET /api/projects/:id` (Route Handlers in `apps/web` or a future `apps/api`)
  - Envelope and errors according to [API.md](API.md) and [ERROR_HANDLING.md](ERROR_HANDLING.md)
- [ ] **Web**: replace static data with fetches to `/api/projects`

---

## Phase 2 — Blog and Supabase

- [ ] **Domain**
  - `BlogPost`, `Tag` in `@repo/core` (or in a dedicated `blog/` module)
- [ ] **Supabase schema (Blog)**
  - `posts`, `tags`, `post_tags`
- [ ] **Infra**
  - `PostMapper`, `TagMapper`, `PostRepositorySupabase`, `TagRepositorySupabase`
- [ ] **API**
  - `GET /api/posts`, `GET /api/posts/:slug`, `GET /api/tags`
- [ ] **Web**
  - Pages for post listing and post-by-slug
  - localized content strategy for Blog (for example, `LocalizedText` or locale-specific columns; see [I18N.md](I18N.md))

---

## Phase 3 — Application and Contact Backend

- [x] **`packages/application`** — base structure
  - [x] Abstract `UseCase` base class
  - [x] Output DTOs: `ProjectSummaryDTO`, `ProjectDetailDTO`, `ExperienceDTO`, `ProfileDTO`, and others
  - [x] `IEmailService` port
  - [x] `ContactMessageDTO`
  - [x] `GetFeaturedProjects` use case
  - [ ] Remaining use cases: `GetPublishedProjects`, `GetProjectBySlug`, `GetExperiences`, `GetProfile`, `SendContactMessage`
- [ ] **Infra**
  - Concrete implementations of the ports; `ContactSender` (Supabase `contacts`, Resend, or another provider)
- [ ] **API**
  - `POST /api/contact`; validation with Zod; rate limit and / or CAPTCHA (to be decided)
- [ ] **Web**
  - Contact form submits to `/api/contact`; error handling uses stable codes and i18n

---

## Phase 4 — Identity (Auth)

> **Status:** planejado. Plano detalhado em [11-IDENTITY](./11-IDENTITY.md) e [plans/identity-mvp.md](../plans/identity-mvp.md).

- [ ] **Domain** (`packages/core`)
  - User, Role, Email, AccessPolicy, IUserRepository, UnauthorizedError
- [ ] **Infrastructure** (`packages/infra`)
  - Migration tabela `users`; SupabaseUserRepository; seed admin
- [ ] **Application** (`packages/application`)
  - GetCurrentUserUseCase, EnsureAdminUseCase
- [ ] **Web** (`apps/web`)
  - Middleware auth; página login; layout admin; getAuthenticatedUser

Modelo de papéis: `ADMIN | VISITOR`. Rotas protegidas: `/[locale]/admin/*`. Login: `/[locale]/login`.

---

## Continuous Improvements

- **Validation**: Zod in the API and row decoding; gradual migration from Yup to Zod in forms; see [VALIDATION.md](VALIDATION.md)
- **Errors**: complete `ERROR_MESSAGE` with `es`; standardize codes and HTTP mapping across endpoints
- **Domain content i18n**: define and implement `LocalizedText` or translation columns / tables for Projects and Blog
- **Tests**: coverage for use cases, repositories (with local Supabase or mocks), and Route Handlers
- **Quality**: CI for lint, format, types, and tests; PR previews where applicable
- **`apps/api`**: if the API grows significantly, extract Route Handlers into a dedicated app in the monorepo
- **Documentation**: keep READMEs and `docs/` in sync with decisions and code
