# Production Deploy & Ordering Strategy — Notes

Context captured from the `Project.weight` importance-ordering feature
(PR #902, issue #900). Documents the deploy-pipeline gap found while
promoting that feature to production, and the theory behind the
`weight` field's reordering design, for future reference.

## 1. Schema migrations are now automated on deploy

**Problem observed:** merging `develop` → `master` alone does not apply
Prisma migrations to the production database. The
`add_project_weight_remove_profile_featured_slugs` migration had been
applied to `portfolio-dev` (task 3) but was still pending on production
when promotion was attempted — merging without migrating would have
broken every `Project`/`Profile` query in prod (missing `weight`
column, dropped `featuredProjectSlugs` still expected by old rows).

**Fix applied:** `apps/site/vercel.json` `buildCommand` now runs
`pnpm --filter @repo/infra db:migrate:deploy` (`prisma migrate deploy`)
before `turbo run build --filter=site`. Since Vercel already injects
`DATABASE_URL`/`DIRECT_URL` for the build (required for SSG data
fetching via Server Components at build time), no extra env
configuration was needed. This makes "forgot to migrate prod" an
impossible failure mode — the build won't produce a deployable output
without the migration succeeding first.

**Industry pattern this follows:** running `prisma migrate deploy` (or
equivalent) as part of the build/release step, not as a manual
terminal command. Bigger orgs gate this behind a required-approval CI
job for production; for this project's scale, wiring it into the
Vercel build command is the pragmatic equivalent.

## 2. Seeds stay manual and out of the deploy pipeline — on purpose

Unlike schema migrations, `pnpm --filter @repo/infra db:seed` is **not**
wired into the build/deploy pipeline. This is deliberate:

- Seeds mix structural bootstrapping (safe to automate) with real
  content mutation (risky to automate) — seeding is meant to
  initialize an empty database (dev, preview, staging), not to
  repeatedly overwrite live production content.
- `seeders.ts` uses `upsert` on fixed IDs, so re-running it is
  currently idempotent/safe for this solo-maintained portfolio, but
  that safety property shouldn't be relied on as a permanent excuse to
  automate it.
- Once `apps/admin` exists (per the repo's documented dev order:
  core → infra → API → frontend, admin post-MVP), content edits
  should flow through the admin UI/API instead of re-running seeders
  against production. At that point `seeders.ts` should be treated as
  dev/preview-only tooling.

**Action for later:** when `apps/admin` ships, revisit whether
`seedProjects`/`seedProfile` should still be callable against
production at all, or gated behind an explicit `--allow-prod` flag
(mirroring the existing `scripts/assert-safe-db.mjs` guard already used
for `db:migrate` in development).

## 3. `Project.weight` reordering — the underlying theory

The `weight: Int` field (gap-of-10 seeding: 40/50/60/70/80/90) is a
practical instance of a well-known problem, in case this needs to
scale into a drag-and-drop reordering UI later (likely in `apps/admin`):

- **Field:** Computer Science — Data Structures & Algorithms. Formally
  known as the **"order maintenance problem"** (a.k.a. **"list
  labeling problem"**), seminal paper: Dietz & Sleator (1987), *"Two
  Algorithms for Maintaining Order in a List."*
- **Practical/industry term:** **"fractional indexing"** — see Figma
  Engineering's *"Realtime Editing of Ordered Sequences"* post. Also
  known as **LexoRank** (Atlassian's specific string-based
  implementation, used in Jira/Trello-style drag-and-drop).
- **Reordering algorithm (works for both adjacent and distant moves):**
  1. Determine the item's new previous/next neighbors.
  2. `new_weight = (prev_weight + next_weight) / 2`.
  3. New first item: `prev_of_first + gap`. New last item:
     `last - gap` (floor at 0, or rebalance).
  4. If neighbors are consecutive integers (no room for a midpoint),
     trigger a full rebalance (renumber everything with fresh gaps).
  5. Swapping two direct neighbors is a special case of the same rule
     (each is the other's only neighbor) — just swap their two values.
- **Why explicit per-record `weight` beats a positional array** (the
  old `Profile.featuredProjectSlugs: string[]` approach): moving a
  record only ever requires updating that one row — O(1) regardless of
  distance moved. A positional index array requires shifting every
  entry between the old and new position — O(n).
- **If multi-user/real-time reordering is ever needed:** look into
  CRDTs for lists, specifically **RGA (Replicated Growable Array)** —
  out of scope for this project today, only relevant for
  collaborative/concurrent editing scenarios.
