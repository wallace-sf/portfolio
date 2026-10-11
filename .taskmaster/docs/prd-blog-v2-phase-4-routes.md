# Blog v2 — Phase 4: Routes + archive (`apps/site`, `packages/application`, `packages/seo`)

> Status: proposed — pending review.
> Parent design: [2026-09-01-blog-v2-phase-0-design.md](../../docs/superpowers/specs/2026-09-01-blog-v2-phase-0-design.md) §4, §5, §6, §8.
> Depends on **PRD 3** (Infra + Prisma migration): tag `blog-v2-phase-3`, all tasks merged.
> Absorbs the remaining parts of **#1062** (blog test-hardening).
> Tracked by #1141.
> Related: [02-ARCHITECTURE.md](../../docs/02-ARCHITECTURE.md), [07-I18N.md](../../docs/07-I18N.md), [08-TESTING.md](../../docs/08-TESTING.md).

## Goal

Move blog posts from `/[locale]/blog/{slug}` to dated URLs
`/[locale]/blog/{yyyy}/{MM}/{slug}`, and add year and month archive pages at
`/[locale]/blog/{yyyy}` and `/[locale]/blog/{yyyy}/{MM}`.

Every place that builds a blog URL today (cards, prev/next, sitemap, RSS,
canonical / hreflang / OpenGraph) goes through **one** path helper. Posts and
archive pages get a visible breadcrumb and a `BreadcrumbList` JSON-LD node.

The post-page test is rewritten during the move. That is the right time to
finish what is still open on #1062: stop mocking our own components, delete the
prop-echo tests, and add page-level integration tests (real use case → real DTO
→ real component).

## 1. Scope

**In scope**

- **Path helpers** `blogPostPath(publishedAt, slug)` and
  `blogArchivePath(year, month?)` in `apps/site`. They return locale-agnostic
  paths and are the single source of truth for blog URLs.
- **Route move** `[slug]/{page,opengraph-image}.tsx` →
  `[year]/[month]/[slug]/{page,opengraph-image}.tsx`, with
  `dynamicParams = false` and `generateStaticParams` returning only real
  `(year, month, slug)` combinations.
- **`ListBlogArchive` use case** (application): published posts grouped
  year → month, with counts and post summaries. Named in Phase 0 §4.
- **Archive pages** `[year]/page.tsx` and `[year]/[month]/page.tsx`.
- **Every href switched** to the helper: `PostCard`, `PrevNextNav`,
  `sitemap.ts`, `blog/rss.xml/route.ts`, the post page's `buildAlternates` /
  `buildOpenGraph` calls.
- **Sitemap** also lists the archive pages.
- **Breadcrumbs**: the existing `~features/shared/Breadcrumb` on the post and
  archive pages, plus a generic `buildBreadcrumbListJsonLd` in `@repo/seo`.
  `buildProjectJsonLd` switches to it (output unchanged).
- **#1062 leftovers**: de-mocked post-page test, PostCover / PostHeader prop-echo
  tests removed, integration tests for the listing, post and archive pages.

**Out of scope**

- **Redirects from `/blog/{slug}`.** This departs from Phase 0 §6: the blog has
  not been announced or indexed, so there is no inbound traffic to preserve.
  Old URLs return 404. See §8.
- Archive navigation on the listing page (a year/month sidebar or index). For
  now the breadcrumbs are the only way into the archive pages. Belongs to the
  Phase 5 presentation work.
- `BlogPosting` / `Article` JSON-LD, reading time, metadata grid, author byline,
  featured band, tag pages (**PRD 5**).
- Per-archive OpenGraph images. Archive pages use the default OG image.
- Shared repository test doubles (**#1136**).
- The site-wide RSS `alternates` link pointing at `/feed.xml` (projects feed)
  rather than `/blog/rss.xml`. It predates this PRD; file it separately if it
  turns out to be a bug.
- Any change to `packages/core` or `packages/infra`.

## 2. Design constraints

- **Dependency rule**: `ListBlogArchive` lives in `packages/application` and
  depends only on `@repo/core`. The archive pages are Server Components that call
  it directly; no `'use client'` file imports `@repo/application`. `Breadcrumb`
  is a client component and receives plain `{ label, href }` props.
- **`@repo/seo` stays framework-agnostic** and depends only on `@repo/core`
  (CLAUDE.md, `packages/seo` precedent). `buildBreadcrumbListJsonLd` takes
  absolute URLs from the caller and knows nothing about the site URL or Next.js.
- **Year and month come from `publishedAt` in UTC.** `blogPostPath` (site) and
  `ListBlogArchive` (application) derive them separately, so both get a test on
  the same boundary case (`2026-08-31T23:30:00-03:00` → `2026/09`) to keep them
  in sync.
- **URL format**: 4-digit year, zero-padded 2-digit month (`/blog/2026/09/slug`).
  Months are numbers (1–12) in DTOs and padded only in the path.
- **Paths are locale-agnostic** (`/blog/2026/09/slug`). The next-intl `Link`
  adds the locale prefix. Absolute URLs (sitemap, RSS, JSON-LD) prepend
  `${siteUrl}/${locale}`, and `buildAlternates` / `buildOpenGraph` take the path
  as `pathname`. This differs from the `blogPostPath(locale, publishedAt, slug)`
  signature sketched in Phase 0 §5, because every call site already handles the
  locale.
- **No new error code.** `ListBlogArchive` returns `FETCH_FAILED` on repository
  failure, like `ListBlogPosts`.
- **Reuse, don't copy**: the summary mapping in `ListBlogPosts.toDTO` becomes a
  shared `toBlogPostSummaryDTO(post, locale)` used by both use cases, and the
  existing `publishedOnly` / `newestFirst` helpers do the filtering and ordering.
- **Cross-app reuse** (CLAUDE.md): the path helpers stay in `apps/site` for now,
  because `apps/admin` does not exist yet. Move them to a package when the admin
  needs preview links.
- Files stay under 200 lines. Test naming `should <expected behavior> when <context>`.
- **Mock only real boundaries** in page tests (`next/image`, `next-intl/server`,
  `next/navigation`, `next-mdx-remote/rsc`, the server container). Never mock
  our own feature components.

## 3. Requirements

### R1 — Path helpers

`apps/site/src/features/blog/paths.ts`:

```ts
/** `/blog/{yyyy}/{MM}/{slug}`; year and month from `publishedAt` in UTC. */
export function blogPostPath(publishedAt: string, slug: string): string;

/** `/blog/{yyyy}` or `/blog/{yyyy}/{MM}`. `month` is 1–12. */
export function blogArchivePath(year: number, month?: number): string;
```

Both return paths without a locale prefix. `blogPostPath` uses `getUTCFullYear()`
and `getUTCMonth() + 1`, zero-padded to two digits.

### R2 — `ListBlogArchive` use case

`packages/application/src/blog/use-cases/ListBlogArchive.ts`:

```ts
export type ListBlogArchiveInput = { locale: Locale };

export type BlogArchiveMonthDTO = {
  month: number; // 1–12
  count: number;
  posts: BlogPostSummaryDTO[]; // newest first
};

export type BlogArchiveYearDTO = {
  year: number;
  count: number;
  months: BlogArchiveMonthDTO[]; // newest first
};

// execute → Either<DomainError, BlogArchiveYearDTO[]>  (years newest first)
```

- `newestFirst(publishedOnly(await repository.findAll()))`, then group by UTC
  year and month. Empty months and years are never emitted.
- Repository throws → `left(DomainError(FETCH_FAILED))` and logs, like `ListBlogPosts`.
- Extract `toBlogPostSummaryDTO(post, locale)` from `ListBlogPosts.toDTO` (for
  example `use-cases/to-summary-dto.ts`). `ListBlogPosts` calls it, and its
  output is unchanged.
- DTO types go in `dtos/BlogArchiveDTO.ts` and are re-exported from
  `dtos/index.ts`. The use case is exported from `use-cases/index.ts`.

### R3 — Post route move

- `git mv` `blog/[slug]/page.tsx` and `opengraph-image.tsx` to
  `blog/[year]/[month]/[slug]/`. Params become
  `{ locale, year, month, slug }`.
- `export const dynamicParams = false` on the post page and on the OG image.
- `generateStaticParams` (page and OG image): from `ListBlogPosts`, emit
  `{ locale, year, month, slug }` for every locale × published post. `year` /
  `month` are the string segments from `blogPostPath`.
- The page calls `notFound()` if the post's own `publishedAt` doesn't match the
  `year` / `month` params. This is a defensive check: in a production build
  `dynamicParams = false` already rejects wrong combinations, but `next dev`
  renders on demand.
- `generateMetadata` passes `blogPostPath(post.publishedAt, slug)` to
  `buildAlternates` / `buildOpenGraph`.
- The old `blog/[slug]/` directory is deleted. No redirect (§8).

### R4 — Archive pages

`blog/[year]/page.tsx` and `blog/[year]/[month]/page.tsx`:

- `generateStaticParams` from `ListBlogArchive` (`DEFAULT_LOCALE`): every
  locale × year, and every locale × (year, month) that has posts.
  `dynamicParams = false`, so an empty or invalid year/month returns 404.
- **Year page**: `<h1>` with the year, then one section per month (newest
  first). Each section has a heading linking to the month archive
  (`blogArchivePath(year, month)`), the month's post count, and its `PostCard`s.
- **Month page**: `<h1>` with the localized month name and year, then the
  month's `PostCard`s.
- Month names come from `Intl.DateTimeFormat(locale, { month: 'long', timeZone: 'UTC' })`
  in a small `formatArchiveMonth(year, month, locale)` helper next to
  `formatPublishedAt`, not from translation keys.
- `generateMetadata`: title and description from new
  `Metadata.BlogArchive.{yearTitle, monthTitle, description}` keys (ICU params
  `{year}` / `{month}`), plus `buildAlternates` and `buildOpenGraph` with the
  archive path.
- A year or month the use case doesn't return → `notFound()`.
- Use case `left` → log and `notFound()`. Unlike the listing, an archive page
  has no empty state.

### R5 — Breadcrumbs

**Visible**: render `Breadcrumb` (from `~features/shared/Breadcrumb`) at the top of:

| Page          | Items                                                                 |
| ------------- | --------------------------------------------------------------------- |
| Post          | Home `/` › Blog `/blog` › `{yyyy}` › `{Month}` › post title (current) |
| Month archive | Home › Blog › `{yyyy}` › `{Month}` (current)                          |
| Year archive  | Home › Blog › `{yyyy}` (current)                                      |

Labels: `Blog.breadcrumbHome` (new key, all 3 locales), `Blog.title`, the year,
and `formatArchiveMonth`.

**JSON-LD**: `packages/seo/src/breadcrumbs.ts`:

```ts
export interface IBreadcrumbListItem {
  name: string;
  url: string;
} // absolute URL
export interface IBreadcrumbListNode {
  "@type": "BreadcrumbList";
  itemListElement: {
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }[];
}
export function buildBreadcrumbListJsonLd(
  items: IBreadcrumbListItem[],
): IBreadcrumbListNode;
```

Positions are 1-based and follow input order. Exported from `@repo/seo`.

- The post and archive pages render
  `<JsonLd data={{ '@context': 'https://schema.org', ...buildBreadcrumbListJsonLd(items) }} />`
  using the same items as the visible breadcrumb, with absolute URLs
  (`${siteUrl}/${locale}${path}`).
- `buildProjectJsonLd` (`apps/site/src/lib/seo/structuredData.ts`) builds its
  `BreadcrumbList` node with `buildBreadcrumbListJsonLd`. Its output must stay
  byte-identical, so the existing tests pass unchanged.
- To avoid repeating the item list three times, the site builds both the
  visible items and the JSON-LD items from one
  `buildBlogBreadcrumbs({ locale, labels, year?, month?, post? })` helper in
  `features/blog`.

### R6 — Hrefs, sitemap, RSS

- `PostCard`: `href={blogPostPath(publishedAt, slug)}`.
- `PrevNextNav`: `href={blogPostPath(newer.publishedAt, newer.slug)}` (and the
  same for `older`). `BlogPostLinkDTO.publishedAt` already exists.
- `blog/rss.xml/route.ts`: `<link>` and `<guid>` become
  `${siteUrl}/${locale}${blogPostPath(...)}`.
- `sitemap.ts`: post entries use the dated path. Add archive entries (every
  locale × year, every locale × year/month) from `ListBlogArchive`, with
  priority `0.5` and `changeFrequency: 'monthly'`. The existing try/catch
  fallback to `staticEntries` stays.
- `grep -rn "/blog/\${" apps/site/src` returns no hand-built post URLs
  afterwards.

### R7 — Tests (#1062 leftovers)

- **Post page test**, moved to
  `tests/app/[locale]/blog/[year]/[month]/[slug]/page.test.tsx` and rewritten:
  - no `vi.mock('~features/blog/PrevNextNav')` and no mock of any other
    `~features/blog/*` component;
  - the async `PrevNextNav` is rendered for real. A small test helper resolves
    nested async Server Components before `render()`;
  - assert the real rendered prev/next hrefs: dated path, correct direction
    (newer vs older), and the locale prefix.

  Asserting the locale prefix requires the real next-intl `Link`. If it can't run
  under jsdom with a `NextIntlClientProvider`, keep a thin `Link` stub that
  reproduces next-intl's prefixing (`/${locale}${href}`) and record the reason in
  the test file. This is the one allowed exception.

- **Integration tests**, one per page: listing, post, year archive, month
  archive. Each mocks only `getServerContainer` to return an in-memory
  `IBlogPostRepository` seeded with `BlogPostBuilder` posts (mixed statuses,
  dates across two months and two years), and asserts the rendered output:
  - listing: newest-first order, empty state, card hrefs dated;
  - post: title and body, breadcrumb trail, prev/next adjacency and direction,
    `notFound` for a missing slug, a non-published slug, and a year/month
    mismatch;
  - year / month: only that period's published posts, newest first, month
    headings link to the month archive, `notFound` for an empty period.
- `PostCover.test.tsx` deleted (prop-echo).
- `PostHeader.test.tsx`: title / description echo tests removed. The date
  formatting and empty-tag-row tests stay.
- `opengraph-image.test.tsx` and `rss.xml/route.test.ts`: params and expected
  URLs updated to the dated paths.

## 4. Acceptance criteria

- [ ] `/[locale]/blog/{yyyy}/{MM}/{slug}` renders every published post. A wrong
      year/month, an unknown slug, or the old `/blog/{slug}` URL returns 404.
- [ ] `/[locale]/blog/{yyyy}` and `/[locale]/blog/{yyyy}/{MM}` render the
      period's published posts newest first; periods with no posts return 404.
- [ ] `ListBlogArchive` groups published posts by UTC year → month with correct
      counts, newest first; `left(FETCH_FAILED)` on repository failure;
      `ListBlogPosts` output unchanged.
- [ ] `blogPostPath` / `blogArchivePath` are the only places that build blog
      URLs (cards, prev/next, sitemap, RSS, alternates, OpenGraph).
- [ ] Sitemap lists dated post URLs plus year and month archive URLs for every
      locale. RSS `<link>` / `<guid>` use dated URLs.
- [ ] Post and archive pages show the visible breadcrumb and a matching
      `BreadcrumbList` JSON-LD. `buildProjectJsonLd` output unchanged.
- [ ] `@repo/seo` exports `buildBreadcrumbListJsonLd` and still depends only on
      `@repo/core`.
- [ ] New i18n keys exist in `en-US`, `pt-BR` and `es` (`messages.test.ts` green).
- [ ] Post-page test no longer mocks any `~features/blog/*` component. Four page
      integration tests exist. `PostCover` and `PostHeader` prop-echo tests are
      gone.
- [ ] `pnpm --filter @repo/application test`, `pnpm --filter @repo/seo test`,
      `pnpm --filter @repo/site test`, `pnpm -w lint`, `pnpm -w types` green.
- [ ] `pnpm --filter @repo/site build` prerenders the dated post pages, the
      archive pages and their OG images. Checked in the browser: listing → post
      → breadcrumb → month → year, in at least two locales.
- [ ] No file over 200 lines. No change to `packages/core` / `packages/infra`.
- [ ] #1062 closed by the final PR (only shared repository doubles remain, and
      those are tracked in #1136).

## 5. Files

**Create**

- `apps/site/src/features/blog/paths.ts`
- `apps/site/src/features/blog/formatArchiveMonth.ts`
- `apps/site/src/features/blog/buildBlogBreadcrumbs.ts`
- `apps/site/src/app/[locale]/blog/[year]/page.tsx`
- `apps/site/src/app/[locale]/blog/[year]/[month]/page.tsx`
- `packages/application/src/blog/use-cases/ListBlogArchive.ts`
- `packages/application/src/blog/use-cases/to-summary-dto.ts`
- `packages/application/src/blog/dtos/BlogArchiveDTO.ts`
- `packages/seo/src/breadcrumbs.ts`
- Tests: `packages/application/test/blog/ListBlogArchive.test.ts`,
  `packages/seo/test/breadcrumbs.test.ts`,
  `apps/site/tests/features/blog/{paths,formatArchiveMonth,buildBlogBreadcrumbs}.test.ts`,
  `apps/site/tests/app/[locale]/blog/[year]/page.test.tsx`,
  `apps/site/tests/app/[locale]/blog/[year]/[month]/page.test.tsx`,
  `apps/site/tests/app/sitemap.test.ts` (none exists today; asserts dated post
  URLs and archive URLs per locale),
  the async Server Component render helper under `apps/site/tests/`.

**Move** (`git mv`)

- `apps/site/src/app/[locale]/blog/[slug]/{page,opengraph-image}.tsx` →
  `…/blog/[year]/[month]/[slug]/`
- `apps/site/tests/app/[locale]/blog/[slug]/*` → `…/blog/[year]/[month]/[slug]/`

**Update**

- `apps/site/src/features/blog/{PostCard,PrevNextNav}/index.tsx`
- `apps/site/src/app/[locale]/blog/rss.xml/route.ts`
- `apps/site/src/app/sitemap.ts`
- `apps/site/src/lib/seo/structuredData.ts`
- `apps/site/messages/{en-US,pt-BR,es}.json`
- `packages/application/src/blog/use-cases/{ListBlogPosts,index}.ts`
- `packages/application/src/blog/dtos/index.ts`
- `packages/seo/src/index.ts`
- `apps/site/tests/app/[locale]/blog/{page.test.tsx,rss.xml/route.test.ts}`
- `apps/site/tests/features/blog/{PostCard,PrevNextNav,PostHeader}/*.test.tsx`

**Delete**

- `apps/site/tests/features/blog/PostCover/PostCover.test.tsx`

## 6. Test plan

**`ListBlogArchive` (application)**

- should group published posts by year and month when posts span two years
- should order years, months and posts newest first
- should exclude DRAFT and ARCHIVED posts from groups and counts
- should derive the period in UTC when `publishedAt` carries a negative offset
  (`2026-08-31T23:30:00-03:00` → 2026 / 9)
- should return an empty array when there are no published posts
- should return `FETCH_FAILED` when the repository throws

**`buildBreadcrumbListJsonLd` (seo)**

- should number items from 1 in input order
- should map `name` / `url` to `ListItem.name` / `ListItem.item`

**Site helpers**

- `blogPostPath`: zero-pads the month; uses UTC across the month boundary
- `blogArchivePath`: year only; year + padded month
- `formatArchiveMonth`: localized month names for `en-US` / `pt-BR` / `es`
- `buildBlogBreadcrumbs`: correct trail per page type; current item has no href;
  JSON-LD URLs absolute and locale-prefixed

**Pages (integration, in-memory repository)**: see R7.

**Manual**

- `pnpm --filter @repo/site build` against portfolio-dev, then `pnpm --filter @repo/site start`:
  open `/en-US/blog` → a post (dated URL) → breadcrumb to the month → the year →
  back. Repeat in `pt-BR`. Check that `/en-US/blog/{old-slug}` returns 404, and
  check `sitemap.xml`, `/en-US/blog/rss.xml` and a post's OG image URL.
- Run a Rich Results / schema validator on the JSON-LD of one post page.

## 7. Operational notes

- No migration and no seed change, so nothing to run against a database beyond
  the usual dev build.
- Search engines don't need to be notified: the old URLs were never announced or
  indexed (§8).

## 8. Decisions (resolved during scoping)

- **No redirects from the MVP `/blog/{slug}` URLs.** Phase 0 §6 planned a `301`
  map. It is dropped because the blog is in production but hasn't been announced
  or indexed, so no inbound links or rankings need preserving. This also avoids
  two problems: Next.js forbids sibling `[slug]` / `[year]` dynamic segments, and
  a DB-backed `redirects()` in `next.config` would need infra/Prisma at
  config-eval time. If redirects are ever needed, handle them inside
  `[year]/page.tsx` (a non-year segment → `permanentRedirect`).
- **#1062 folded in.** The post-page test has to be rewritten for the move
  anyway, and a de-mocked test is what catches dated-href or adjacency-direction
  bugs. Shared repository doubles stay in #1136.
- **One archive use case returning post summaries.** `ListBlogArchive` returns
  the whole year → month → posts tree, so `generateStaticParams` and both
  archive pages need one call each. With few posts that is cheaper than a
  separate "posts by period" use case.
- **Month names via `Intl.DateTimeFormat`**, not translation keys: correct for
  every locale with no new strings to maintain.
- **Breadcrumb JSON-LD builder in `@repo/seo`**, as Phase 0 §8 says, with the
  project builder moved onto it so the two `BreadcrumbList` shapes can't drift
  apart.
- **Slice order for `parse-prd`:**
  (a) `ListBlogArchive` + `toBlogPostSummaryDTO` extraction + tests →
  (b) path helpers + `PostCard` / `PrevNextNav` / RSS / sitemap / post route
  move + de-mocked post-page test (one green "dated URLs" slice) →
  (c) archive pages + `formatArchiveMonth` + archive entries in the sitemap +
  i18n keys →
  (d) `buildBreadcrumbListJsonLd` in `@repo/seo` + project builder refactor +
  breadcrumbs on the post and archive pages →
  (e) page integration tests, `PostCover` / `PostHeader` cleanup, manual browser
  verification, AC checklist, close #1062.
