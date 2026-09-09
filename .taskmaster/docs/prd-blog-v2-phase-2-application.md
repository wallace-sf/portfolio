# Blog v2 — Phase 2: Application (`packages/application/src/blog`)

> Status: proposed — pending review.
> Parent design: [2026-09-01-blog-v2-phase-0-design.md](../../docs/superpowers/specs/2026-09-01-blog-v2-phase-0-design.md) §4, §8.
> Depends on PRD 1 (Domain) — issue #1069, tag `blog-v2-phase-1`, all 7 tasks merged.
> Related: [04-APPLICATION-LAYER.md](../../docs/04-APPLICATION-LAYER.md), [06-VALIDATION.md](../../docs/06-VALIDATION.md).

## Goal

Make the blog's read model **status-aware**: `DRAFT`, `ARCHIVED` and
soft-deleted posts must never reach a reader — not in the listing, the
prev/next navigation, a direct slug hit, the sitemap, the RSS feed, or the OG
image. Plus the two DTO field additions that Phase 1 unblocked (`featured`,
`publishedAt` on the link DTO).

This is a thin slice. The bulk of it is one filter applied in three use cases.

## 1. Scope

**In scope**

- A `publishedOnly(posts)` helper in `packages/application/src/blog/use-cases/`,
  mirroring `newestFirst` — keeps only `status === BlogPostStatus.PUBLISHED`.
- `ListBlogPosts` — filter to published before ordering / mapping.
- `GetAdjacentBlogPosts` — filter to published before ordering, so adjacency
  only walks published posts.
- `GetBlogPostBySlug` — return `NotFoundError` when the found post is not
  `PUBLISHED` (a guessed draft slug 404s in production, and does not leak that a
  draft exists).
- `BlogPostSummaryDTO` gains `featured: boolean`.
- `BlogPostLinkDTO` gains `publishedAt: string` (needed for the dated href in
  PRD 4).
- `FileSystemBlogPostRepository` / `BlogPostMapper`: map file-backed posts as
  `status: PUBLISHED` so the live blog stays populated until PRD 3 replaces this
  repository (Q1 → option a). This is the one deliberate `packages/infra` touch.
- Tests: the three use-case suites, the new helper, the mapper.

**Out of scope**

- `IBlogPostRepository` changes — stays `findAll()` / `findBySlug()` (Phase 0:
  few posts + SSG, status filtering is a use-case concern).
- `author` on any DTO, `updatedAt?` on the detail DTO — both need the domain
  `author` field / a schema column, which are PRD 3.
- Prisma model, migration, RLS, `PrismaBlogPostRepository`, `seedBlogPosts`,
  removing `FileSystemBlogPostRepository`, swapping the container — PRD 3.
- New use cases (`ListBlogArchive`, `ListFeaturedBlogPosts`, `ListBlogPostsByTag`,
  `ListRelatedBlogPosts`, `GetBlogTags`) — named in Phase 0 §4, built in PRDs 4–5.
- Any `apps/site` route / component change — the routes already call these use
  cases, so the filtering propagates for free; a `featured` badge or dated href
  is PRD 4/5.

## 2. Design constraints

- **Dependency rule:** `application` depends only on `core`. The helper imports
  `BlogPostStatus` from `@repo/core/blog`.
- **Filtering is application, not domain.** The domain owns the *comparison* rule
  (`BlogPost.compareByPublication`); the application owns *which* posts a given
  audience sees and in *which direction* they are ordered — same split as
  `newestFirst` ([memory: ordering rule — domain vs presentation]).
- **`publishedOnly` and `newestFirst` compose,** order-independent (filter then
  sort, or sort then filter, same result). Apply `publishedOnly` first so the
  sort works on the smaller list.
- **No new error codes.** `GetBlogPostBySlug` reuses `NotFoundError`, already in
  its error union. `ListBlogPosts` / `GetAdjacentBlogPosts` keep their current
  `DomainError(FETCH_FAILED)` catch.
- **DTO additions are required fields,** not optional — every published post has
  a `featured` flag (defaulting to `false` in the domain) and a `publishedAt`.
- Test naming `should <expected behavior> when <context>`; behavior-focused
  (assert DTO shape / which slugs come back, not internals).

## 3. Requirements

### R1 — `publishedOnly` helper

`packages/application/src/blog/use-cases/published-only.ts`:

```ts
import { BlogPost, BlogPostStatus } from '@repo/core/blog';

/**
 * Keeps only posts a reader is allowed to see: status PUBLISHED. DRAFT and
 * ARCHIVED posts are editorial-only; soft-deleted posts never load. Returns a
 * new array. The domain owns "published" (BlogPostStatus); this only applies it
 * as the public-audience filter, the same way newestFirst fixes direction.
 */
export function publishedOnly(posts: BlogPost[]): BlogPost[] {
  return posts.filter((post) => post.status === BlogPostStatus.PUBLISHED);
}
```

Kept module-local (imported directly by the use cases), not added to
`use-cases/index.ts` — `newest-first.ts` is module-local today, match it.

### R2 — `ListBlogPosts`

In `execute()`, wrap the repository result:

```ts
const posts = newestFirst(publishedOnly(await this.repository.findAll()));
```

No other change. `toDTO` gains the `featured` line (R4).

### R3 — `GetAdjacentBlogPosts`

```ts
const ordered = newestFirst(publishedOnly(posts));
```

Adjacency is then computed over published posts only: a draft between two
published posts is invisible, and prev/next skips straight across it. If the
requested `slug` resolves to a non-published post, `ordered.findIndex(...)`
returns `-1` → the existing `left(new NotFoundError({ slug }))` path fires,
which is the desired behavior (same as R4's rule for the detail view).

### R4 — `GetBlogPostBySlug`

After the null check, before `toDTO`:

```ts
if (post.status !== BlogPostStatus.PUBLISHED) {
  return left(new NotFoundError({ slug: input.slug }));
}
```

`NotFoundError`, not a new "not published" error — a 404 is the correct public
response and it does not disclose that a draft with that slug exists.

### R5 — DTO changes

`BlogPostSummaryDTO`:

```ts
export type BlogPostSummaryDTO = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  featured: boolean; // ← new
  tags: string[];
  coverImage?: BlogPostImageDTO;
  thumbnailImage?: BlogPostImageDTO;
};
```

`BlogPostDetailDTO` inherits `featured` through the intersection — no change to
its own definition.

`BlogPostLinkDTO` (in `BlogPostNavigationDTO.ts`):

```ts
export type BlogPostLinkDTO = {
  slug: string;
  title: string;
  publishedAt: string; // ← new, for the dated href in PRD 4
};
```

Mapper updates:

- `ListBlogPosts.toDTO` / `GetBlogPostBySlug.toDTO`: add
  `featured: post.featured`.
- `GetAdjacentBlogPosts.toLink`: add `publishedAt: post.publishedAt.value`.

### R6 — file-backed posts default to `PUBLISHED`

`packages/infra/src/repositories/blog/BlogPostMapper.ts` — `toDomain` builds
`IBlogPostProps` with:

```ts
status: BlogPostStatus.PUBLISHED,
```

Comment: file-backed posts are all live; this repository (and this line) is
removed in PRD 3 when content moves to Postgres with an explicit `status`
column. Without this, `create()` defaults missing `status` to `DRAFT` and the
new `publishedOnly` filter would empty the live blog.

`featured` is left to the domain default (`false`) — the file-backed posts have
no "featured" concept and PRD 5 owns the featured band.

`MetaJsonSchema` is **not** extended with `status` — not worth it for a
repository being deleted next PRD.

### R7 — barrel / exports

`packages/application/src/blog/index.ts` and `dtos/index.ts` already re-export
the DTO types; the added fields need no export change. `publishedOnly` stays
module-local (R1) — no barrel change.

## 4. Acceptance criteria

- [ ] `publishedOnly(posts)` returns only `PUBLISHED` posts, as a new array.
- [ ] `ListBlogPosts` omits `DRAFT` / `ARCHIVED` posts from the result.
- [ ] `GetAdjacentBlogPosts` computes prev/next over published posts only; a
      non-published `slug` yields `NotFoundError`.
- [ ] `GetBlogPostBySlug` returns `NotFoundError` for a `DRAFT` / `ARCHIVED`
      post that exists.
- [ ] `GetBlogPostBySlug` / `ListBlogPosts` still return published posts
      unchanged in every other respect.
- [ ] `BlogPostSummaryDTO.featured` and `BlogPostLinkDTO.publishedAt` are
      populated from the domain object.
- [ ] `FileSystemBlogPostRepository` posts load as `PUBLISHED`; the existing
      `apps/site` blog listing / RSS / sitemap still show all 4 posts.
- [ ] `pnpm --filter @repo/application test` / `lint` / `types` green.
- [ ] `pnpm --filter @repo/infra test` green (mapper test updated).
- [ ] `pnpm --filter @repo/site build` succeeds and the blog is not empty.
- [ ] No change to `IBlogPostRepository`; no new error code; no new use case.

## 5. Files

- `packages/application/src/blog/use-cases/published-only.ts` ← create
- `packages/application/src/blog/use-cases/ListBlogPosts.ts` ← update
- `packages/application/src/blog/use-cases/GetAdjacentBlogPosts.ts` ← update
- `packages/application/src/blog/use-cases/GetBlogPostBySlug.ts` ← update
- `packages/application/src/blog/dtos/BlogPostSummaryDTO.ts` ← update
- `packages/application/src/blog/dtos/BlogPostNavigationDTO.ts` ← update
- `packages/infra/src/repositories/blog/BlogPostMapper.ts` ← update
- `packages/application/test/blog/published-only.test.ts` ← create
- `packages/application/test/blog/ListBlogPosts.test.ts` ← update
- `packages/application/test/blog/GetAdjacentBlogPosts.test.ts` ← update
- `packages/application/test/blog/GetBlogPostBySlug.test.ts` ← update
- `packages/infra/test/**/BlogPostMapper*.test.ts` ← update (assert `status === PUBLISHED`)

## 6. Test plan

**`publishedOnly`**

- keeps a PUBLISHED post; drops a DRAFT; drops an ARCHIVED
- empty input → empty output
- returns a new array (input not mutated)

**`ListBlogPosts`**

- returns only published posts when the repo mixes statuses
- `featured` is present on each DTO and reflects the domain value
- existing ordering / locale / empty-list tests still pass

**`GetAdjacentBlogPosts`**

- prev/next skip a DRAFT sitting between two PUBLISHED posts
- `publishedAt` present on each link DTO
- requesting an existing DRAFT slug → `NotFoundError`
- existing boundary tests (first/last post) still pass

**`GetBlogPostBySlug`**

- existing DRAFT slug → `NotFoundError`
- existing ARCHIVED slug → `NotFoundError`
- PUBLISHED slug → `Right` with the detail DTO (incl. `featured`)
- unknown slug → `NotFoundError` (unchanged)
- invalid slug → `ValidationError` (unchanged)

**`BlogPostMapper`**

- a mapped file-backed post has `status === PUBLISHED`

## 7. Dependencies

- PRD 1 (Domain) — merged. `BlogPost.status`, `BlogPost.featured`,
  `BlogPostStatus` are in `@repo/core/blog`.
- No blocking dependency on #1021 (that gates PRD 3).

## 8. Open questions (resolved during scoping)

- **Q1 — file-backed blog goes empty under the filter.** Resolved: option (a) —
  `BlogPostMapper` maps file-backed posts as `PUBLISHED` (R6). One infra line,
  removed in PRD 3.
- **Q2 — DTO field timing.** Resolved: add `featured` + `publishedAt` now (R5);
  `author` / `updatedAt` wait for PRD 3.
- **Q3 — non-published detail response.** Resolved: `NotFoundError` (R4).
