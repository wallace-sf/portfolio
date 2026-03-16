# 00 — Introduction

> Portfolio monorepo — what it is, why it exists, and how it is built.

---

## What This Project Is

A **personal portfolio** for a full-stack software engineer — built to showcase projects, professional experience, skills, and values to recruiters, potential clients, and the community.

It is also a **technical reference** for applying Clean Architecture, Domain-Driven Design, and modern TypeScript in a real-world Next.js monorepo.

---

## Goals

- Present portfolio content (projects, experience, skills, profile) in multiple languages
- Demonstrate architectural discipline: DDD, Clean Architecture, Either pattern, TDD
- Serve as a living example of the engineering practices the owner applies professionally

---

## Tech Stack

| Concern | Technology |
|---------|------------|
| Frontend | Next.js 14+ (App Router), React, Tailwind CSS |
| Domain layer | TypeScript, DDD, Either pattern, Value Objects |
| Data fetching | TanStack Query (client), Server Components (server) |
| Forms | React Hook Form + Zod |
| i18n | next-intl |
| Database | Supabase (Postgres + Auth + Realtime) |
| ORM / query | Prisma |
| Monorepo | Turborepo + pnpm workspaces |
| Testing | Vitest (domain), Jest + Testing Library (web), Playwright (E2E) |
| CI/CD | GitHub Actions + Vercel |

---

## Monorepo Structure

```text
apps/
  web/          → Public portfolio (Next.js App Router)
  blog/         → Blog (future, post-MVP)
  api/          → Backend API routes (future)

packages/
  core/         → Domain + Shared Kernel (entities, VOs, repositories)
  application/  → Use Cases, DTOs, ports
  infra/        → Concrete repositories (Prisma + Supabase)
  ui/           → Shared design system (React components)
  markdown/     → MDX / Markdown parser and renderer
  i18n/         → Shared translations
  utils/        → Shared utilities (Validator, formatters)
  eslint-config/
  typescript-config/
```

---

## Where to Go Next

- **[01-GETTING-STARTED](./01-GETTING-STARTED.md)** — Set up the project locally
- **[02-ARCHITECTURE](./02-ARCHITECTURE.md)** — Understand the layer model
- **[docs/INDEX.md](./INDEX.md)** — Full documentation map
