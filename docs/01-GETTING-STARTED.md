# 01 — Getting Started

> Prerequisites, installation, local development, and the Issue → Branch → PR workflow.

---

## Prerequisites

- **Node.js** ≥ 22
- **pnpm** ≥ 8 (`npm install -g pnpm`)
- **Git**
- **Docker** (Docker Engine or Docker Desktop) — required to run the local database
- **Supabase CLI** ≥ 2 — required for `pnpm db:*` commands

Install the Supabase CLI:

```bash
# macOS
brew install supabase/tap/supabase

# Linux (manual binary)
curl -sSL https://github.com/supabase/cli/releases/latest/download/supabase_linux_amd64.tar.gz \
  | tar -xz && sudo mv supabase /usr/local/bin/

# npm / pnpm (any OS)
npm install -g supabase
```

> **Linux + Docker Desktop only:** the Supabase CLI does not respect the active Docker
> context and connects directly to `/var/run/docker.sock`. If `pnpm db:start` fails,
> run once or add to your shell profile:
>
> ```bash
> export DOCKER_HOST=unix:///var/run/docker.sock
> ```

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

### Local database (recommended for development)

Start the local Supabase stack and use the local URLs:

```bash
pnpm db:start   # starts Docker containers
pnpm db:status  # shows URLs and service status
```

Set in `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"
DIRECT_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"
```

Then apply migrations:

```bash
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres" \
  pnpm --filter @repo/infra db:migrate
```

### Cloud database (Supabase dashboard)

Obtain the connection strings from **Project Settings → Database** and set them in `.env`.
See `.env.example` for the expected format.

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
| `pnpm db:start` | Start local Supabase stack (Docker) |
| `pnpm db:stop` | Stop local Supabase stack |
| `pnpm db:reset` | Reset local DB and reapply migrations |
| `pnpm db:status` | Show local service URLs and status |
| `pnpm db:studio` | Open Supabase Studio (visual DB browser) |

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
