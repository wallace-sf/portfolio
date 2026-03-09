# Wallace Ferreira — Portfolio

> Personal portfolio built with clean architecture, DDD, and modern web technologies. Designed to showcase professional experience and projects to an international audience.

🌐 **Live:** [portfolio-web-kohl-two.vercel.app](https://portfolio-web-kohl-two.vercel.app)

---

## Overview

This is a monorepo containing the portfolio web application and its supporting packages. The project intentionally applies **Domain-Driven Design (DDD)** and **Clean Architecture** principles — not just as buzzwords, but as a way to keep the codebase maintainable, testable, and extensible as new features (like a blog) are added over time.

---

## Tech Stack

| Layer         | Technology                                        |
| ------------- | ------------------------------------------------- |
| Monorepo      | Turborepo + pnpm workspaces                       |
| Frontend      | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Domain        | TypeScript (zero external dependencies)           |
| Database      | Supabase (PostgreSQL) + Prisma ORM                |
| Email         | Resend                                            |
| i18n          | next-intl (pt-BR, en-US, es)                      |
| Forms         | React Hook Form + Zod                             |
| Data fetching | TanStack Query                                    |
| Testing       | Vitest + Testing Library + Playwright             |
| CI/CD         | GitHub Actions + Vercel                           |

---

## Monorepo Structure

```
apps/
  web/          → Public portfolio (Next.js 14)
  blog/         → Blog — post-MVP

packages/
  core/         → Domain layer: entities, value objects, repository interfaces
  application/  → Use cases, DTOs, service ports
  infra/        → Concrete repositories (Prisma + Supabase), email service
  ui/           → Shared React component library
  eslint-config/
  typescript-config/
```

The dependency rule flows inward only:

```
core ← application ← infra ← web
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for a full explanation of each layer and the decisions behind them.

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- A [Supabase](https://supabase.com) project

### Installation

```bash
# Clone the repository
git clone https://github.com/wallace-sf/portfolio.git
cd portfolio

# Install dependencies
pnpm install
```

### Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

| Variable         | Description                                        |
| ---------------- | -------------------------------------------------- |
| `DATABASE_URL`   | Supabase PostgreSQL connection string (pooled)     |
| `DIRECT_URL`     | Supabase direct connection string (for migrations) |
| `RESEND_API_KEY` | Resend API key for contact form emails             |

### Database Setup

```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed initial data
pnpm db:seed
```

### Running Locally

```bash
# Run all apps and packages in development mode
pnpm dev

# Run only the web app
pnpm dev --filter=web
```

---

## Available Scripts

| Script             | Description                         |
| ------------------ | ----------------------------------- |
| `pnpm dev`         | Start all apps in development mode  |
| `pnpm build`       | Build all apps and packages         |
| `pnpm lint`        | Lint all packages                   |
| `pnpm typecheck`   | Type-check all packages             |
| `pnpm test`        | Run all tests                       |
| `pnpm db:generate` | Generate Prisma client              |
| `pnpm db:migrate`  | Run database migrations             |
| `pnpm db:seed`     | Seed the database with initial data |

---

## Project Features (MVP)

- 🌍 Multilingual support (pt-BR, en-US, es)
- 🌙 Light / Dark / System theme
- 💼 Professional experience with skill details per role
- 🚀 Projects showcase with rich Markdown content
- 📬 Contact form with email notification
- 📄 Resume link
- 🔗 GitHub and LinkedIn links

## Roadmap

- [ ] **V1** — Blog (posts, tags, categories)
- [ ] **V2** — Admin panel for content management
- [ ] **V3** — SEO improvements, OpenGraph, sitemap

---

## Architecture

This project applies Clean Architecture and Domain-Driven Design. Read [ARCHITECTURE.md](./ARCHITECTURE.md) for the full architectural overview, bounded contexts, and layer responsibilities.

---

## License

MIT
