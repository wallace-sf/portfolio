# Wallace Ferreira — Portfolio

<p align="center">
  <img src="apps/site/src/assets/images/logo.svg" alt="Portfolio logo" width="200" />
</p>

Personal portfolio built to present my experience, selected projects, technical background and career direction as a Front-end Software Engineer.

🌐 **Live:** [portfolio-web-kohl-two.vercel.app](https://portfolio-web-kohl-two.vercel.app)

> [!NOTE]
> This project is under active development. The public website and the repository are evolving as I refine the portfolio, improve the architecture and document technical decisions.

---

## Overview

This repository contains my personal portfolio and its supporting packages. It is not only a presentation website, but also a practical space where I apply front-end architecture, product-oriented UI decisions, maintainable code organization and production-minded development practices.

The project is designed for an international audience and aims to communicate three things clearly:

- my professional experience and selected work;
- how I approach front-end engineering and architecture;
- how I document and evolve a real project over time.

---

## What this project demonstrates

- Modern front-end development with Next.js, React and TypeScript
- Monorepo organization with Turborepo and pnpm workspaces
- Clean Architecture and DDD applied beyond buzzwords
- Clear separation between domain, application, infrastructure and interface layers
- Multilingual content for pt-BR, en-US and es
- Form handling, validation and email delivery
- Testing strategy across unit, integration and end-to-end layers
- Deployment workflow with Vercel and GitHub Actions

---

## Tech stack

| Area | Technology |
|---|---|
| Monorepo | Turborepo, pnpm workspaces |
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Architecture | Clean Architecture, DDD, SOLID |
| Domain | TypeScript packages with framework-independent rules |
| Database | Supabase PostgreSQL, Prisma ORM |
| Email | Resend |
| i18n | next-intl |
| Forms | React Hook Form, Zod |
| Data fetching | SSG (Server Components) + TanStack Query |
| Testing | Vitest, Testing Library, Playwright |
| CI/CD | GitHub Actions, Vercel |

---

## Project structure

```txt
apps/
  site/         Public portfolio application (Next.js 16+ App Router)
  admin/        Admin app — future, post-MVP
  blog/         Blog application — future, post-MVP

packages/
  core/         Domain layer: entities, value objects, repository interfaces
  application/  Use cases, DTOs and service ports
  infra/        Prisma, Supabase and external service adapters
  ui/           Shared React component library
  utils/        Shared utilities
  eslint-config/
  typescript-config/
```

The dependency rule points inward:

```txt
core ← application ← infra ← site / admin
```

For a deeper explanation of layers, dependency rules and boundaries, see [docs/02-ARCHITECTURE.md](./docs/02-ARCHITECTURE.md).

---

## Getting started

### Prerequisites

- Node.js 22+
- pnpm 8.15.6+
- A Supabase project or compatible PostgreSQL database
- A Resend account if you want to test email delivery

### Installation

```bash
git clone https://github.com/wallace-sf/portfolio.git
cd portfolio
pnpm install
```

### Environment variables

Create your local environment file from the example file and fill in the required values.

```bash
cp .env.example .env.local
```

### Database setup

```bash
pnpm --filter @repo/infra db:generate
pnpm --filter @repo/infra db:migrate
pnpm seed
```

### Run locally

```bash
pnpm dev
```

---

## Available scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start development mode for the monorepo |
| `pnpm build` | Build all apps and packages through Turborepo |
| `pnpm lint` | Run lint tasks |
| `pnpm lint:check` | Check lint rules without applying fixes |
| `pnpm format` | Run formatting tasks |
| `pnpm format:check` | Check formatting |
| `pnpm types` | Run type checks |
| `pnpm test` | Run test tasks |
| `pnpm test:ci` | Run CI test command |
| `pnpm test:core` | Run core package tests |
| `pnpm test:utils` | Run utils package tests |
| `pnpm test:site` | Run site app tests |
| `pnpm seed` | Seed data through `@repo/infra` |

---

## Current features

- Multilingual support: pt-BR, en-US and es
- Light, dark and system theme support
- Professional experience section with role details
- Projects showcase with rich Markdown content
- Contact form with email notification
- Resume link
- GitHub and LinkedIn links

---

## Roadmap

- [ ] Improve portfolio content and case study presentation
- [ ] Add blog support with posts, tags and categories
- [ ] Add admin panel for content management
- [ ] Improve SEO, OpenGraph metadata and sitemap coverage
- [ ] Expand automated test coverage around critical user flows

---

## Documentation

| Document | Purpose |
|---|---|
| [docs/INDEX.md](./docs/INDEX.md) | Documentation index |
| [docs/02-ARCHITECTURE.md](./docs/02-ARCHITECTURE.md) | Architecture overview, dependency rule and layer responsibilities |
| [docs/ROADMAP.md](./docs/ROADMAP.md) | Product and engineering roadmap |

---

## Status

This portfolio is a work in progress and is being actively refined as part of my career positioning for international opportunities.
