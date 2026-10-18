# Blog v2 — Phase 5C: Search (`apps/site`, `packages/application`, `packages/utils`)

> Status: proposed — pending review.
> Parent design: [2026-09-01-blog-v2-phase-0-design.md](../../docs/superpowers/specs/2026-09-01-blog-v2-phase-0-design.md) §8.
> Feature source: [BLOG-V2-FEATURE-CURATION.md](../../docs/BLOG-V2-FEATURE-CURATION.md) § "Adopt in Blog v2 core" (Search).
> Depends on **PRD 5B** (discovery): tag `blog-v2-phase-5b`, merged and released (#1227).
> Tracked by #1228.
> Related: [02-ARCHITECTURE.md](../../docs/02-ARCHITECTURE.md), [07-I18N.md](../../docs/07-I18N.md), [08-TESTING.md](../../docs/08-TESTING.md).

## Goal

A reader on the blog listing who wants a topic types a keyword and sees, right
away, the posts that talk about it, including posts where the word appears
only in the body. Each result shows the passage where the word was found.

The blog launches with few posts, so search starts as the simplest thing that
is genuinely useful: a filter on the listing over a small static index, with no
new dependency and no extra build step. The PRD writes down when to move to a
real search engine (§8), so growing later is a decision, not a rewrite.

This is the last of the three Phase 5 PRDs (5A post page, 5B discovery, 5C
search; see PRD 5A §8).

## 1. Scope

**In scope**

- A **search box on the listing** (`/blog`), in the header under the subtitle.
- **Search takes over the page while active** (option A, chosen during scoping):
  with a query, the featured band, trending tags, "All posts" and archive
  navigation are replaced by a results count and the matching posts. Clearing
  the query restores the listing exactly as it is today.
- **Full-text matching**: title, tags, description and the post **body**,
  case- and accent-insensitive (`validacao` finds `validação`).
- **Ranking** by where the query matched: title → tags → description → body;
  ties newest first.
- **Excerpt**: when the body contains the query, the result card shows a short
  passage around the first occurrence, with the matched terms in `<mark>`.
- **A static search index per locale** (`/{locale}/blog/search-index.json`),
  prerendered at build like `rss.xml`, fetched lazily the first time the box
  gets focus.
- **The query lives in the URL** (`/blog?q=validator`) so opening a result and
  going back keeps the search.
- One use case, `GetBlogSearchIndex`, and a Markdown → plain-text helper in
  `packages/application`.
- A generic accent/case folding helper and an excerpt helper in `@repo/utils`.

**Out of scope**

- Fuzzy matching (`valdator` → `validator`), stemming, synonyms, relevance
  scoring beyond the field order above.
- A global search (header shortcut, `⌘K` modal, search on other pages). Search
  exists only on `/blog`.
- A separate results page or route (`/blog/search`).
- Highlighting the term inside the opened post.
- Pagination (still unnecessary at this post count; see §8).
- Searching code inside fenced blocks (§8).
- Any change to `packages/core`, the Prisma schema, `packages/infra` or the
  seed.
- Analytics on what readers search.

**Anti-goals** (would make this a failure even if it works)

- A new build step, a generated artifact outside Next's own output, or a new
  runtime dependency.
- A search UI that competes with the listing for attention when nobody is
  searching.
- Shipping the full post bodies to readers who never touch the search box.

## 2. Design constraints

- **Dependency rule.** `GetBlogSearchIndex` and the plain-text helper live in
  `packages/application` and depend only on `@repo/core`. The index route is a
  Server route handler. The search island is a `'use client'` component and
  **must not import `@repo/application`, not even types**: it declares its own
  minimal props type in the site.
- **Repository port unchanged.** `IBlogPostRepository` stays `findAll()` /
  `findBySlug()`.
- **The listing stays static.** `page.tsx` keeps `generateStaticParams` and
  does not read `searchParams` (that would make it dynamic). The listing itself
  is **not** wrapped in `<Suspense>` (a fallback would put the whole listing in
  the RSC payload twice). Instead a tiny `QuerySync` child, inside its own
  `<Suspense fallback={null}>`, reads `?q=` with `useSearchParams()` and pushes
  it into the island's state. The prerendered HTML is the full listing.
- **`PostCard` is an async Server Component** (it awaits `PostMeta`, which
  calls `getTranslations`). The island cannot render it. Approach:
  - `PostCard` gains an optional `excerpt?: ReactNode` slot, rendered inside
    the card body after the description. Existing callers pass nothing and
    render unchanged.
  - The page renders, on the server, one `PostCard` per post with
    `excerpt={<SearchExcerpt slug={slug} />}`, and hands these nodes to the
    island keyed by slug. `SearchExcerpt` is a small client component that
    reads the current query and index from a React context provided by the
    island, and renders nothing when there is no query or no body match.
  - **One set of cards.** The island owns the "All posts" list: it receives
    `before` (featured band + trending tags), `after` (archive navigation) and
    the `cards` map. No query → `before`, "All posts" (cards in newest-first
    order), `after`. Query → results line + the same cards, filtered and
    ranked. The cards are serialized once, and the island never builds a card
    itself, so there is one card component and no visual drift.
- **The index carries only what the page doesn't already have.** Each entry is
  `{ slug, text }`. Title, description, tags and dates already reach the page
  through `ListBlogPosts`; the island receives them as props for matching and
  joins the index by slug.
- **Graceful degradation.**
  - Before the index arrives (or if fetching it fails), matching runs on title,
    tags and description only. When the index arrives, results refine in place.
    A failed fetch is logged to the console and not shown to the reader.
  - Without JavaScript the box renders but does nothing beyond reloading the
    full listing; the page is fully usable.
- **Route fits the tree.** `search-index.json/` is a static segment next to
  `[year]/` and `rss.xml/`, so it never matches `[year]`. The route sets
  `dynamic = 'force-static'` and `generateStaticParams` per locale, like
  `rss.xml/route.ts`.
- **One URL source.** `features/blog/paths.ts` gains `blogSearchIndexPath()`.
  Paths there are locale-agnostic (the next-intl `Link` adds the prefix), but
  `fetch()` doesn't: the island fetches `/${locale}${blogSearchIndexPath()}`.
  The unprefixed `/blog/search-index.json` is excluded by the `.*\..*` matcher
  in `proxy.ts` and 404s; the prefixed one is served like `rss.xml`.
- **Generic helpers go to `@repo/utils`** (new `./text` subpath export):
  folding and excerpting know nothing about blogs. Ranking is blog-specific and
  stays in `apps/site/src/features/blog/search/`.
- **Files under 200 lines.** Test naming is `should <expected behavior> when
<context>`. Page tests mock only real boundaries.

## 3. Requirements

### R1 — Markdown → plain text (application)

```ts
/** The readable text of a Markdown body: no syntax, no fenced code. */
export function toPlainText(markdown: string): string;
```

- Module-local in `packages/application/src/blog/use-cases/plain-text.ts`,
  next to `reading-time.ts`. A regex heuristic, no parser. There is no existing
  stripper to copy; `reading-time.ts` only counts tokens.
- Drops: fenced code blocks entirely, HTML tags, image syntax, link URLs (keeps
  link text), heading/list/blockquote markers, emphasis markers, table pipes
  and separator rows, the backticks around inline code (keeps its text).
- Collapses whitespace to single spaces; output is trimmed.

### R2 — `GetBlogSearchIndex` (application)

```ts
export type BlogSearchEntryDTO = { slug: string; text: string };

/** The plain-text body of every published post, for client-side search. */
class GetBlogSearchIndex extends UseCase<{ locale: Locale }, BlogSearchEntryDTO[]>;
```

- Published posts only (`publishedOnly`), newest first (`newestFirst`).
- `text` is `toPlainText(post.content.get(locale))`.
- Repository failure → `left(DomainError(FETCH_FAILED))`, as in `ListBlogPosts`.

### R3 — Search index route (site)

- `apps/site/src/app/[locale]/blog/search-index.json/route.ts`: `GET` returns
  `GetBlogSearchIndex` as JSON (`Content-Type: application/json`).
- `force-static`, one file per locale at build. Failure → `500`, as `rss.xml`.
- Not in the sitemap. Not linked from any page.

### R4 — Text helpers (`@repo/utils/text`)

```ts
/** Lowercased, diacritics removed, same length as the input. */
export function foldForSearch(value: string): string;

/** ~`radius` words either side of [start, end), cut on word boundaries,
 *  with leading/trailing ellipses when the text was cut. */
export function excerptAround(
  text: string,
  start: number,
  end: number,
  radius?: number,
): { text: string; offset: number };
```

- `foldForSearch` folds **character by character** so indices in the folded
  string map 1:1 to the original. A character whose fold isn't exactly one code
  unit (e.g. `'İ'.toLowerCase()` is two) keeps its **original** form. This is
  what lets the excerpt match on folded text and display the original.
- Callers fold text that is already **NFC**: `toPlainText` (R1) and
  `parseQuery` (R5) apply `normalize('NFC')` first, so decomposed accents in
  stored content or typed input fold correctly.
- `excerptAround` default `radius` is a named constant (≈ 12 words). `offset`
  is where the excerpt starts in `text`, so callers can re-locate matches.

### R5 — Matching and ranking (site, pure)

`apps/site/src/features/blog/search/`:

- `parseQuery(raw)`: trims, folds, splits on whitespace into terms; terms
  shorter than **2** characters are dropped. No terms → no search.
- `rankPosts(posts, bodies, terms)`: a post matches when **every** term is
  found in at least one of its fields (AND across terms, any field per term).
  Its rank is the best field any term hit: title (0) → tags (1) → description
  (2) → body (3). Ties keep the input order (newest first). `bodies` may be
  empty (index not loaded yet).
- `bodyExcerpt(body, terms)`: the excerpt around the first body occurrence of
  any term, with ranges for every term occurrence inside it, or `null` when
  the body has none.

### R6 — Listing page (site)

- Header gains the search box under the subtitle: `<form role="search">` with a
  labelled `<input type="search">` (visible placeholder, visually hidden
  label) and a clear button when non-empty. `Esc` clears. Submitting is
  prevented.
- Typing updates `?q=` with `window.history.replaceState` (no history entry
  per keystroke, no scroll jump). Not `router.replace`: that is a soft
  navigation and would fire an RSC request per keystroke on a static page.
  The App Router keeps `useSearchParams` in sync with `replaceState`. Loading
  `/blog?q=term` starts with that query.
- With a query (≥ 1 valid term):
  - featured band, trending tags, "All posts" and archive navigation are not
    rendered;
  - a results line "N posts match "term"" in an `aria-live="polite"` region;
  - the matching cards, in rank order, each with its excerpt when there is one;
  - no matches → a short message and a link to `/blog/tags` (reuses
    `allTags`).
- Without a query the page renders exactly as today (5B R7).
- The index is fetched once, on the first focus of the box (or on load when
  `?q=` is present), and kept in memory for the visit.

### R7 — i18n

New `Blog.*` keys in `en-US`, `pt-BR` and `es`: `searchLabel`,
`searchPlaceholder`, `searchClear`, `searchResults`
(`{count, plural, one {# post matches} other {# posts match}} "{query}"`),
`searchNoResults`. The no-results link reuses `allTags`.

## 4. Acceptance criteria

- [ ] `GetBlogSearchIndex` exists, is exported from `@repo/application/blog`,
      returns published posts only with plain-text bodies, and has unit tests.
- [ ] `/{locale}/blog/search-index.json` is prerendered for every locale and
      contains `{ slug, text }` per published post, with no Markdown syntax or
      fenced code in `text`.
- [ ] Typing on `/blog` replaces the listing sections with ranked results;
      clearing restores the original listing. `?q=` survives opening a result
      and going back.
- [ ] Matching is case- and accent-insensitive; a body-only match shows an
      excerpt with the terms marked; a title-only match shows no excerpt.
- [ ] The index is not requested until the box is focused or `?q=` is present.
- [ ] Results count is announced (`aria-live`); the box is labelled and
      keyboard-operable; `Esc` clears.
- [ ] `PostCard` renders unchanged everywhere it's used without `excerpt`.
- [ ] New i18n keys exist in all three locales (`messages.test.ts` green).
- [ ] No `'use client'` file imports `@repo/application` (checked by grep: no
      lint rule enforces it today, §8). No change to `packages/core` or
      `packages/infra`. No new dependency. No file over 200 lines.
- [ ] `pnpm --filter @repo/application test`, `pnpm --filter @repo/utils test`,
      `pnpm --filter site test`, `pnpm -w lint`, `pnpm -w types` green.
- [ ] `pnpm --filter site build` succeeds with the listing still static, plus 3
      `search-index.json` files. Checked in the browser in both themes and two
      locales (§6 Manual).

## 5. Files

**Create**

- `packages/application/src/blog/use-cases/{GetBlogSearchIndex,plain-text}.ts`
- `packages/application/src/blog/dtos/BlogSearchEntryDTO.ts`
- `packages/utils/src/text/{foldForSearch,excerptAround,index}.ts`
- `apps/site/src/app/[locale]/blog/search-index.json/route.ts`
- `apps/site/src/features/blog/search/{parseQuery,rankPosts,bodyExcerpt}.ts`
- `apps/site/src/features/blog/BlogSearch/index.tsx` (the island + context)
- `apps/site/src/features/blog/SearchExcerpt/index.tsx`
- Tests:
  - `packages/application/test/blog/{GetBlogSearchIndex,plain-text}.test.ts`
  - `packages/utils/test/node/text/{foldForSearch,excerptAround}.test.ts`
  - `apps/site/tests/features/blog/search/{parseQuery,rankPosts,bodyExcerpt}.test.ts`
  - `apps/site/tests/features/blog/{BlogSearch,SearchExcerpt}/*.test.tsx`
  - `apps/site/tests/app/[locale]/blog/search-index.json/route.test.ts`

**Update**

- `packages/application/src/blog/{use-cases/index.ts,dtos/index.ts}`
- `packages/utils/package.json` (`./text` export)
- `apps/site/src/app/[locale]/blog/page.tsx`
- `apps/site/src/features/blog/{paths.ts,PostCard/index.tsx}`
- `apps/site/messages/{en-US,pt-BR,es}.json`
- Tests: `apps/site/tests/app/[locale]/blog/page.test.tsx`, `paths.test.ts`,
  `PostCard` tests.

## 6. Test plan

**Application (in-memory repository, the shared `BlogPostBuilder`)**

- `plain-text`: should drop fenced code when the body has a fence; should keep
  link text and drop the URL when the body has a link; should keep inline code
  text without backticks; should strip heading, list, quote and emphasis
  markers; should collapse whitespace.
- `GetBlogSearchIndex`: should list published posts only, newest first, in the
  requested locale; should return `FETCH_FAILED` when the repository throws.

**Utils**

- `foldForSearch`: should remove diacritics and lowercase when given
  Portuguese/Spanish text; should keep the input length when any character
  folds to more than one.
- `excerptAround`: should cut on word boundaries with ellipses when the match
  is mid-text; should not add a leading ellipsis when the match is at the
  start; should report the excerpt offset.

**Site**

- `parseQuery`: should drop terms under 2 characters; should return no terms
  for blank input.
- `rankPosts`: should rank title over tags over description over body; should
  require every term; should keep newest-first on ties; should match card
  fields only when bodies are empty.
- `bodyExcerpt`: should mark every term occurrence inside the excerpt; should
  return `null` when the body lacks every term.
- `BlogSearch` (fetch mocked at the network boundary): should render the
  listing children when the query is empty; should show ranked results and the
  count when typing; should fetch the index once on first focus; should keep
  card-field results when the fetch fails; should clear on `Esc`.
- Route: should return the locale's entries as JSON.
- Page integration (in-memory repository): the prerendered output is the full
  listing; the search box is present and labelled.

**Manual**

- `pnpm --filter site build && next start`, both themes, `en-US` + `pt-BR`:
  search a title word, a tag, a body-only word (excerpt + marks), an accented
  word typed without accents, a two-word query, a no-results query (tags
  link); open a result and go back (query kept); `Esc` and the clear button;
  Network tab shows `search-index.json` only after focus; Tab through the box
  and results for the focus ring; a narrow mobile viewport.

## 7. Operational notes

- No migration, no seed change, no new dependency.
- Build output grows by 3 static JSON files. At the current 8 posts the index
  is under 60 KB per locale before compression (the whole seed, all three
  locales with Markdown and code, is 172 KB).
- The index is rebuilt with the site, like every other blog page; a new post is
  searchable after the same rebuild that publishes it.

## 8. Decisions (resolved during scoping)

- **Simple first, grow on evidence.** A hand-written filter over a static index
  instead of Pagefind or FlexSearch. Move to one of them when any of these is
  true: more than ~50 published posts, the index above ~150 KB gzipped per
  locale, or a real need for fuzzy matching or stemming. Pagefind fits the
  static build best; FlexSearch fits if the index must stay in our own JSON.
- **Option A: search takes over the page.** A reader who searches knows what
  they want; the featured band and tags become noise between them and the
  results. Filtering only "All posts" (B) left results below the fold on
  mobile. Keeping trending tags beside the box (C) made links look like search
  filters; the topic path survives in the no-results state instead.
- **Body text included.** The body is where most of the value is, and at this
  size it costs less than one cover image, loaded only on demand.
- **Excerpt included, first to go.** It's a small pure function over text the
  browser already has. If it turns out costly during implementation, it is the
  first thing cut.
- **Fenced code excluded from the index.** Code makes excerpts unreadable and
  identifiers in prose and inline code are still searchable. Revisit if readers
  search for API names that appear only in fences.
- **Plain-text conversion in `application`, not reusing the rendering
  pipeline.** The pipeline lives in `@repo/ui` (rehype/React), which
  `application` can't depend on. A regex heuristic matches how reading time is
  already computed.
- **Index carries `{ slug, text }` only.** Card fields already reach the page;
  duplicating them would double the payload and risk drift.
- **Query in the URL (`?q=`), read on the client.** Keeps the back button
  working without making the page dynamic. (Claude's call during scoping.)
- **AND across terms, minimum 2 characters per term.** Narrowing as you type
  is what readers expect; single letters match everything. (Claude's call.)
- **A cold load of `/blog?q=term` briefly shows the full listing** before the
  island swaps in results. Accepted: it only happens on a shared or reloaded
  search URL (back navigation restores client state), and hiding the listing
  until hydration would cost the no-JS reader the page. (Claude's call.)
- **No lint rule in this PRD for the client/application boundary.** CLAUDE.md
  says ESLint enforces it, but `packages/eslint-config/restricted-imports.js`
  only bans `/src` paths and `@repo/core/testing`. That gap predates 5C and
  touches every app, so it goes to its own issue; here the check is a grep.
  (Claude's call.)
- **Slice order for `parse-prd`:**
  (a) `toPlainText` + `GetBlogSearchIndex` + `BlogSearchEntryDTO` +
  `blogSearchIndexPath()` + the `search-index.json` route (R1–R3) →
  (b) `@repo/utils/text`: `foldForSearch` + `excerptAround` (R4) →
  (c) `parseQuery` + `rankPosts` + `bodyExcerpt` (R5) →
  (d) `PostCard` `excerpt` slot + `BlogSearch` island (`QuerySync`, context,
  lazy fetch) + `SearchExcerpt` + listing page + i18n (R6, R7) →
  (e) final integration: build, manual checks in both themes and locales.
  (a), (b) and (c) don't depend on each other; (d) needs all three.
