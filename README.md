# Portfolio — Portfólio multilíngue com DDD e Clean Architecture

[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)](https://www.typescriptlang.org)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![pnpm](https://img.shields.io/badge/pnpm-8-orange)](https://pnpm.io)
[![Turborepo](https://img.shields.io/badge/Turborepo-latest-ef4444)](https://turbo.build)

Monorepo de portfólio pessoal com conteúdo multilíngue (pt-BR, en-US, es), orientado a **DDD**, **Clean Architecture**, modularização e evolução incremental. Inclui (ou planeja): projetos, experiência, skills, blog com BD (Supabase) e API REST.

---

## Índice

- [O que é](#o-que-é)
- [Por que existe](#por-que-existe)
- [Features](#features)
- [Arquitetura](#arquitetura)
- [Estrutura do monorepo](#estrutura-do-monorepo)
- [Stack](#stack)
- [Como rodar local](#como-rodar-local)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Scripts úteis](#scripts-úteis)
- [Qualidade](#qualidade)
- [Contribuição](#contribuição)
- [Roadmap](#roadmap)
- [Licença](#licença)
- [English summary](#english-summary)

---

## O que é

Portfólio em formato de site com:

- **Conteúdo multilíngue** (pt-BR, en-US, es) na UI e no domínio.
- **Seções**: Projects (case studies), Experience, Skills, About, Contact.
- **Blog** (posts em BD) — *MVP com Supabase*.
- **API REST** para Projects, Blog e futuras integrações.

## Por que existe

Demonstrar domínio em: DDD, Clean Architecture, modularização, i18n, validação em camadas, tratamento de erros e evolução incremental — útil para recrutadores e para evolução técnica do projeto.

---

## Features

| Feature | Status |
|--------|--------|
| i18n UI (next-intl, pt/en/es) | ✅ |
| Páginas: Home, Projects, About | ✅ |
| Domínio: Project, Skill, Experience, etc. (`@repo/core`) | ✅ |
| Componentes UI reutilizáveis (`@repo/ui`) | ✅ |
| Formulário de contato (Formik + Yup) | ✅ |
| API REST (Projects, Blog) | 🔲 WIP |
| Blog com posts em BD (Supabase) | 🔲 WIP |
| Camada de aplicação (use cases, ports) | 🔲 WIP |
| Infra (Supabase, repositórios, mappers) | 🔲 WIP |

---

## Arquitetura

Visão em camadas:

```
┌─────────────────────────────────────────────────────────┐
│  Web (Next.js) / API                                    │
│  Consome application ou chama use cases                 │
└─────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────┐
│  Application (use cases, ports, view models) — WIP      │
│  Depende apenas do Core                                 │
└─────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────┐
│  Core (domain)                                          │
│  Entidades, VOs, invariantes. Zero deps de infra/web    │
└─────────────────────────────────────────────────────────┘
                            ▲
┌─────────────────────────────────────────────────────────┐
│  Infra (adapters, repos, Supabase, mappers) — WIP       │
│  Implementa ports definidos na Application              │
└─────────────────────────────────────────────────────────┘
```

- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** — Clean Architecture + DDD, limites e decisões.
- **[docs/BOUNDED_CONTEXTS.md](docs/BOUNDED_CONTEXTS.md)** — Context Map e responsabilidades.
- **[docs/APPLICATION.md](docs/APPLICATION.md)** — Use cases, ports e view models (WIP).
- **[docs/API.md](docs/API.md)** — API REST planejada (Projects, Blog, Contact).
- **[docs/I18N.md](docs/I18N.md)** — i18n (UI e domínio).
- **[docs/ERROR_HANDLING.md](docs/ERROR_HANDLING.md)** — Erros (códigos, HTTP, i18n).
- **[docs/VALIDATION.md](docs/VALIDATION.md)** — Validação (Zod, invariantes).

---

## Estrutura do monorepo

```
portfolio/
├── apps/
│   ├── web/          # Next.js (front-end, i18n, páginas)
│   └── storybooks/   # Storybook para @repo/ui
├── packages/
│   ├── core/         # Domínio (entidades, VOs, shared kernel)
│   ├── utils/        # Validator, validações, formatters, i18n helpers
│   ├── ui/           # Componentes React reutilizáveis
│   ├── infra/        # (WIP) Supabase, repositórios, mappers
│   ├── eslint-config/
│   ├── prettier-config/
│   ├── tailwind-config/
│   └── typescript-config/
└── docs/             # Arquitetura, i18n, erros, validação, roadmap
```

- `apps/api` não existe; a API REST está planejada em **[docs/API.md](docs/API.md)**.

---

## Stack

- **Runtime**: Node ≥18
- **Linguagem**: TypeScript 5.x
- **Monorepo**: pnpm + Turborepo
- **Front-end**: Next.js 14, React 18, Tailwind, next-intl
- **Formulários**: Formik, Yup (validação na borda)
- **Domínio**: `@repo/core` (Entity, ValueObject, entidades), `@repo/utils` (Validator, ValidationError)
- **BD/Back-end (planejado)**: Supabase (supabase-js) para Blog e dados dinâmicos

---

## Como rodar local

### Pré-requisitos

- **Node** ≥ 18  
- **pnpm** 8.x (`corepack enable && corepack prepare pnpm@8.15.6 --activate` ou instalação global)

### Passo a passo

1. **Clonar e instalar dependências**

   ```bash
   git clone <repo-url>
   cd portfolio
   pnpm install
   ```

2. **Variáveis de ambiente (opcional para rodar o web)**

   Copie o exemplo e preencha conforme necessário:

   ```bash
   cp apps/web/.env.example apps/web/.env.local
   ```

   Para uso só local, o app roda sem as variáveis (links/contato podem ficar vazios). Para Supabase (quando implementado), veja [Variáveis de ambiente](#variáveis-de-ambiente).

3. **Desenvolvimento**

   ```bash
   pnpm dev
   ```

   O Next.js (`apps/web`) sobe em `http://localhost:3000`. Locales: `/pt-BR`, `/en-US`, `/es`.

4. **Build**

   ```bash
   pnpm build
   ```

5. **Storybook (UI)**

   ```bash
   pnpm storybook
   ```

---

## Variáveis de ambiente

### `apps/web`

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `NEXT_PUBLIC_CONTACT_EMAIL` | Não | E-mail de contato |
| `NEXT_PUBLIC_CONTACT_NUMBER` | Não | Telefone |
| `NEXT_PUBLIC_GITHUB_URL` | Não | URL do GitHub |
| `NEXT_PUBLIC_LINKEDIN_URL` | Não | URL do LinkedIn |
| `NEXT_PUBLIC_RESUME_URL` | Não | URL do currículo |
| `NEXT_PUBLIC_WHATSAPP_URL` | Não | URL do WhatsApp |

Exemplo: `apps/web/.env.example`. **Não commitar** `.env` ou `.env.local` com secrets.

### Supabase (planejado, para Blog/API)

Quando a infra existir, serão usadas (nomes a confirmar na implementação):

- `SUPABASE_URL` — URL do projeto Supabase  
- `SUPABASE_ANON_KEY` — Chave anônima (browser/edge)  
- `SUPABASE_SERVICE_ROLE_KEY` — (apenas server-side, se necessário) — **nunca expor no client**

---

## Scripts úteis

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Sobe apps em modo desenvolvimento (Turbo) |
| `pnpm build` | Build de todos os pacotes/apps |
| `pnpm storybook` | Sobe Storybook |
| `pnpm lint` | Lint em todo o monorepo |
| `pnpm lint:check` | Lint sem --fix |
| `pnpm format` | Formata com Prettier |
| `pnpm format:check` | Verifica formatação |
| `pnpm types` | Checagem de tipos (tsc) |
| `pnpm test` | Testes (Turbo) |

Scripts por pacote: `lint:web`, `lint:core`, `test:web`, `test:core`, etc. (ver `package.json` na raiz).

---

## Qualidade

- **Lint**: ESLint (config compartilhada em `@repo/eslint-config`)
- **Formatação**: Prettier (`@repo/prettier-config`)
- **Tipos**: `pnpm types` em cada pacote
- **Testes**: Jest (core, utils, web, etc.)
- **Hooks**: Lefthook — `commit-msg` (Commitlint) e `pre-commit` (lint, format, types, test dos pacotes)

---

## Contribuição

Mesmo sendo projeto pessoal, o padrão é mantido para consistência:

- **Commits**: [Conventional Commits](https://www.conventionalcommits.org) (`feat:`, `fix:`, `docs:`, `chore:`, etc.) — validado por Commitlint.
- **Branch naming**: `feature/descricao`, `fix/descricao`, `docs/descricao`.
- **PRs**: Descrever o que muda e, se houver, linkar issue (`Closes #N`).
- **Onde abrir PR**: `main` (ou branch principal definida no repositório).

---

## Roadmap

- **[docs/ROADMAP.md](docs/ROADMAP.md)** — MVP, Blog, API, Supabase e próximos passos, alinhado ao Project Board.

---

## Licença

All rights reserved. (Proprietário.)

---

## English summary

This is a **multilingual personal portfolio** (pt-BR, en-US, es) built as a **Turborepo monorepo**. It showcases **DDD** and **Clean Architecture**: domain in `@repo/core`, shared utilities in `@repo/utils`, and a **Next.js** front-end with **next-intl**. Planned: **Supabase**-backed blog, **REST API** for projects and posts, and an application layer (use cases/ports). Run with `pnpm install && pnpm dev`; see [Variáveis de ambiente](#variáveis-de-ambiente) and [docs/](docs/) for architecture, i18n, validation, and error-handling.
