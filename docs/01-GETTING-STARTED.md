# 01 — Getting Started

> Prerequisites, installation, local development, and the Issue → Branch → PR workflow.

---

## Prerequisites

- **Node.js** ≥ 18
- **pnpm** ≥ 8 (`npm install -g pnpm`)
- **Git**
- A Supabase project (for database-backed features)

---

## Installation

```bash
git clone https://github.com/wallace-sf/portfolio.git
cd portfolio
pnpm install
```

---

## Environment Variables

Copy the example env file and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Key variables:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
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
