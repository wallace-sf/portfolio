# Blog/Site Shared Layout & Cross-Zone Integration

> Status: draft, pending review.
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
- Full design-system pass on the blog's own visual identity beyond the shared header/footer —
  `apps/blog` still has no dedicated UI design phase; this PRD only covers the parts that must be
  shared to avoid the site/blog feeling disconnected.

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
