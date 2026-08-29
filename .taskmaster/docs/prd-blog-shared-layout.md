# Blog/Site Shared Layout & Cross-Zone Integration

> Status: sections 1–6 largely delivered (tasks 1–5, 8, 9). Sections 7–9 added 2026-08-29
> to scope the blog's visual layout (task 6 and follow-ups).
> Related: [prd-blog-mdx-design.md](./prd-blog-mdx-design.md), [02-ARCHITECTURE.md](../../docs/02-ARCHITECTURE.md).
> Precedent: `packages/seo` (issue #960, PR #961) — framework-agnostic logic extracted once a
> second app needed it, depending only on `@repo/core`.

## Goal

`apps/blog` is deployed as an independent Vercel multi-zone app (issue #982/#988), reachable at
`wallace-ferreira.dev/blog`. Today it only reuses `packages/ui` primitives — it has no shared
header/nav/footer with `apps/site`, no shared SEO/OG tooling, no analytics, and no strategy for
preserving locale when a user crosses between the two zones. This PRD scopes the work to make the
blog visually and functionally feel like part of the same site, without adopting a runtime
composition model (Module Federation) that this project does not need — multi-zone (HTTP-level
routing composition) remains the chosen architecture; see discussion log for the comparison.

## 1. Scope

**In scope now:**

- Shared presentational layout package (`packages/layout`) exposing `<SiteHeader>`,
  `<SiteFooter>`, and any shared nav primitives, consumed by both `apps/site` and `apps/blog`.
- A typed helper for building cross-zone links that preserves the current locale
  (`buildCrossZoneHref` or equivalent) — used anywhere a nav/footer link points from one zone to
  the other.
- Reuse of `packages/seo`'s `createSeoBuilders` in `apps/blog` for canonical/hreflang/OpenGraph,
  parameterized the same way `apps/site` already does it.
- A per-post dynamic OG image route for `apps/blog`, sharing the rendering approach used by
  `apps/site/src/app/og/route.tsx` (evaluate extracting the shared rendering logic into
  `packages/seo` if the two implementations would otherwise diverge).
- Google Analytics (`@next/third-parties/google`) wired into `apps/blog`'s layout, reusing the
  **same GA4 property** as `apps/site` (unified funnel — see Decisions below).
- Extraction of the security headers array (`SECURITY_HEADERS` in `apps/blog/next.config.mjs`,
  and its `apps/site` equivalent) into a single shared source, so the two configs cannot silently
  diverge.

**Explicitly out of scope (tracked separately or deferred):**

- Module Federation or any client-side runtime composition — evaluated and rejected; multi-zone
  (HTTP-level composition) is sufficient since neither app needs to embed live components from
  the other inside the same page.
- Cookie-based cross-zone locale sync (e.g. widening `NEXT_LOCALE`'s cookie `Path`) — rejected as
  a strategy; it couples the two apps through shared cookie state instead of explicit, typed URLs.
- Sitemap aggregation strategy (whether `apps/site`'s `sitemap.xml` references `apps/blog`'s, or
  they stay fully isolated) — open question, needs a decision before implementation (see below).
- ~~Full design-system pass on the blog's own visual identity beyond the shared header/footer.~~
  **Partially pulled in-scope** by section 7 below: the blog gets a coherent layout skeleton +
  a first visual pass on its listing/post pages, using our existing design tokens. A deeper
  design-system pass (bespoke components, motion, etc.) is still deferred.

## 2. Problem: locale loss across zone boundaries

Each zone resolves locale independently: `apps/site` sets `NEXT_LOCALE` scoped to `Path=/`,
`apps/blog` scopes it to `Path=/blog` (its `basePath`). These cookies are never shared. A link
from the site's footer to `/blog` (no locale segment) lands the user on the blog's **default**
locale, silently dropping whatever language they were reading in — this is not a hypothetical,
it reproduces today with a plain `<a href="/blog">`.

**Decision:** every cross-zone link must be built with the current locale explicitly in the path
(`/blog/${locale}` from the site, `/${locale}` — or the site's root — from the blog), computed by
the linking app, not inferred from cookies. A shared, typed helper centralizes the URL-building
rule so it isn't reimplemented ad hoc in every place a cross-zone link appears.

## 3. Architecture

- **`packages/layout`** (new) — presentational only, no `@repo/application` imports (client
  components in either app must not import it if it does). Receives nav items, active path, and
  locale as props; renders `<SiteHeader>`/`<SiteFooter>`. `apps/site`'s existing
  `apps/site/src/components/Layout/Header/index.tsx` is **moved** here, not duplicated —
  `apps/site` is refactored to consume the shared component.
- **Cross-zone href helper** — lives in `packages/utils` (or `packages/layout` if it turns out to
  be layout-specific rather than general-purpose; decide during implementation). Signature
  roughly: `buildCrossZoneHref(targetZone: 'site' | 'blog', locale: Locale, path: string): string`.
  Each app supplies its own nav list to `<SiteNav>` using this helper for any link leaving its own
  zone.
- **`packages/seo`** — extended usage only; `apps/blog` adopts `createSeoBuilders` the same way
  `apps/site` does. If the OG image rendering logic would otherwise be duplicated near-verbatim
  between `apps/site/src/app/og/route.tsx` and a new `apps/blog/src/app/[locale]/[slug]/opengraph-image.tsx`,
  extract the shared JSX/rendering helper into `packages/seo` at that point (per the
  cross-app-reuse rule in `CLAUDE.md`) — do not duplicate first and extract later.
- **Security headers** — a single exported `SECURITY_HEADERS` (or a small `packages/config`
  export) consumed by both `next.config.mjs` files, instead of two independently maintained arrays.

## 4. Decisions already made (from architecture discussion)

- **Multi-zone stays** — rejected Module Federation; no runtime composition need exists today,
  and Next.js App Router/RSC doesn't pair well with Module Federation regardless.
- **Same GA4 property** for `apps/site` and `apps/blog` — blog traffic is part of the same
  perceived brand/domain; unify the funnel rather than fragment analytics.
- **No cookie-based locale sync** — explicit locale-in-path on every cross-zone link instead.

## 5. Open questions (resolve before/while parsing into tasks)

- Sitemap strategy: does `apps/site/sitemap.xml` reference `apps/blog`'s posts, or do the two stay
  fully independent?
- Exact location of the cross-zone href helper: `packages/utils` vs. `packages/layout`.
- Does `<SiteNav>` need to be aware of which zone it's currently rendered in (to skip rendering a
  "you are here" link back to the same zone), or is that left to each app's nav-item list?

## 6. Testing

- `packages/layout`: component tests for `<SiteHeader>`/`<SiteFooter>` (render nav items, active
  state highlighting) — no fetch, no framework beyond React, mirrors `packages/ui` conventions.
- Cross-zone href helper: unit tests covering locale preservation for every `(targetZone, locale)`
  combination, and rejecting/handling an unknown locale.
- `apps/blog`: `generateMetadata`/OG route tests mirroring the pattern already used in
  `apps/site`'s SEO tests (`tests/lib/seo/*`).
- Manual/browser verification: navigate site → blog and blog → site in each of the three locales,
  confirm the locale is preserved every time (this is the concrete regression this PRD exists to
  prevent).

---

## 7. Blog visual layout — Chirpy-informed skeleton

> Added 2026-08-29. Resolves the deferred task 6 by fixing the blog's chrome and giving its
> listing/post pages a coherent first visual pass. Depends on the shared `packages/layout`
> (`SiteHeader`/`SiteFooter`, tasks 2–3), `buildCrossZoneHref` (task 4), and the headless `Nav`
> primitives extracted to `@repo/ui/Control` (issue #1006). The `SiteHeader` logo link was made
> zone-correct in issue #1014.

### 7.1 Design decision

Adopt the **layout skeleton** of the Chirpy Jekyll theme (used by e.g. Loiane Groner's blog):
persistent **left sidebar** on desktop / **drawer** on mobile, a single **content column**, and
an optional **right TOC rail** on post pages. Rendered entirely in our own visual identity and
existing design tokens — this is a structural template, not a re-skin, and **not** an adoption of
Chirpy's feature set (see 7.6). What the blog already has (SSG listing/detail pages, RSS, per-post
OG images, MDX rendering) is kept; only its presentation changes.

### 7.2 `BlogLayout` shell

- New `apps/blog/src/components/Layout/BlogLayout.tsx` (client component — owns the mobile
  drawer open/close state, same as `apps/site`'s `SideNavigation`).
- Composes `@repo/layout`'s `SiteHeader` (logo → portfolio home via its internal
  `buildCrossZoneHref('site', locale)`) + a blog `SideNavigation` (7.3) + `SiteFooter`.
- Chirpy arrangement: sidebar fixed on `lg+`, off-canvas drawer below `lg` toggled by the header
  hamburger; content column with a comfortable max reading width.
- Wired into `apps/blog/src/app/[locale]/layout.tsx`, wrapping `children` inside the existing
  `NextIntlClientProvider`. `locale` comes from the awaited `params` and is passed down as a prop.

### 7.3 Blog `SideNavigation` (hybrid nav)

Assembled in `apps/blog` (only the `Nav.*` primitives are shared — the assembled component is
app-local, mirroring `apps/site`). Nav model **(c) hybrid**:

- **Portfolio** section — cross-zone via `buildCrossZoneHref('site', locale)`: Home, Projects,
  About, Resume. Never marked active (different zone).
- **Blog** section — Blog Home (`buildCrossZoneHref('blog', locale)` / local `/`), marked active
  on the listing route. Tag/Archive entries are added here later (7.6), not now.
- **Social** — LinkedIn, GitHub, RSS (`/${locale}/rss.xml`), all `external`.
- **Theme toggle** + **Language selector** — same UX as `apps/site`; the selector logic
  (`next-intl` routing, theme hook) stays app-local, only the `Nav.Expandable` shell is shared.

### 7.4 Styled listing + post pages

- **Listing** (`app/[locale]/page.tsx`): replace the bare `<ul>` with a Chirpy-style post list —
  cards showing **thumbnail** (7.5), title, published date (locale-formatted), description, and
  tag badges. Links use the locale-aware `~/i18n/routing` `Link`.
- **Post** (`app/[locale]/[slug]/page.tsx`): **cover image** hero (7.5), styled post header
  (title, date, tags), MDX body with proper prose typography (headings, lists, blockquotes,
  inline code, and the existing `rehype-pretty-code` blocks), and **prev/next post** navigation
  at the foot (order comes from `ListBlogPosts`, already sorted by `publishedAt` desc).
- Typography/prose treatment uses existing `@repo/tailwind-config` tokens; no new token set.

### 7.5 Post imagery — align with `Project`

Blog posts currently carry only an optional bare `coverImage` URL string (`meta.json` →
`BlogPost.coverImage?: Url` → `BlogPostSummaryDTO.coverImage?: string`). Upgrade to match how
`Project` models imagery:

- **`coverImage`** and **`thumbnailImage`**, each `{ url, alt }` with a **localized** `alt`,
  using the shared-kernel `Image` VO (`@repo/core/shared`) — the same VO `Project` uses.
- **`packages/core`** — `BlogPost` entity: replace `coverImage?: Url` with `coverImage?: Image`,
  add `thumbnailImage?: Image`. Both optional (posts may ship without art).
- **`packages/infra`** — `MetaJsonSchema`: `coverImage` / `thumbnailImage` become
  `{ url: string; alt: LocalizedText }` (alt keyed by locale, consistent with `meta.json`
  already being the locale-agnostic file). `BlogPostMapper` maps them through `Image.create`.
- **`packages/application`** — `BlogPostSummaryDTO` gains `thumbnailImage?: { url; alt }`,
  `BlogPostDetailDTO` gains `coverImage?: { url; alt }` (alt already resolved to the request
  locale by the use case, same pattern as `Project` DTOs).
- **Storage** — reuse the existing Supabase `portfolio-images` bucket under `blog/<slug>/`
  (`cover.webp`, `thumbnail.webp`); `apps/blog/next.config.mjs` `images.remotePatterns` must allow
  `*.supabase.co` (mirror `apps/site`).
- **Content** — backfill the existing `the-either-pattern-in-typescript` post with a cover +
  thumbnail so the styled pages have real art to render.

### 7.6 Explicitly deferred (Chirpy features — separate future issues, NOT this scope)

Right-rail **table of contents** + scroll-spy · **tag pages** (`/tags/[tag]`) · **archives**
page · **search** · **read-time** estimate · **related posts** · **pagination** on the listing ·
**comments** (giscus/Disqus). Each becomes its own issue as the content model and need justify it.

---

## 8. Architecture notes for section 7

- **Dependency order** (per `docs/02-ARCHITECTURE.md` and the project's build order
  core → infra → application → app): the imagery change (7.5) lands bottom-up —
  `@repo/core` entity → `@repo/infra` schema/mapper → `@repo/application` DTOs → `apps/blog` UI.
  The layout shell (7.2–7.4) is `apps/blog`-only and can proceed in parallel once 7.5's DTO shape
  is settled.
- **No new shared package.** The blog `SideNavigation` is app-local; if `apps/blog` and
  `apps/site` nav assemblies later converge, revisit per the cross-app-reuse rule — not now.
- **`@repo/layout` stays presentational.** `BlogLayout` is a client component in `apps/blog`;
  it must not import `@repo/application` (blog data reaches it as props from the server layout /
  pages).
- **`Image` VO reuse** keeps the blog and portfolio image contracts identical, so a future
  `next/image` wrapper or CDN-transform helper can be shared.

## 9. Testing for section 7

- **`@repo/core`** — `BlogPost` entity tests: constructs with/without `coverImage`/`thumbnailImage`;
  invalid image URL / missing alt locale returns a single `left` (mirrors `Project` + `Image` tests).
- **`@repo/infra`** — `BlogPostMapper` tests: `meta.json` with the new image shape maps to `Image`
  VOs; absent images map to `undefined`; malformed image entry surfaces an `InfrastructureError`.
- **`@repo/application`** — `ListBlogPosts` / `GetBlogPostBySlug` tests: DTO carries
  `thumbnailImage` / `coverImage` with the alt resolved to the requested locale.
- **`apps/blog`** — `BlogLayout` component test (renders `SiteHeader` + nav + `SiteFooter`, passes
  children, toggles the drawer); blog `SideNavigation` test (portfolio links are cross-zone and
  locale-correct, Blog Home active on the listing route, social links `external`); listing/post
  page tests updated for the card / cover markup and prev-next nav.
- **Manual/browser** — folds into task 10's cross-zone checklist: sidebar + drawer in all three
  locales on mobile and desktop, logo → portfolio home, images render, prose is readable.
