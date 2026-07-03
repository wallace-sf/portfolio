# Plan: Free, No-GitHub-Actions Deploy Pipeline

## Goal

A decent, zero-cost deploy pipeline built entirely on Vercel's native
capabilities — no GitHub Actions. Motivated by a gap found while
promoting the `Project.weight` feature (#900/#902): merging `develop`
→ `master` alone doesn't apply pending Prisma migrations, so the app
can deploy against a database schema it no longer matches.

## Current state

- `apps/site/vercel.json` `buildCommand` runs
  `pnpm --filter @repo/infra db:migrate:deploy && turbo run build --filter=site`
  — this applies pending migrations before every build.
- **Gap:** this runs unconditionally for *every* deployment, including
  Preview deployments (one per PR/branch push). That's wrong: multiple
  open PRs building concurrently would each try to run
  `prisma migrate deploy` against whatever database
  `DATABASE_URL`/`DIRECT_URL` resolves to for that environment. Needs
  to be scoped to Production only.

## Plan

### 1. Scope the migration step to Production builds only

Guard the migrate step with Vercel's built-in `$VERCEL_ENV` (available
in every build, no config needed):

```json
{
  "buildCommand": "cd ../.. && [ \"$VERCEL_ENV\" = \"production\" ] && pnpm --filter @repo/infra db:migrate:deploy; turbo run build --filter=site"
}
```

Preview builds skip the migration and just build against whatever
schema state the target database (`portfolio-dev`) is already in.

### 2. Confirm environment variable scoping in the Vercel dashboard

Verify (manually, in the Vercel project settings — not scriptable from
here without a linked project):
- **Production** environment variables → `daxmkexweadrkobbnuxj` (prod
  Supabase project).
- **Preview** environment variables → `wozibwvcepmelpstznic`
  (`portfolio-dev`), so preview builds never touch production data.

This is the real safety net — the `$VERCEL_ENV` guard in step 1 is
defense in depth on top of it, not a replacement for it.

### 3. Use Vercel's native rollback instead of a custom release process

If a Production build's migration or app code fails, use Vercel's
built-in **Instant Rollback** (free on all plans) to repoint traffic at
the last good deployment — no custom tooling needed.

### 4. Keep `develop` → `master` PRs as the promotion gate

No change needed here — the existing pattern (open a PR from `develop`
to `master`, review, merge) stays the manual approval step. What
changes is that merging now safely triggers migration + build
together, atomically, instead of requiring a separate manual migration
command against production.

### Explicitly out of scope

- **GitHub Actions**: not used anywhere in this pipeline — Vercel's
  own build step replaces the need for a separate CI runner for
  deploy-time concerns. (`.github/workflows/ci.yml` remains as a
  manual `workflow_dispatch` check, unrelated to deployment.)
- **Seed automation**: `pnpm --filter @repo/infra db:seed` stays
  manual, run by hand when content changes — seeding real content
  automatically on every deploy is a separate concern from schema
  migration and isn't part of this pipeline.
