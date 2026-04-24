# Roadmap — MVP and Next Steps

Evolution view for the portfolio, aligned with Clean Architecture, DDD, i18n, and Supabase. It can be mirrored in a project board or issue tracker.

---

## Index

- [MVP (Current and In Progress)](#mvp-current-and-in-progress)
- [Phase 1 — REST API and Web Consumption](#phase-1--rest-api-and-web-consumption)
- [Phase 2 — Blog and Supabase](#phase-2--blog-and-supabase)
- [Phase 3 — Contact Delivery at the Edge](#phase-3--contact-delivery-at-the-edge)
- [Phase 4 — Identity (sessions and admin UI)](#phase-4--identity-sessions-and-admin-ui)
- [Continuous Improvements](#continuous-improvements)

---

## MVP (Current and In Progress)

- [x] Monorepo (`pnpm` + Turborepo)
- [x] Next.js 14 (App Router) in `apps/web`
- [x] i18n (`next-intl`): `pt-BR`, `en-US`, `es`
- [x] Pages: Home, Projects, About
- [x] Domain in `@repo/core`: Portfolio + Identity (`User`, `Role`, …)
- [x] `packages/application`: Portfolio use cases, Identity (`GetCurrentUser`, `EnsureAdmin`), `SendContactMessage`
- [x] `packages/infra`: Prisma repositories, email adapter (`ResendEmailService`)
- [x] Shared UI components in `@repo/ui`; Storybook in `apps/storybooks`
- [ ] **REST Route Handlers** implementing [05-API-CONTRACTS](./05-API-CONTRACTS.md) (`/api/v1/...`)
- [ ] **Web**: replace static data with `fetch` / TanStack Query to the REST API only (no direct `@repo/application` imports from pages)
- [ ] Environment variables documented and optionally populated for links / contact data

---

## Phase 1 — REST API and Web Consumption

- [ ] **Route handlers** in `apps/web/app/api/v1/...` (or extract `apps/api` if the surface grows)
- [ ] **Envelope and errors** per [05-API-CONTRACTS](./05-API-CONTRACTS.md) and [06-VALIDATION](./06-VALIDATION.md)
- [ ] **Portfolio**: `GET` projects (published, featured, by slug), experiences, profile
- [ ] **Identity**: `GET /api/v1/me` (session required); admin routes call `EnsureAdmin` before mutations
- [ ] **Web**: all data reads/writes through HTTP; align with authorization table in [05-API-CONTRACTS](./05-API-CONTRACTS.md)

---

## Phase 2 — Blog and Supabase

- [ ] **Domain**
  - `BlogPost`, `Tag` in `@repo/core` (or in a dedicated `blog/` module)
- [ ] **Supabase schema (Blog)**
  - `posts`, `tags`, `post_tags`
- [ ] **Infra**
  - `PostMapper`, `TagMapper`, `PostRepositorySupabase`, `TagRepositorySupabase`
- [ ] **API**
  - `GET /api/v1/posts`, `GET /api/v1/posts/:slug`, `GET /api/v1/tags` (see [05-API-CONTRACTS](./05-API-CONTRACTS.md))
- [ ] **Web**
  - Pages for post listing and post-by-slug
  - Localized content strategy for Blog (for example, `LocalizedText` or locale-specific columns; see [07-I18N](./07-I18N.md))

---

## Phase 3 — Contact Delivery at the Edge

- [x] `SendContactMessage` use case and `IEmailService` implementation
- [ ] **`POST /api/v1/contact`** with Zod validation, rate limit and / or CAPTCHA (to be decided)
- [ ] **Web**: contact form submits to `POST /api/v1/contact`; errors use stable codes and i18n

---

## Phase 4 — Identity (sessions and admin UI)

> Core + application já têm `User`, `GetCurrentUser`, `EnsureAdmin`. Falta **gateway de auth**, **`authSubject`**, **rotas REST** e UI — ver [plans/identity-mvp.md](../plans/identity-mvp.md).

- [x] **Domain** (`packages/core`): `User`, `Role`, `IUserRepository`, `UnauthorizedError`
- [x] **Infrastructure**: Prisma `User` model and repository
- [x] **Application**: `GetCurrentUser`, `EnsureAdmin`
- [ ] **`IAuthenticationGateway`** + adaptador Supabase **só em `@repo/infra`**
- [ ] **Dados**: `User.authSubject`, `findByAuthSubject` / `linkAuthSubject`, caso de uso `EnsureAppUserForAuthSession`
- [ ] **REST**: `POST /api/v1/auth/sign-in`, `sign-out`, `refresh`, `GET /api/v1/me` ([05-API-CONTRACTS](./05-API-CONTRACTS.md))
- [ ] **Middleware / Web**: login e admin sem SDK do IdP no cliente

Modelo de papéis: `ADMIN | VISITOR`.

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

- **Validation**: Zod in the API and row decoding; gradual migration from Yup to Zod in forms; see [06-VALIDATION](./06-VALIDATION.md)
- **Errors**: complete `ERROR_MESSAGE` with `es`; standardize codes and HTTP mapping across endpoints
- **Domain content i18n**: define and implement `LocalizedText` or translation columns / tables for Projects and Blog
- **Tests**: coverage for use cases, repositories (with local DB or mocks), and Route Handlers
- **Quality**: CI for lint, format, types, and tests; PR previews where applicable
- **`apps/api`**: if the API grows significantly, extract Route Handlers into a dedicated app in the monorepo
- **Documentation**: keep READMEs and `docs/` in sync with decisions and code
