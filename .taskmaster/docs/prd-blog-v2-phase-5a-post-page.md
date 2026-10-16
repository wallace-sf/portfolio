# Blog v2 — Phase 5A: Post page presentation (`apps/site`, `packages/application`, `packages/ui`, `packages/seo`)

> Status: proposed — pending review.
> Parent design: [2026-09-01-blog-v2-phase-0-design.md](../../docs/superpowers/specs/2026-09-01-blog-v2-phase-0-design.md) §4, §8.
> Feature source: [BLOG-V2-FEATURE-CURATION.md](../../docs/BLOG-V2-FEATURE-CURATION.md) § "Adopt in Blog v2 core".
> Depends on **PRD 4** (Routes + archive): tag `blog-v2-phase-4`, all merged, and the
> **Phase 5 prep** (tag `blog-v2-phase-5-prep`: #1163, #1166, #1169), all merged.
> Absorbs **#1063** (dual light/dark syntax-highlighting themes).
> Tracked by #1173.
> Related: [02-ARCHITECTURE.md](../../docs/02-ARCHITECTURE.md), [07-I18N.md](../../docs/07-I18N.md), [08-TESTING.md](../../docs/08-TESTING.md).

## Goal

Make the post page read like a finished technical article. A reader sees how
long the post takes to read, who wrote it, when it was published and last
updated, and where they are in it: an "On this page" table of contents that
highlights the current section, and a reading progress bar. Code blocks follow
the site's light/dark theme and can mark added and removed lines. Search engines
get a `BlogPosting` JSON-LD node and `article:*` OpenGraph tags.

This is the first of three Phase 5 PRDs (5A post page, 5B discovery, 5C search;
see §8).

## 1. Scope

**In scope**

- **Reading time**: derived from the localized Markdown body, exposed on
  `BlogPostSummaryDTO`, shown on the post page and on `PostCard`.
- **Metadata grid** on the post header: published date, updated date (when
  present), reading time, tags.
- **Author byline**: avatar, name (linked when `author.url` exists) and bio
  (when present) on the post page.
- **Heading anchors**: stable `id`s on `h2`–`h3` from the shared Markdown
  pipeline, plus a heading extractor in `@repo/ui`.
- **Table of contents with scrollspy**: nested h2/h3. It is a sticky rail on
  wide screens and a collapsible block above the body on narrow ones.
- **Reading progress bar**: a client island tied to the article element.
- **Code blocks** (absorbs #1063): dual `github-light` / `github-dark` Shiki
  themes keyed to the site theme class, `// [!code ++]` / `// [!code --]` diff
  notation, and `{1,3-4}` line highlighting.
- **SEO**: `buildBlogPostingJsonLd` in `@repo/seo`, and
  `article:published_time` / `modified_time` / `author` / `tag` OpenGraph fields.

**Out of scope**

- Tags pages, trending tags, count badges, related posts, featured band,
  prev/next polish, archive navigation on the listing (**PRD 5B**).
- Search (**PRD 5C**).
- Mermaid diagram theming. Diagrams keep their fixed dark surface (#1169).
- Copy-to-clipboard on code blocks, code-block titles/captions, and line numbers.
  The pipeline supports them, but none of the 4 seeded posts needs them.
- Fixing the first-paint theme flash. The theme class is applied in a client
  effect (`useTheme`) today, and that is a site-wide concern. Code blocks follow
  the same "dark unless `.light`" convention as `.markdown-body`, so they add
  **no new** flash (see §2).
- Any change to `packages/core` or `packages/infra` (no migration, no seed change).

## 2. Design constraints

- **Dependency rule**: reading time is computed in `packages/application`,
  which depends only on `@repo/core`. Pages are Server Components that call use
  cases. `TableOfContents` and `ReadingProgress` are `'use client'` and receive
  plain props only; they never import `@repo/application`.
- **One Markdown pipeline.** Heading ids and the TOC come from the **same**
  unified processor in `packages/ui/src/View/Markdown/pipeline.ts`, so a TOC
  link can never point at an id the body doesn't have. Ids are added after
  `rehype-sanitize`, as a trusted transform. Before sanitization, the
  sanitizer's clobber prefix would turn them into `user-content-*`.
- **Shared component, shared effect.** `Markdown` also renders project and
  "about" content. Heading ids and dual code themes therefore apply there too.
  That is intended: `.markdown-body` is the single typography (#1169). Both
  must stay visually identical in dark mode on those pages.
- **Theme convention**: dark is the default (no class). `.light` on `<html>`
  switches to light. This matches `packages/ui/globals.css`. The code-block CSS
  sits next to the `.markdown-body` overrides in `packages/ui/globals.css` as
  plain CSS. It does not go in a Tailwind `@apply` block, because `@apply` doesn't
  cross CSS files in this Turbopack setup (#1063).
- **`@repo/seo` stays framework-agnostic** and depends only on `@repo/core`.
  `buildBlogPostingJsonLd` takes absolute URLs and plain strings.
- **Accessibility**: the TOC is a `<nav aria-label>` and the active link
  carries `aria-current="location"`. The progress bar is decorative
  (`aria-hidden`), because the browser scrollbar already conveys position. All
  motion respects `prefers-reduced-motion`.
- **No new runtime services.** Everything is computed at build (SSG). The two
  client islands use only `IntersectionObserver` and `scroll` / `resize`
  listeners (passive, rAF-throttled).
- Files stay under 200 lines. Test naming is `should <expected behavior> when <context>`.
  Page tests mock only real boundaries (`getServerContainer`, `next/image`,
  `next-intl/server`, `next/navigation`).

## 3. Requirements

### R1 — Reading time (application)

`packages/application/src/blog/use-cases/reading-time.ts`:

```ts
/** Whole minutes to read `markdown` at 200 wpm; at least 1. */
export function readingMinutes(markdown: string): number;
```

- Words are counted over the Markdown source after stripping syntax noise:
  fence markers, inline-code backticks, link/image URLs (the link text is
  kept), heading `#`s, emphasis markers. **Code inside fences counts**, because
  readers do read it, and it keeps the function simple and predictable.
- `Math.max(1, Math.ceil(words / 200))`. The `200` is a named constant.
- `BlogPostSummaryDTO` gains `readingMinutes: number`, filled by
  `toBlogPostSummaryDTO` from `post.content.get(locale)`. The detail DTO extends
  the summary, so it inherits the field. Every summary-returning use case
  (`ListBlogPosts`, `ListBlogArchive`, `GetBlogPostBySlug`) gets it for free.

### R2 — Metadata grid and author byline (site)

- `PostHeader` renders a metadata row under the description: published date ·
  "Updated {date}" (only when `updatedAt` is present and differs from the published
  calendar day) · reading time · tags. Dates use `<time dateTime>`.
- `PostCard` adds the reading time next to the date ("Sep 4, 2026 · 6 min read").
- New `features/blog/AuthorByline`: avatar (`next/image`, 40px, rounded), the
  name (an external link with `rel="author noopener"` when `url` exists), and the bio
  when present. It sits at the end of the article, before `PrevNextNav`. The
  header shows only "By {name}" in the metadata row.
- `next.config` `images.remotePatterns` gains `github.com` and
  `avatars.githubusercontent.com` (the seeded `avatarUrl` is
  `https://github.com/wallace-sf.png`, which redirects to the latter).
- i18n (`Blog.*`, all three locales): `readingTime`
  (`{minutes, plural, one {# min read} other {# min read}}`), `updatedOn`
  (`Updated {date}`), `byAuthor` (`By {name}`), `aboutAuthor`,
  `tableOfContents` (`On this page`).

### R3 — Heading ids and extractor (`@repo/ui`)

- `pipeline.ts`: add `rehype-slug` **after** `rehype-sanitize` (next to the
  other trusted transforms). Duplicate headings get `-1`, `-2` suffixes (github-slugger).
- New export from `@repo/ui/View`:

  ```ts
  export type MarkdownHeading = { id: string; text: string; depth: 2 | 3 };
  /** h2/h3 headings of `markdown`, in document order, with the ids the body renders. */
  export async function markdownHeadings(markdown: string): Promise<MarkdownHeading[]>;
  ```

  It walks the HAST produced by `markdownToHast`, so the ids are identical to
  the rendered ones. `text` is the heading's text content (inline code and
  emphasis flattened).
- `markdownToHast` is wrapped in React `cache()` so the page's `Markdown` and
  `markdownHeadings` calls run the pipeline once per content string.
- `.markdown-body h2, h3` get `scroll-margin-top` equal to the sticky header
  height, so anchor jumps don't hide the heading.

### R4 — Table of contents with scrollspy (site)

- New `features/blog/TableOfContents` (`'use client'`), props
  `{ headings: MarkdownHeading[]; label: string }`.
- h3 entries nest under the preceding h2. An h3 with no preceding h2 is shown at
  the top level.
- **Scrollspy**: one `IntersectionObserver` over the heading elements
  (`rootMargin` offsets the sticky header). The active item is the last heading
  whose top has crossed the offset. Before the first heading, nothing is active.
- **Layout**: at `xl` and wider, the post page becomes a two-column grid: the
  article (unchanged `max-w-3xl`) and a sticky TOC rail on the right. Below
  `xl`, a `<details>` "On this page" block sits between the header and the body,
  closed by default.
- Rendered only when the post has **≥ 3** h2/h3 headings. For shorter posts a
  TOC is noise.
- Clicking an entry uses the native anchor jump (`href="#id"`), which preserves
  history and works without JS. Smooth scrolling comes from CSS
  `scroll-behavior` and is disabled under reduced motion.

### R5 — Reading progress bar (site)

- New `features/blog/ReadingProgress` (`'use client'`), props
  `{ targetId: string }`. A fixed 2–3px bar at the top of the viewport,
  `bg-brand-primary` (a design token), whose width is the share of the **article** (not
  the document) scrolled past. It is 0 above the article and 100% at its end.
- Updates use a `scroll` + `resize` listener (passive, rAF-throttled) and set
  `transform: scaleX()`, never `width`, to avoid layout work.
- `aria-hidden="true"`. No transition under `prefers-reduced-motion`.

### R6 — Code blocks: dual theme + diff/highlight (`@repo/ui`, absorbs #1063)

- `rehype-pretty-code` options:
  `theme: { dark: 'github-dark', light: 'github-light' }`, `keepBackground: true`,
  `transformers: [transformerNotationDiff()]` from `@shikijs/transformers`
  (pinned to the same major/minor as the installed `shiki`, 1.29.x).
- CSS in `packages/ui/globals.css`:
  - default (dark): token `color` / block `background-color` from the dark
    variables;
  - `.light [data-rehype-pretty-code-figure] …` → the light variables;
  - `.diff.add` / `.diff.remove` lines: green/red tinted background plus a `+`
    / `−` gutter marker. Derive the colours from the GitHub palette variables
    already in `markdown-theme.css` (`--fgColor-success` / `--fgColor-danger`,
    `--borderColor-success-emphasis` / `--borderColor-danger-emphasis`,
    `--bgColor-danger-muted`). They already switch with the theme, so no
    separate light/dark set is needed;
  - `[data-highlighted-line]`: a subtle background, also with a light and a dark set.

  Verify the exact variable names emitted by the installed `rehype-pretty-code`
  version (`--shiki-dark` / `--shiki-light` and their `-bg` siblings) and
  record them in a CSS comment.
- Inline code (`:not(pre) > code`) keeps the `.markdown-body` styling and is
  re-checked against both block backgrounds.
- **Mermaid** blocks keep their enforced dark surface. The new rules must not
  match `[data-mermaid]`.
- `packages/ui/README` (or the design-system doc touched in #1166/#1169)
  documents the author syntax: ` ```ts {2,4-5} `, `// [!code ++]`,
  `// [!code --]`.

### R7 — `BlogPosting` JSON-LD and OpenGraph article fields

`packages/seo/src/blogPosting.ts`:

```ts
export interface IBlogPostingInput {
  url: string;              // absolute
  headline: string;
  description: string;
  datePublished: string;    // ISO
  dateModified?: string;    // ISO
  author: { name: string; url?: string; image?: string };
  image?: string;           // absolute
  keywords: string[];
  inLanguage: string;       // BCP 47, e.g. 'pt-BR'
}
export function buildBlogPostingJsonLd(input: IBlogPostingInput): IBlogPostingNode;
```

- `@type: 'BlogPosting'` plus `mainEntityOfPage: { '@type': 'WebPage', '@id': url }`.
  `dateModified` falls back to `datePublished`. `keywords` is joined with `, `.
  `image` is omitted when absent. Exported from `@repo/seo`.
- The post page renders it through the existing `JsonLd` component, next to
  the `BreadcrumbList` node. `image` is the cover image when present, otherwise
  the post's `opengraph-image` URL.
- `generateMetadata` adds `openGraph.publishedTime`, `modifiedTime`,
  `authors: [author.url ?? author.name]` and `tags`. Next.js renders these as
  `article:*`.

## 4. Acceptance criteria

- [ ] Every post card and post header shows a reading time. `readingMinutes` is
      ≥ 1, rounds up at 200 wpm, and is computed per locale.
- [ ] The post header shows date, "Updated …" (only when it applies), byline
      name and reading time. Tags still render. The author block (avatar, name,
      bio) appears before prev/next.
- [ ] `h2`/`h3` in rendered Markdown carry ids. `markdownHeadings` returns the
      same ids. Project and about pages are otherwise visually unchanged in
      dark mode.
- [ ] Posts with ≥ 3 headings show the TOC: a sticky rail at `xl`, a collapsible
      block below `xl`. The active entry follows the scroll position, and anchor
      jumps don't hide headings under the sticky header.
- [ ] The progress bar goes from 0 to 100% across the article, is
      `aria-hidden`, and has no animation under reduced motion.
- [ ] Code blocks use `github-light` under `.light` and `github-dark` otherwise,
      and switch live with the theme toggle (no reload). `[!code ++]` / `[!code --]`
      lines render as added/removed, and `{n}` meta highlights lines. Mermaid is
      unaffected. #1063's acceptance criteria are met.
- [ ] Post pages emit a valid `BlogPosting` JSON-LD node (it passes the Rich
      Results test) and `article:*` OpenGraph tags.
- [ ] New i18n keys exist in `en-US`, `pt-BR` and `es` (`messages.test.ts` green).
- [ ] No `'use client'` file imports `@repo/application`. `@repo/seo` still
      depends only on `@repo/core`.
- [ ] `pnpm --filter @repo/application test`, `pnpm --filter @repo/ui test`,
      `pnpm --filter @repo/seo test`, `pnpm --filter @repo/site test`,
      `pnpm -w lint`, `pnpm -w types` green.
- [ ] `pnpm --filter @repo/site build` prerenders all pages. Checked in the
      browser in both themes and two locales: a post (TOC, scrollspy, progress,
      code blocks, byline), a project page with code/mermaid, and `/about`.
- [ ] No file over 200 lines. No change to `packages/core` / `packages/infra`.
- [ ] #1063 closed by the PR that ships R6.

## 5. Files

**Create**

- `packages/application/src/blog/use-cases/reading-time.ts`
- `packages/ui/src/View/Markdown/headings.ts`
- `packages/seo/src/blogPosting.ts`
- `apps/site/src/features/blog/{AuthorByline,TableOfContents,ReadingProgress}/index.tsx`
- `apps/site/src/features/blog/PostMeta/index.tsx` (the metadata row; keeps
  `PostHeader` under 200 lines and is reused by `PostCard`)
- Tests: `packages/application/test/blog/reading-time.test.ts`,
  `packages/ui/test/View/Markdown/{headings,pipeline}.test.ts`,
  `packages/seo/test/blogPosting.test.ts`,
  `apps/site/tests/features/blog/{AuthorByline,TableOfContents,ReadingProgress,PostMeta}/*.test.tsx`

**Update**

- `packages/application/src/blog/{dtos/BlogPostSummaryDTO,use-cases/to-summary-dto}.ts`
  (+ use-case tests asserting `readingMinutes`)
- `packages/ui/src/View/Markdown/{pipeline.ts,index.tsx}`, `packages/ui/src/View/index.ts`,
  `packages/ui/globals.css`, `packages/ui/package.json` (`rehype-slug`,
  `@shikijs/transformers`)
- `packages/seo/src/index.ts`
- `apps/site/src/app/[locale]/blog/[year]/[month]/[slug]/page.tsx`
- `apps/site/src/features/blog/{PostHeader,PostCard}/index.tsx`
- `apps/site/next.config.ts`, `apps/site/messages/{en-US,pt-BR,es}.json`
- `apps/site/tests/app/[locale]/blog/[year]/[month]/[slug]/page.test.tsx`
- `apps/site/tests/features/blog/{PostHeader,PostCard}/*.test.tsx`

## 6. Test plan

**`readingMinutes` (application)**

- should return 1 when the body is empty or very short
- should round up at 200 words per minute when the body has 201 words
- should count the link text but not the URL when the body has links
- should count words inside fenced code when the body has code blocks
- should differ per locale when the localized bodies differ in length
  (through `toBlogPostSummaryDTO`)

**Markdown pipeline / `markdownHeadings` (ui)**

- should add slug ids to h2 and h3 when content has headings
- should suffix duplicate heading ids when two headings share text
- should return headings in document order with the rendered ids
- should not prefix ids with `user-content-` (slug runs after sanitize)
- should emit both theme variables on tokens when a fenced block is rendered
- should mark diff lines when the fence uses `[!code ++]` / `[!code --]`
- should still turn mermaid fences into the client island

**`buildBlogPostingJsonLd` (seo)**

- should fall back `dateModified` to `datePublished` when absent
- should omit `image` when absent and join `keywords`

**Site components**

- `PostMeta`: shows "Updated" only when `updatedAt` is on a later day; localized
  reading time
- `AuthorByline`: links the name only when `url` exists; renders bio when present
- `TableOfContents`: nests h3 under h2; renders nothing below 3 headings; marks
  the intersecting heading `aria-current` (stub `IntersectionObserver`)
- `ReadingProgress`: 0 above the article, 1 at its end (stubbed geometry)
- Post page integration test (in-memory repository): reading time, byline,
  TOC entries matching body ids, `BlogPosting` JSON-LD content

**Manual**

- `pnpm --filter @repo/site build && pnpm --filter @repo/site start`, then in
  both themes and in `en-US` + `pt-BR`: scroll a long post and watch the TOC
  highlight and progress bar; toggle the theme on a code block; open
  `/projects/personal-portfolio` (mermaid + code) and `/about`, and compare with
  production in dark mode; run the Rich Results test on a post's JSON-LD.

## 7. Operational notes

- No migration and no seed change. New dependencies: `rehype-slug` and
  `@shikijs/transformers` (in `@repo/ui`).
- Adding the GitHub avatar host to `remotePatterns` needs a rebuild only.

## 8. Decisions (resolved during scoping)

- **Phase 5 split into 5A / 5B / 5C.** This departs from Phase 0 §8, which
  planned one Presentation PRD. The full list (~13 features) is about three times
  Phase 4, so it would make one long-lived tag. The split follows the page each
  feature lives on: 5A is the post page, 5B is discovery across posts (tags,
  related, featured, archive nav, which need new use cases), and 5C is search
  (a tooling choice that changes the build). Each ships on its own.
- **Reading time in `application`, not `core`.** It's a presentation estimate
  (a words-per-minute heuristic), not a business invariant, and Phase 0
  decision 7 keeps it derived, not stored. Putting it in the DTO mapper means
  every summary use case gets it without a new use case.
- **Code inside fences counts toward reading time.** Excluding it under-reports
  code-heavy posts. A uniform count is simpler and close enough.
- **TOC derived from the rendering pipeline, not from the DTO.** Slug ids are a
  rendering detail. Computing them in `application` would duplicate the slugger,
  and the two could drift. `markdownHeadings` reuses the cached HAST.
- **TOC threshold of 3 headings** and a `<details>` fallback below `xl`, rather
  than a floating button. It needs no JS, reads well on mobile, and adds no new
  overlay UI.
- **Dark-by-default code CSS** to match `.markdown-body`. The first-paint theme
  flash predates this PRD and affects the whole site, so it stays out of scope.
- **Mermaid stays dark-only.** Re-theming diagrams on toggle means re-rendering
  the client island, which is out of scope here.
- **Slice order for `parse-prd`:**
  (a) `readingMinutes` + DTO field + `PostMeta` on header and card + i18n keys →
  (b) `AuthorByline` + updated date + `remotePatterns` + `buildBlogPostingJsonLd`
  + OpenGraph article fields →
  (c) `rehype-slug` + `markdownHeadings` + `cache()` + `TableOfContents` with
  scrollspy + two-column post layout →
  (d) dual Shiki themes + diff/highlight transformers + CSS + author-syntax docs
  (closes #1063) →
  (e) `ReadingProgress` + post-page integration test + manual browser check in
  both themes + AC checklist.
