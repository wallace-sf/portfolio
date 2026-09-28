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

There is **no env file at the repo root**. Each workspace loads its own files
from its own directory. There are two Supabase projects, **dev** and **prod**.
All env files are gitignored; each workspace has a committed `.env.example`
listing its keys.

| File | Loaded by | Supabase project |
|------|-----------|------------------|
| `apps/site/.env.local` | `next dev` **and** `next build` / `next start` (including the lefthook `pre-push` build) | dev |
| `packages/infra/.env` | Prisma CLI (`db:migrate`, `db:studio`, …) and `tsx --env-file=.env` (`db:seed`, `db:backup`, `send:email:manual`) | **dev** |
| `packages/infra/.env.production.local` | Nothing automatically; see [Running an infra script against production](#running-an-infra-script-against-production) | prod |
| `packages/infra/.env.test.local` | Vitest (`mode=test`) — integration tests | dev |

> **`packages/infra/.env` must always point at the dev project.** Every `db:*`
> script reads it, and `db:migrate` runs `prisma migrate dev`, which can reset
> the database. `DB_SAFE_REMOTE_REF` must be the **dev** project ref (the
> `<ref>` in `https://<ref>.supabase.co`). With the prod ref there, the
> `assert-safe-db` guard lets destructive operations through against production.

> **Don't create `apps/site/.env.production.local`.** `next build` always runs
> in production mode and gives that file priority over `.env.local`. Every local
> build, including the one `git push` triggers, would then need production
> credentials. Production values for the site live only in Vercel.

Deployed environments don't read these files. On Vercel, set variables in the
project settings. Production migrations already run on every production deploy
(`apps/site/vercel.json` → `db:migrate:deploy`).

### Setup

**1. Create the env files**

```bash
cp apps/site/.env.example apps/site/.env.local
cp packages/infra/.env.example packages/infra/.env
cp packages/infra/.env.example packages/infra/.env.test.local
```

Fill them with credentials from the **Supabase dev project**
(supabase.com → Project Settings → Database and API). Create
`packages/infra/.env.production.local` only if you need to run an infra script
against prod from your machine.

**2. Build the internal packages**

`apps/site` imports compiled output (`dist/`) from internal packages such as
`@repo/config`. On a fresh clone, `next dev` fails with
`Cannot find module .../@repo/config/dist/index.mjs` until they are built:

```bash
pnpm exec turbo run build --filter='site^...'
```

**3. Apply migrations**

```bash
pnpm --filter @repo/infra db:migrate
```

### Running an infra script against production

There are no `:prod` script variants. Export the production file into the shell
before running the normal script. Values that are already set in the
environment take precedence over `.env`, both for Prisma and for
`tsx --env-file`:

```bash
cd packages/infra
set -a; . ./.env.production.local; set +a; pnpm db:backup
```

`db:migrate` stays blocked in this mode because the production `DIRECT_URL`
doesn't match `DB_SAFE_REMOTE_REF`. Use `db:migrate:deploy` for production.

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
pnpm --filter site dev
```

---

## Monorepo Build Order

```text
packages/core → packages/application → packages/infra → apps/site
```

Turborepo handles this automatically via `dependsOn` in `turbo.json`.

---

## Development Workflow — Issue → Branch → PR

Follow this sequence for every piece of work, without exception:

0. **If no GitHub issue exists yet**, create one with `gh issue create` following `.github/ISSUE_TEMPLATE/task.md` (planned work) or `.github/ISSUE_TEMPLATE/bug.md` (defect found in existing code) — don't free-form the body. Apply labels from `gh label list`.
1. **Confirm the task exists in Task Master** under the correct Sprint tag (`task-master tags use sprint-X`).
2. **Verify the work hasn't already been done** — check the issue state, merged PRs, and existing branches before writing any code.
3. **Set Task Master status to In Progress**: `task-master set-status --id=<id> --status=in-progress`
4. **Move the GitHub issue to "In Progress"** in all linked Project boards.
5. **Create the branch from the issue**: `gh issue develop <issue-number> --base develop --checkout` — always pass `--base develop` explicitly; without it, `gh issue develop` bases the branch on the repo's default branch (`master`), not `develop`
6. **Implement** — code, tests, commits.
7. **Open PR against `develop`**: `gh pr create --base develop`, following `.github/PULL_REQUEST_TEMPLATE.md` (`## Summary` + `## Test plan` — commands run plus manual/browser verification when there's a UI flow involved + `Refs #N`)
8. **Set Task Master status to Done**: `task-master set-status --id=<id> --status=done`
9. **Commit Task Master status to git**: create branch `chore/update-task-<N>-status-done` from `develop`, commit `.taskmaster/tasks/tasks.json`, open PR against `develop`

**Rules:**
- PRs always target `develop`, never `master` or `staging`
- Task Master + GitHub Projects statuses must always reflect reality
- Step 9 is mandatory — `set-status` only updates the local `tasks.json`; without committing it, the change is lost on branch switches or rebases
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
