# Blog v2 — Phase 5B: Discovery (`apps/site`, `packages/application`)

> Status: proposed — pending review.
> Parent design: [2026-09-01-blog-v2-phase-0-design.md](../../docs/superpowers/specs/2026-09-01-blog-v2-phase-0-design.md) §4, §5, §8.
> Feature source: [BLOG-V2-FEATURE-CURATION.md](../../docs/BLOG-V2-FEATURE-CURATION.md) § "Adopt in Blog v2 core".
> Depends on **PRD 5A** (post page): tag `blog-v2-phase-5a`, all merged (#1181–#1192)
> and released (#1193).
> Tracked by #1194.
> Related: [02-ARCHITECTURE.md](../../docs/02-ARCHITECTURE.md), [07-I18N.md](../../docs/07-I18N.md), [08-TESTING.md](../../docs/08-TESTING.md).

## Goal

Let a reader move _across_ posts, not only through one. From any post they can
open a tag and see every post that shares it, and the post itself suggests what
to read next. The listing stops being a flat list: it highlights featured posts,
shows the trending tags with their counts, and links to the archive by year. The
older/newer links at the end of a post show where they lead.

This is the second of three Phase 5 PRDs (5A post page, 5B discovery, 5C search;
see PRD 5A §8).

## 1. Scope

**In scope**

- **Tag pages**: an index of every tag with its post count (`/blog/tags`) and one
  listing page per tag (`/blog/tags/{tag}`), with metadata, breadcrumbs and
  `BreadcrumbList` JSON-LD, in the sitemap.
- **Tag links**: tags on the post header link to their tag page.
- **Trending tags** on the listing: the most-used tags, with count badges, and a
  link to the full tag index.
- **Count badges**: the total number of posts on the listing header and on
  each tag page header, plus a count per tag.
- **Featured band** on the listing: the posts with `featured = true`, above the
  full list.
- **Archive navigation** on the listing: one link per year with its post count,
  to the existing `/blog/{year}` pages.
- **Related posts** ("Further reading") at the end of a post, ranked by shared
  tags.
- **Prev/next polish**: direction arrows, the target post's date, `rel` links,
  and a layout that doesn't depend on invisible spacer elements.
- The four use cases named in Phase 0 §4: `GetBlogTags`, `ListBlogPostsByTag`,
  `ListRelatedBlogPosts`, `ListFeaturedBlogPosts`.

**Out of scope**

- Search (**PRD 5C**).
- **Share links** (X, LinkedIn, copy link). They are in the curation's "Adopt"
  list but in none of the three Phase 5 PRDs. They belong to the post page, so
  they are proposed as a small follow-up issue, not part of discovery (§8).
- Per-tag metadata (title, description, localized names). Phase 0 decision 3
  keeps tags as a plain `String[]` with no `Tag` table. Tags render as their
  kebab-case value, as they do today.
- Tag links inside `PostCard`. The whole card is a link, and an `<a>` can't
  nest another `<a>` (§2).
- Pagination. With 4 posts, every listing fits on one page. Revisit in 5C or
  when the post count grows.
- Any change to `packages/core`, `packages/infra`, the Prisma schema or the
  seed. `featured` and `tags` already exist on `BlogPost` (PRD 1) and in the
  seed (2 featured posts, 8 distinct tags).

## 2. Design constraints

- **Dependency rule**: the four use cases live in `packages/application`, depend
  only on `@repo/core`, and reuse `publishedOnly`, `newestFirst` and
  `toBlogPostSummaryDTO`, so every list is published-only and ordered the same
  way. Pages are Server Components that call use cases. No new client
  component is needed. No `'use client'` file imports `@repo/application`.
- **Repository port unchanged.** `IBlogPostRepository` stays
  `findAll()` / `findBySlug()`. Few posts and SSG mean filtering and counting
  happen in the use cases (Phase 0 §4).
- **Tags are not localized.** The same tag set and URLs exist in every locale.
  Tag pages are generated per locale like every other blog route. Counts come
  from published posts only.
- **Routes fit the existing tree.** `tags/` is a static segment next to the
  dynamic `[year]/`. Next resolves static segments first, as it already does for
  `rss.xml`, so `/blog/tags` never matches `[year]`. The `[year]` page keeps
  `dynamicParams = false`, and the tag route sets it too: an unknown tag 404s.
- **One URL source.** `features/blog/paths.ts` gains `blogTagsPath()` and
  `blogTagPath(tag)`. Every link, the sitemap, the breadcrumbs and the JSON-LD
  use them.
- **One breadcrumb builder.** `buildBlogBreadcrumbs` gains a tag target. It
  keeps rendering the visible trail and the JSON-LD from the same steps.
- **No nested links.** `PostCard` is a single `Link` wrapping the whole card.
  Its tag badges stay plain text. Tag links appear where a tag stands alone:
  the post header, trending tags, the tag index.
- **Files under 200 lines.** The listing page gains three sections, so each one
  is its own component (`FeaturedPosts`, `TrendingTags`, `ArchiveNav`). Test
  naming is `should <expected behavior> when <context>`. Page tests mock only
  real boundaries (`getServerContainer`, `next/image`, `next-intl/server`,
  `next/navigation`).

## 3. Requirements

### R1 — `GetBlogTags` (application)

```ts
export type BlogTagDTO = { tag: string; count: number };

/** Every tag used by a published post, with how many published posts use it. */
class GetBlogTags extends UseCase<{ locale: Locale }, BlogTagDTO[]>;
```

- Counts are over **published** posts. A tag only on drafts doesn't appear.
- Sorted by `count` descending, then `tag` ascending, so the order is stable.
  "Trending" is this order (the curation's "simple count").
- `locale` is accepted for symmetry with the other blog use cases and ignored,
  because tags aren't localized.
- Repository failure → `left(DomainError(FETCH_FAILED))`, as in `ListBlogPosts`.

### R2 — `ListBlogPostsByTag` (application)

```ts
class ListBlogPostsByTag extends UseCase<
  { tag: string; locale: Locale },
  BlogPostSummaryDTO[],
  ValidationError | DomainError
>;
```

- Validates `tag` with the `Tag` VO. Invalid → `left(ValidationError)`.
- Returns the published posts carrying the tag, newest first. A valid tag with
  no posts → `right([])` (the page turns that into `notFound()`).

### R3 — `ListRelatedBlogPosts` (application)

```ts
class ListRelatedBlogPosts extends UseCase<
  { slug: string; locale: Locale; limit?: number },
  BlogPostSummaryDTO[],
  NotFoundError | ValidationError | DomainError
>;
```

- Candidates are the other published posts sharing **≥ 1** tag with the post.
- Ranked by the number of shared tags (descending), then newest first. At most
  `limit` posts; the default is `3`, a named constant.
- No shared tags → `right([])`. The section is not rendered. There is no
  "latest posts" fallback, because prev/next already covers chronology.
- Unknown or unpublished slug → `left(NotFoundError)`. Invalid slug →
  `left(ValidationError)`.
- The ranking is a module-local pure function (`rank-related.ts`) next to
  `newest-first.ts`, tested on its own.

### R4 — `ListFeaturedBlogPosts` (application)

```ts
class ListFeaturedBlogPosts extends UseCase<
  { locale: Locale; limit?: number },
  BlogPostSummaryDTO[]
>;
```

- Published posts with `featured = true`, newest first, at most `limit`
  (default `2`, a named constant, sized for a two-card band).

### R5 — Tag pages (site)

- **`/[locale]/blog/tags`** (`tags/page.tsx`): heading "Tags", then every tag
  from `GetBlogTags` as a link to its page with its count badge. Static params:
  one entry per locale.
- **`/[locale]/blog/tags/[tag]`** (`tags/[tag]/page.tsx`):
  - heading `#{tag}`, the post count badge, then the posts as `PostCard`s;
  - `generateStaticParams` → every `(locale, tag)` pair from `GetBlogTags`;
  - `dynamicParams = false`. `ListBlogPostsByTag` returning `left` or `[]`
    → `notFound()` (covers `next dev`);
  - metadata: title `Posts tagged #{tag}`, description from i18n,
    `buildAlternates` canonical + hreflang, `buildOpenGraph`.
- **Breadcrumbs**: Home › Blog › Tags on the index, Home › Blog › Tags › #tag on
  a tag page, both visible and as `BreadcrumbList` JSON-LD.
- **Sitemap**: the tag index and every tag page, in every locale, priority
  `0.5`.

### R6 — Tag links on the post page (site)

- The post header's tags become links to `blogTagPath(tag)`. The text is
  unchanged. The badge look stays and gets a visible hover/focus state.

### R7 — Listing page (site)

Top to bottom:

1. **Header**: title, subtitle, and a count badge with the published post total
   ("4 posts").
2. **Featured band** (`features/blog/FeaturedPosts`): a section headed
   "Featured", with the `ListFeaturedBlogPosts` posts as cards in two columns
   from `md`. Not rendered when there are no featured posts.
3. **Trending tags** (`features/blog/TrendingTags`): the first `8` tags of
   `GetBlogTags` (a named constant) as links with count badges, then "All tags"
   → `/blog/tags`. Not rendered when there are no tags.
4. **All posts**: a section headed "All posts" with the existing list. It still
   holds **every** post, featured ones included, so it stays the complete
   chronological index (§8).
5. **Archive navigation** (`features/blog/ArchiveNav`): "Archive", then one
   link per year from `ListBlogArchive` with its post count → `/blog/{year}`.

Sections are `<section aria-labelledby>` with real headings.

### R8 — Related posts on the post page (site)

- New `features/blog/RelatedPosts`: a section headed "Further reading" with the
  `ListRelatedBlogPosts` posts as compact links (title, date, reading time).
  It sits after the author byline and before prev/next. Not rendered when the
  list is empty.
- The post page fetches it in the same `Promise.all` as the post and the
  adjacent posts.

### R9 — Prev/next polish (site)

- Each link shows an arrow icon (`material-symbols:arrow-back` for newer,
  `arrow-forward` for older), the label, the title and the target post's date
  (`<time dateTime>`, formatted like `PostMeta`).
- `rel="prev"` on the newer link and `rel="next"` on the older one, following
  the listing's newest-first order.
- A two-column grid from `sm` replaces the hidden spacer `<span>`s, so a lone
  "older" link still sits on the right.
- `BlogPostLinkDTO` already carries `publishedAt`. No DTO change.

### R10 — i18n

New `Blog.*` keys in `en-US`, `pt-BR` and `es`: `featured`, `allPosts`,
`trendingTags`, `allTags`, `tags`, `tagHeading` (`#{tag}`), `archive`,
`furtherReading`. Every count badge reuses the existing `archivePostCount`
(`{count, plural, one {# post} other {# posts}}`). New `Metadata.BlogTagsPage` and `Metadata.BlogTagPage`
(`title`, `description`, with `{tag}`).

## 4. Acceptance criteria

- [ ] `GetBlogTags`, `ListBlogPostsByTag`, `ListRelatedBlogPosts` and
      `ListFeaturedBlogPosts` exist, are exported from `@repo/application/blog`,
      count and list **published** posts only, and have unit tests.
- [ ] `/blog/tags` lists every tag with its count. `/blog/tags/{tag}` lists that
      tag's posts newest first, 404s for an unknown tag, and has canonical +
      hreflang metadata, breadcrumbs and `BreadcrumbList` JSON-LD. Both are in
      the sitemap for every locale.
- [ ] The post header's tags link to their tag pages. `PostCard` contains no
      nested links.
- [ ] The listing shows, in order: header with post count, featured band (only
      when there are featured posts), trending tags with counts and "All tags",
      the full list (featured posts included), and archive links per year with
      counts.
- [ ] A post with tag overlap shows up to 3 related posts, ranked by shared tags
      and then recency, never itself. A post with no overlap shows no section.
- [ ] Prev/next shows arrows, titles and dates, carries `rel="prev"` /
      `rel="next"`, and keeps its sides without spacer elements.
- [ ] New i18n keys exist in `en-US`, `pt-BR` and `es` (`messages.test.ts` green).
- [ ] No `'use client'` file imports `@repo/application`. No change to
      `packages/core`, `packages/infra` or the seed. No file over 200 lines.
- [ ] `pnpm --filter @repo/application test`, `pnpm --filter site test`,
      `pnpm -w lint`, `pnpm -w types` green.
- [ ] `pnpm --filter site build` prerenders every page, including the tag pages
      (3 locales × (1 index + 8 tags) = 27 new pages with the current seed).
      Checked in the browser in both themes and two locales: the listing,
      `/blog/tags`, a tag page, a post's related posts and prev/next, and
      keyboard focus on every new link.

## 5. Files

**Create**

- `packages/application/src/blog/use-cases/{GetBlogTags,ListBlogPostsByTag,ListRelatedBlogPosts,ListFeaturedBlogPosts,rank-related}.ts`
- `packages/application/src/blog/dtos/BlogTagDTO.ts`
- `apps/site/src/app/[locale]/blog/tags/page.tsx`
- `apps/site/src/app/[locale]/blog/tags/[tag]/page.tsx`
- `apps/site/src/features/blog/{FeaturedPosts,TrendingTags,ArchiveNav,RelatedPosts,TagLink}/index.tsx`
- Tests:
  - `packages/application/test/blog/{GetBlogTags,ListBlogPostsByTag,ListRelatedBlogPosts,ListFeaturedBlogPosts,rank-related}.test.ts`
  - `apps/site/tests/app/[locale]/blog/tags/{page,[tag]/page}.test.tsx`
  - `apps/site/tests/features/blog/{FeaturedPosts,TrendingTags,ArchiveNav,RelatedPosts}/*.test.tsx`

**Update**

- `packages/application/src/blog/{use-cases/index.ts,dtos/index.ts}`
- `apps/site/src/app/[locale]/blog/page.tsx`
- `apps/site/src/app/[locale]/blog/[year]/[month]/[slug]/page.tsx`
- `apps/site/src/app/sitemap.ts`
- `apps/site/src/features/blog/{paths.ts,buildBlogBreadcrumbs.ts,PostHeader/index.tsx,PrevNextNav/index.tsx}`
- `apps/site/messages/{en-US,pt-BR,es}.json`
- Tests: `apps/site/tests/app/[locale]/blog/page.test.tsx`, the post page
  tests, `sitemap.test.ts`, `paths.test.ts`, `buildBlogBreadcrumbs.test.ts`,
  `PrevNextNav.test.tsx`, `PostHeader.test.tsx`.

## 6. Test plan

**Application (in-memory repository, the shared `BlogPostBuilder`)**

- `GetBlogTags`: should count each tag over published posts only when drafts
  share tags; should order by count then name when counts tie; should return
  an empty list when there are no published posts; should return `FETCH_FAILED`
  when the repository throws.
- `ListBlogPostsByTag`: should list the tag's published posts newest first;
  should return an empty list when no published post has the tag; should
  return a validation error when the tag is malformed.
- `rank-related`: should rank by shared tag count, then recency; should exclude
  the post itself; should drop posts with no shared tag; should cap at `limit`.
- `ListRelatedBlogPosts`: should return `NotFoundError` when the slug is
  unpublished or unknown; should return an empty list when no post shares a tag.
- `ListFeaturedBlogPosts`: should list only featured published posts newest
  first, capped at `limit`.

**Site**

- `paths`: `blogTagsPath()` / `blogTagPath(tag)`.
- `buildBlogBreadcrumbs`: Home › Blog › Tags and Home › Blog › Tags › #tag, both
  visible and JSON-LD.
- Components: `TrendingTags` caps at 8 and links "All tags"; `FeaturedPosts`
  and `RelatedPosts` render nothing for an empty list; `ArchiveNav` links each
  year with its count; `PrevNextNav` arrows, dates, `rel`, a lone older link on
  the right.
- Page integration tests (in-memory repository): the listing's section order
  and counts; the tag index; a tag page's posts, metadata and 404 for an
  unknown tag; the post page's tag links and "Further reading"; the sitemap's
  tag URLs.

**Manual**

- `pnpm --filter site build && next start`, then in both themes and in `en-US` +
  `pt-BR`: the listing (featured band, trending tags, archive links), `/blog/tags`,
  `/blog/tags/ddd` (3 posts), a post's tag links, "Further reading" and
  prev/next, and Tab through every new link to check the focus ring.
- `curl /sitemap.xml` and confirm the 27 tag URLs.

## 7. Operational notes

- No migration, no seed change, no new dependency.
- 27 more static pages per build with the current seed (3 locales × 9).
- Featured posts are chosen with the existing `featured` column. Until
  `apps/admin` exists, the seed is where an editor sets it.

## 8. Decisions (resolved during scoping)

- **Featured posts also stay in "All posts".** The band is a highlight; the
  list below it is the complete chronological index. Removing featured posts
  from it would make a reader scan two places to find a post by date. The cost
  is that, with today's 4 posts, 2 appear twice. If that feels repetitive once
  the page is built, hiding them from the list is a one-line change in the page.
- **Ranking in `application`, not `core`.** "Related" is a curation heuristic
  (shared tag count, a limit of 3), not a business invariant, the same reasoning
  PRD 5A used for reading time. `BlogPostSequence` stays the only blog domain
  service because adjacency defines the post order itself.
- **No fallback for related posts.** Filling the section with the latest posts
  when nothing shares a tag would duplicate prev/next and suggest a relation
  that doesn't exist.
- **Tag routes under `/blog/tags/`**, not `/blog/tag/{tag}` or a query string.
  The plural index plus the tag under it reads naturally in breadcrumbs, and the
  static segment can't collide with `[year]`.
- **Every tag page is indexable**, including tags with one post. The blog is
  small, the pages carry real listings, and per-tag `noindex` rules would be
  tuning for traffic the blog doesn't have yet.
- **Tag badges in cards stay non-interactive.** Making them links needs a
  "stretched link" card rewrite. The post header, trending tags and tag index
  already give every tag a link.
- **Share links are left out of 5B.** They're a post-page feature that the
  5A/5B/5C split didn't assign. They need no use case and no route, so they fit
  a small standalone issue after 5B.
- **Slice order for `parse-prd`:**
  (a) `GetBlogTags` + `ListBlogPostsByTag` + `BlogTagDTO` + tag paths +
  breadcrumbs tag target + `/blog/tags` and `/blog/tags/[tag]` pages + sitemap →
  (b) tag links on the post header + `TrendingTags` + listing post count +
  `ArchiveNav` + listing sections →
  (c) `ListFeaturedBlogPosts` + `FeaturedPosts` band →
  (d) `rank-related` + `ListRelatedBlogPosts` + `RelatedPosts` on the post page →
  (e) prev/next polish + final integration, manual checks in both themes and
  locales.
