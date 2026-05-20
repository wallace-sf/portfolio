# Roadmap — Portfolio

Evolution view for the portfolio, aligned with Clean Architecture, DDD, i18n, and Supabase.

---

## Index

- [Sprints Concluídos](#sprints-concluídos)
- [MVP Round 2 — Em planejamento](#mvp-round-2--em-planejamento)
- [Pós-MVP](#pós-mvp)

---

## Sprints Concluídos

### Core (Sprint 0)

- [x] Either pattern (`Left`, `Right`, `left`, `right`)
- [x] Base classes: `Entity`, `ValueObject`, `AggregateRoot`
- [x] `Validator` com chain of responsibility
- [x] Migração do test runner para Vitest

### Domain (Sprint 1)

- [x] Value Objects: `Slug`, `Name`, `Url`, `LocalizedText`, `DateRange`, `Email`
- [x] Entidades: `Project`, `Experience`, `Profile`, `Skill`, `ContactMessage`
- [x] Repository interfaces: `IProjectRepository`, `IExperienceRepository`, `IProfileRepository`
- [x] `User`, `Role`, `IUserRepository`, `UnauthorizedError` (Identity context)

### Infrastructure (Sprint 2)

- [x] Prisma schema (Project, Experience, Skill, Profile, User)
- [x] Repositórios: `PrismaProjectRepository`, `PrismaExperienceRepository`, `PrismaProfileRepository`, `PrismaUserRepository`
- [x] Container DI (`makeContainer`, `getContainer`)
- [x] Email adapter (`ResendEmailService`)
- [x] Migrations e seed

### Application (Sprint 2–3)

- [x] Use cases: `GetPublishedProjects`, `GetFeaturedProjects`, `GetProjectBySlug`
- [x] Use cases: `GetExperiences`, `GetProfile`, `GetProfessionalValues`
- [x] Use case: `SendContactMessage`
- [x] Use cases: `GetCurrentUser`, `EnsureAdmin`
- [x] DTOs para todos os contextos implementados

### REST API — `apps/site` (Sprint 3–4)

- [x] Envelope e error mapper (`successResponse`, `errorResponse`, `mapErrorToResponse`)
- [x] `GET /api/v1/projects`, `/projects/featured`, `/projects/:slug`
- [x] `GET /api/v1/experiences`, `/profile`, `/professional-values`, `/me`
- [x] `POST /api/v1/contact` com rate limiting (Upstash)
- [x] `POST /api/v1/auth/sign-in`, `sign-out`, `refresh`
- [x] `GET|POST /api/v1/admin/projects`, `/admin/projects/:id`
- [x] `POST /api/v1/admin/projects/:id/publish`, `/archive`
- [x] `GET|PATCH /api/v1/admin/profile`
- [x] `GET|POST|PATCH|DELETE /api/v1/admin/experiences`

### Presentation — `apps/site` (Sprint 3–5)

- [x] i18n (`next-intl`): `pt-BR`, `en-US`, `es`
- [x] Páginas: Home, Projects, Projects/[slug], About, Login, Admin
- [x] `loading.tsx` e `error.tsx` por segmento de rota
- [x] Middleware de locale e autenticação
- [x] Formulário de contato com validação (React Hook Form + Zod)
- [x] Formulário de login

### Design System — `@repo/ui` (Sprint 6)

- [x] Componente `Badge` com variantes
- [x] `Button` com variantes de aparência
- [x] `SectionHeader`

---

## MVP Round 2 — Em planejamento

Itens necessários antes do lançamento do MVP, tendo como referência o portfolio de [Paul Scanlon](https://www.paulie.dev/).

- [ ] **Revisão de estilização** — rodada com Figma para identificar o que terminar e alterar nos componentes
- [ ] **Dados realistas** — substituir seeds por dados mais próximos do conteúdo real do portfolio
- [ ] **Teste de endpoints** — validar todos os routes handlers (`/api/v1/...`) manualmente
- [ ] **i18n no core** — implementar `LocalizedText` e i18n no domínio (`@repo/core`)
- [ ] **Remover textos hardcoded** — textos fixos em `@repo/core` devem usar as mensagens localizáveis
- [ ] **Mover admin para app exclusivo** — extrair `/{locale}/login` e `/{locale}/admin` para `apps/admin`
- [ ] **Revisão geral de código** — quality pass antes do lançamento

---

## Pós-MVP

- [ ] **Blog** (`apps/blog`) — `BlogPost`, `Tag`, API pública, páginas de listagem e detalhe
- [ ] **`IAuthenticationGateway`** — gateway Supabase plugável, `authSubject`, `EnsureAppUserForAuthSession`
- [ ] **API em repositório próprio** — extrair route handlers para repositório dedicado
- [ ] **Playwright E2E** — testes end-to-end para fluxos críticos
- [ ] **CI/CD** — reativar GitHub Actions quando plano permitir runners

---

## Continuous Improvements

- **Validação:** Zod nas APIs e decodificação de row; migração gradual para Zod nos formulários
- **Erros:** completar `ERROR_MESSAGE` com `es`; padronizar códigos e mapeamento HTTP
- **Testes:** cobertura de use cases, repositórios (DB local) e route handlers
- **Documentação:** manter `docs/` em sincronia com decisões e código
