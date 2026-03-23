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

```bash
cp .env.example .env
```

1. Create a project at [supabase.com](https://supabase.com) (or use an existing one)
2. Go to **Project Settings → Database → Connection string**
3. Copy the **Transaction** string to `DATABASE_URL` and the **Session** string to `DIRECT_URL`

Then apply migrations:

```bash
pnpm --filter @repo/infra db:migrate
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
