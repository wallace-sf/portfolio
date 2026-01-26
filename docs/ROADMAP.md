# Roadmap — MVP e próximos passos

Visão de evolução do portfolio, alinhada à Clean Architecture, DDD, i18n e Supabase. Pode ser espelhada em Project Board / issues.

---

## Índice

- [MVP (atual e em curso)](#mvp-atual-e-em-curso)
- [Fase 1 — API e Infra](#fase-1--api-e-infra)
- [Fase 2 — Blog e Supabase](#fase-2--blog-e-supabase)
- [Fase 3 — Application e Contact backend](#fase-3--application-e-contact-backend)
- [Melhorias contínuas](#melhorias-contínuas)

---

## MVP (atual e em curso)

- [x] Monorepo (pnpm + Turborepo)
- [x] Next.js 14 (App Router) em `apps/web`
- [x] i18n (next-intl): pt-BR, en-US, es
- [x] Páginas: Home, Projects, About
- [x] Domínio em `@repo/core`: Project, Experience, Skill, ProfessionalValue, Language, SocialNetwork
- [x] Componentes em `@repo/ui`; Storybook em `apps/storybooks`
- [x] Formulário de contato (Formik + Yup); envio ainda sem backend
- [x] Dados estáticos (projetos na página)
- [ ] Variáveis de ambiente documentadas e opcionalmente preenchidas para links/contato

---

## Fase 1 — API e Infra

- [ ] **`packages/infra`**
  - Cliente Supabase (`@supabase/supabase-js`)
  - Env: `SUPABASE_URL`, `SUPABASE_ANON_KEY` (e `SUPABASE_SERVICE_ROLE_KEY` se necessário, só server)
- [ ] **Schema Supabase (Portfolio)**
  - Tabelas: `projects`, `project_skills`, `skills`, `experiences`, etc., conforme [packages/infra/README.md](../packages/infra/README.md)
- [ ] **Mappers e repositórios**
  - `ProjectMapper`, `ProjectRepositorySupabase` (e, se fizer sentido, `Skill`, `Experience`)
- [ ] **API REST (Projects)**
  - `GET /api/projects`, `GET /api/projects/:id` (Route Handlers em `apps/web` ou `apps/api` futuro)
  - Envelope e erros conforme [docs/API.md](API.md) e [docs/ERROR_HANDLING.md](ERROR_HANDLING.md)
- [ ] **Web**: trocar dados estáticos por fetch à `/api/projects`

---

## Fase 2 — Blog e Supabase

- [ ] **Domínio**
  - `BlogPost`, `Tag` em `@repo/core` (ou em módulo `blog/`)
- [ ] **Schema Supabase (Blog)**
  - `posts`, `tags`, `post_tags`
- [ ] **Infra**
  - `PostMapper`, `TagMapper`, `PostRepositorySupabase`, `TagRepositorySupabase`
- [ ] **API**
  - `GET /api/posts`, `GET /api/posts/:slug`, `GET /api/tags`
- [ ] **Web**
  - Páginas: listagem de posts, post por slug; i18n de conteúdo (LocalizedText ou colunas por idioma, ver [docs/I18N.md](I18N.md))

---

## Fase 3 — Application e Contact backend

- [ ] **`packages/application`** (ou equivalente)
  - Ports: `IProjectRepository`, `IPostRepository`, `ITagRepository`, `IContactSender`
  - Use cases: `GetProjects`, `GetProjectById`, `ListPosts`, `GetPostBySlug`, `ListTags`, `SendContact`
  - View models quando necessário
- [ ] **Infra**
  - Implementações dos ports; `ContactSender` (Supabase `contacts`, Resend ou outro)
- [ ] **API**
  - `POST /api/contact`; validação com Zod; rate limit e/ou CAPTCHA (a definir)
- [ ] **Web**
  - Contact form envia para `/api/contact`; tratamento de erro com códigos e i18n

---

## Melhorias contínuas

- **Validação**: Zod na API e no decode de rows; migração de Yup para Zod nos forms; ver [docs/VALIDATION.md](VALIDATION.md)
- **Erros**: completar `ERROR_MESSAGE` com `es`; padronizar códigos e mapeamento HTTP em todos os endpoints
- **i18n de conteúdo**: definir e implementar LocalizedText ou colunas/tabelas de tradução para Projects e Blog
- **Testes**: cobertura de use cases, repositórios (com Supabase local ou mocks) e Route Handlers
- **Qualidade**: CI (lint, format, types, test) e, se aplicável, preview de PR
- **`apps/api`**: se a API crescer, extrair Route Handlers para um app dedicado no monorepo
- **Documentação**: manter READMEs e `docs/` em sync com as decisões e com o código
