# PRD: Project Importance Ordering (`weight`)

## Context

Today, project ordering in the portfolio is driven purely by `periodStart desc`
(`PrismaProjectRepository.findAll/findPublished/findFeatured`), and the set of
featured projects is selected/ordered via `Profile.featuredProjectSlugs`
(a string array capped at 6 entries by the `TOO_MANY_FEATURED_PROJECTS`
invariant in `packages/core/src/portfolio/entities/profile/model/Profile.ts`).

This means the most recent project is always shown first, regardless of how
professionally important it actually is for the owner's career goals. There is
also a duplicated source of truth for "what order matters": the project's own
recency vs. the manually maintained `featuredProjectSlugs` array on `Profile`.

## Goal

Introduce a `weight: number` field on the `Project` entity to express relative
professional importance, independent of project date. Use it to:

1. Order the general published-projects listing.
2. Order (and limit) the featured-projects section, replacing
   `Profile.featuredProjectSlugs` entirely.

Higher `weight` = more important = sorted first. Ties broken by
`periodStart desc` (existing behavior).

## Scope

### Domain (`packages/core`)

- `IProjectProps` gains `weight: number`.
- `Project` gains `public readonly weight: number`, validated in `create()`
  via `Validator.of(props.weight).refine(...)` (integer, `>= 0`) per the
  "primitive + Validator" convention (not rich/reused enough for a VO).
  Default `0` when omitted by callers/seeders.
- `Profile` loses `featuredProjectSlugs` entirely:
  - Remove from `IProfileProps`.
  - Remove the `TOO_MANY_FEATURED_PROJECTS` invariant and
    `MAX_FEATURED_PROJECTS` constant.
  - Remove the `Slug[]` mapping logic in `Profile.create()`.

### Application (`packages/application`)

- `GetFeaturedProjects` calls `projectRepository.findFeatured(limit = 6)`
  directly — no longer reads `Profile` to know which slugs to fetch.
- `GetPublishedProjects` (and any other listing use case) sorts by
  `weight desc, periodStart desc`.
- `ProfileDTO` drops `featuredProjectSlugs`.
- `GetProfile` stops mapping that field.

### Infra (`packages/infra`)

- `schema.prisma`:
  - `Project.weight Int @default(0)` + `@@index([weight])`.
  - Remove `Profile.featuredProjectSlugs String[]`.
  - New Prisma migration reflecting both changes. Existing projects get
    `weight = 0` (tie, ordered by date as before — no regression).
- `PrismaProjectRepository`:
  - `findFeatured(limit: number)`: `where: { featured: true, status: PUBLISHED, deletedAt: null }`,
    `orderBy: [{ weight: 'desc' }, { periodStart: 'desc' }]`, `take: limit`.
  - `findAll` / `findPublished`: same composite `orderBy`.
- `ProjectMapper`: map `weight` both directions (domain ↔ Prisma row).
- `ProfileMapper`: remove `featuredProjectSlugs` mapping.
- `seeders.ts`: add an explicit `weight` value per seeded project (reflecting
  desired professional priority); remove `featuredProjectSlugs` from the
  `Profile` seed data.

### Tests

- Unit tests for `weight` validation in `Project.create` (rejects negative /
  non-integer, accepts `0` and positive integers, defaults to `0`).
- Update/remove existing tests covering `Profile.featuredProjectSlugs` and
  `TOO_MANY_FEATURED_PROJECTS`.
- Cover the new composite ordering (`weight desc, periodStart desc`) wherever
  repository ordering is exercised today (existing integration tests for
  `PrismaProjectRepository`, if present).

## Out of scope

- Any UI/admin surface for editing `weight` (out of scope until `apps/admin`
  exists, per repo dev order — core/infra first).
- Changing the `featured: boolean` flag's semantics — it still gates inclusion
  in the featured set; `weight` only affects ordering/ranking within that set
  and within the general listing.

## Database environment

Migrations and seed application for this work must run against the
**`portfolio-dev`** Supabase project (development database), not production.
Verify `DATABASE_URL` / `.env` points at `portfolio-dev` before running
`prisma migrate dev` or the seeders.

## Acceptance criteria

- `Project.weight` exists, is validated, defaults to `0`.
- `Profile.featuredProjectSlugs` and its invariant are fully removed from
  domain, application, infra, and seeders.
- Published-projects listing and featured-projects section both order by
  `weight desc, periodStart desc`.
- Featured-projects section is capped via a `limit` parameter (default 6)
  instead of a domain invariant.
- All new/changed production code has accompanying tests in the same PR.
