# 01 — Getting Started

> Prerequisites, installation, local development, and the Issue → Branch → PR workflow.

---

## Prerequisites

- **Node.js** ≥ 22
- **pnpm** ≥ 8 (`npm install -g pnpm`)
- **Git**
- A [Supabase](https://supabase.com) project (free tier is sufficient)

---

## Installation

```bash
git clone https://github.com/wallace-sf/portfolio.git
cd portfolio
pnpm install
```

---

## Environment Variables

The project uses two gitignored env files — one for the dev server, one for tests.
Neither is committed to the repository.

### Strategy

| File | Loaded by | Purpose |
|------|-----------|---------|
| `.env.local` (root) | Next.js (`next dev`) | Run the app locally |
| `packages/infra/.env.test.local` | Vitest (`mode=test`) | Integration tests against local Supabase |

Both files use the **local Supabase stack** (`pnpm db:start`). The cloud Supabase
project (`.env`) is reserved for production and staging.

### Setup

**1. Start the local Supabase stack**

```bash
pnpm db:start
# Starts Postgres (port 54322) and the Supabase API (port 54321) via Docker.
# Run once; it persists across reboots until `pnpm db:stop`.
```

**2. Create the dev env file**

```bash
cp .env.example .env.local
```

The local Supabase values are pre-filled — no changes needed for DB and auth.
Fill in `RESEND_API_KEY` only if you need to test email delivery end-to-end.

**3. Create the test env file**

```bash
cp packages/infra/.env.example packages/infra/.env.test.local 2>/dev/null || \
cp .env.example packages/infra/.env.test.local
```

The file at `packages/infra/.env.test.local` is identical to `.env.local` for the
local stack. Vitest loads it automatically when running `pnpm test:infra`.

**4. Apply migrations**

```bash
pnpm db:reset   # fresh schema from all migrations (use on first setup)
# or
pnpm --filter @repo/infra db:migrate   # incremental
```

---

## Common Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all packages and apps |
| `pnpm test` | Run all test suites via Turborepo |
| `pnpm lint` | Lint all packages |
| `pnpm typecheck` | TypeScript check across all packages |
| `pnpm format` | Prettier format |
| `pnpm --filter @repo/infra db:migrate` | Apply pending migrations |
| `pnpm --filter @repo/infra db:studio` | Open Prisma Studio (visual DB browser) |

Run a single package:

```bash
pnpm --filter @repo/core test
pnpm --filter web dev
```

---

## Monorepo Build Order

```text
packages/core → packages/application → packages/infra → apps/web
```

Turborepo handles this automatically via `dependsOn` in `turbo.json`.

---

## Development Workflow — Issue → Branch → PR

Follow this sequence for every piece of work, without exception:

1. **Confirm the task exists in Task Master** under the correct Sprint tag (`task-master tags use sprint-X`).
2. **Verify the work hasn't already been done** — check the issue state, merged PRs, and existing branches before writing any code.
3. **Set Task Master status to In Progress**: `task-master set-status --id=<id> --status=in-progress`
4. **Move the GitHub issue to "In Progress"** in all linked Project boards.
5. **Create the branch from the issue**: `gh issue develop <issue-number> --checkout`
6. **Implement** — code, tests, commits.
7. **Open PR against `develop`**: `gh pr create --base develop`
8. **Set Task Master status to Done**: `task-master set-status --id=<id> --status=done`

**Rules:**
- PRs always target `develop`, never `master` or `staging`
- Task Master + GitHub Projects statuses must always reflect reality
- Lock-file rebase conflicts: `git checkout --theirs pnpm-lock.yaml && pnpm install`

---

## Task Master Integration

Task Master AI manages sprint tasks. See [`.taskmaster/CLAUDE.md`](../.taskmaster/CLAUDE.md) for the full command reference.

Key commands:

```bash
task-master next               # Next available task
task-master show <id>          # Task details
task-master set-status --id=<id> --status=in-progress
task-master set-status --id=<id> --status=done
```
