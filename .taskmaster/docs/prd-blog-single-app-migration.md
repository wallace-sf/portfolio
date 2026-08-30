# Blog — collapse multi-zone into a single app

> Status: proposed — pending RFC acceptance ([RFC-blog-multizone-vs-single-app.md](../../docs/RFC-blog-multizone-vs-single-app.md)).
> Supersedes: [prd-blog-shared-layout.md](./prd-blog-shared-layout.md).
> Updates: [prd-blog-mdx-design.md](./prd-blog-mdx-design.md) §1, §6.
> Related: [02-ARCHITECTURE.md](../../docs/02-ARCHITECTURE.md), [07-I18N.md](../../docs/07-I18N.md).

## Goal

`apps/blog` is a separate Next.js app composed into `wallace-ferreira.dev/blog`
via a Vercel multi-zone rewrite from `apps/site`. Per the RFC, that split is not
worth its cost for a solo portfolio + blog on one domain: it forces a duplicated
routing / i18n / proxy / nav substrate across two apps and makes "feels like one
site" a hand-maintained invariant with no CI guard.

This PRD collapses the blog into `apps/site` as a native `/[locale]/blog/...`
route tree, deletes the multi-zone plumbing and the `@repo/layout` package
boundary, and finishes the blog's first visual pass (styled listing + post
pages) — once, in the single app.

**URL scheme:** blog routes live under the shared `[locale]` segment, so the
public paths become `wallace-ferreira.dev/<locale>/blog` and
`wallace-ferreira.dev/<locale>/blog/<slug>` — locale first, consistent with
every other route (`/<locale>/projects`, `/<locale>/about`). This differs from
the multi-zone layout (`/blog/<locale>/...`); redirects from the old paths are
handled in task 6 if the standalone blog project ever had indexed URLs (open
question §8).

## 1. Scope

**In scope:**

- Move the blog's routes, RSS handler, and per-post OG image into
  `apps/site/src/app/[locale]/blog/...`.
- Merge `apps/blog/messages/*.json` into `apps/site/messages/*.json` under a
  `Blog.*` namespace; one next-intl config, one middleware.
- Wire `IBlogPostRepository` (`FileSystemBlogPostRepository`, reading
  `content/posts/`) into `apps/site`'s server DI container.
- Move the blog's server-only deps (`next-mdx-remote`, `rehype-pretty-code`,
  `shiki`, `gray-matter`) into `apps/site/package.json`.
- Dissolve `packages/layout` into local `apps/site` components; delete the
  package and `buildCrossZoneHref`.
- One unified `SideNavigation` in `apps/site` — all items, real active states
  everywhere (including `/blog`), one `SideNavigation` / `Theme` / `Language`
  i18n namespace.
- Delete multi-zone plumbing: `apps/site` `rewrites()`, `apps/blog/` entirely,
  `apps/blog/vercel.json`, `BLOG_APP_URL`, the `blog` exclusion in
  `apps/site/src/proxy.ts`, and the cross-zone locale discipline (old Task 10).
- Blast-radius mitigations (the one trade-off the RFC flags): an `error.tsx`
  boundary on the blog route segment, resilient `generateStaticParams` (a
  malformed post is skipped with a build warning, not a hard build failure), and
  a `build` job added to `.github/workflows/ci.yml` (there is none today — that
  gap is what let a blog build break through review).
- Styled blog listing + post pages (carried unchanged in intent from
  `prd-blog-shared-layout.md` §7.4): Chirpy-informed post cards, cover hero,
  MDX prose typography, prev/next navigation.
- Documentation: update `docs/INDEX.md`, `02-ARCHITECTURE.md`, `CLAUDE.md`
  (monorepo structure), `07-I18N.md`; supersede notes already added to the two
  blog PRDs.

**Out of scope (unchanged from prior PRDs):**

- Deferred Chirpy features — TOC rail, tag pages, archives, search, read-time,
  related posts, listing pagination, comments (`prd-blog-shared-layout.md` §7.6).
- Backoffice/admin authoring UI, `PrismaBlogPostRepository`.
- Any portfolio-side change beyond what the merge requires.
- Post URL restructure to `/blog/<locale>/<yyyy>/<mm>/<slug>` — still a
  documented intent in `prd-blog-mdx-design.md` §6, still deferred, not pulled in
  here.

## 2. What carries over unchanged (not sunk cost)

Delivered by the `feature-blog-shared-layout` tag, survives the migration as-is:

- `packages/core` — `BlogPost` entity, `Tag` VO, the `Image` VO imagery model
  (tasks 11).
- `packages/application` — `IBlogPostRepository`, `ListBlogPosts`,
  `GetBlogPostBySlug`, blog DTOs with localized image alt (tasks 12–13).
- `packages/infra` — `FileSystemBlogPostRepository`, `BlogPostMapper`,
  `MetaJsonSchema` (task 12).
- `packages/config` — shared `SECURITY_HEADERS` (task 1).
- `packages/seo` — `createSeoBuilders`, `renderOgImage` / `OG_IMAGE_SIZE`
  (tasks 8–9). Consumed with a single config instead of one per app.
- The MDX pipeline, RSS-per-locale design, per-post OG images, the backfilled
  `the-either-pattern-in-typescript` cover/thumbnail (task 14).

## 3. Architecture

- **Dependency Rule unchanged** — `core ← application ← infra ← apps/site`. The
  blog is a bounded context living in `packages/core|application|infra`; only its
  delivery surface moves.
- **Routing** — blog routes are native under the shared `[locale]` segment. No
  `basePath`, no rewrite hop, no per-zone `NEXT_LOCALE` cookie scoping. Locale is
  always in the path for every route, portfolio and blog alike.
- **Chrome** — `SiteHeader`, `SiteFooter`, `SiteLogo`, `ThemeToggle`,
  `LanguageSelector`, the `SideNav` shell and `useNavLink` / `useTheme` /
  `useDarkMode` hooks become local `apps/site` modules (they were only ever
  consumed by `site` + `blog`; `apps/admin` has its own minimal chrome). No tsup
  package, no subpath exports, no React peer-dep juggling.
- **Nav** — a single `SideNavigation`. Every item resolves its href with the
  locale-aware `Link` / `useNavLink`; `/blog` gets a real active state like any
  other route. No `buildCrossZoneHref`, no "never active because different zone"
  special case.
- **`@repo/tailwind-config`** — the `header-*` / `sidenav-*` tokens added for the
  shared chrome stay in the shared config (still correct — they're design
  tokens, not app code).
- **Blast radius** — a throwing blog page fails the `apps/site` build. Mitigated
  by an `error.tsx` boundary + resilient `generateStaticParams`; the CI `build`
  job makes any such break visible on the PR instead of at deploy time.
- **`apps/blog` is deleted** — not archived. History is in git and in the
  superseded PRD.

## 4. Tasks

Ordered for safe incremental delivery. Each is a PR against `develop`.

1. **Merge blog routes into `apps/site`.** Recreate `app/[locale]/{page,[slug]/page,
   [slug]/opengraph-image,rss.xml}` under `apps/site/src/app/[locale]/blog/...`,
   adapted to `apps/site`'s i18n/SEO/env/container modules and the locale-first
   URL scheme. Merge blog `sitemap` output into `apps/site`'s. Wire
   `blogPostRepository` into `apps/site`'s server container. Move blog
   server-only deps into `apps/site/package.json`. Blog pages still render with
   their current (unstyled) markup — this task is a pure move + wire, no visual
   change. `apps/blog` is left fully intact (still building) until task 3 deletes
   the whole app — piecemeal deletion here would leave a knowingly-broken app in
   the tree for two PRs with no CI `build` job (added in task 6) to catch it.
2. **Merge blog i18n messages.** `apps/blog/messages/*.json` → `Blog.*` namespace
   in `apps/site/messages/*.json`. Update blog page/route message keys. Delete
   `apps/blog/messages/`.
3. **Remove multi-zone plumbing.** Delete `apps/site` `next.config` `rewrites()`,
   the `blog` exclusion in `apps/site/src/proxy.ts`, `BLOG_APP_URL` from
   `apps/site` `env` / `.env.example` / `turbo.json` `globalEnv`,
   `apps/blog/vercel.json`. Delete the now-empty `apps/blog/` and its
   `package.json` / configs from the workspace. Update `pnpm-workspace.yaml`,
   root `turbo.json`, `tsconfig` references.
4. **Inline `@repo/layout` into `apps/site`.** Move `SiteHeader`, `SiteFooter`,
   `SiteLogo`, `ThemeToggle`, `LanguageSelector`, `SideNav` shell, `useNavLink`,
   `useTheme`, `useDarkMode` to `apps/site/src/components/Layout/` (+ a local
   hooks dir). Delete `packages/layout` and `buildCrossZoneHref` + tests. Fix
   `apps/site` imports. Move the layout tests into `apps/site/test`.
5. **Unify `SideNavigation`.** One component: portfolio + blog items, real
   active states everywhere. Delete the cross-zone "never active" path. One test
   file. Confirm the `SideNavigation` / `Theme` / `Language` namespaces (already
   in `apps/site` messages) cover every key.
6. **Blast-radius mitigations + CI.** `error.tsx` on the blog route segment;
   `generateStaticParams` skips a malformed post with a `console.warn` instead of
   throwing; add a `build` job (`turbo run build`) to
   `.github/workflows/ci.yml`.
7. **Style the blog listing page** (carried from `prd-blog-shared-layout.md`
   §7.4). Chirpy-style post cards: thumbnail, title, locale-formatted date,
   description, tag badges; empty state; responsive grid. Existing
   `@repo/tailwind-config` tokens only.
8. **Style the blog post page** (carried from §7.4). Cover-image hero, styled
   header (title / date / tags), MDX prose typography (works with the existing
   `rehype-pretty-code`), prev/next post navigation from `ListBlogPosts` order.
9. **Docs + smoke test.** Update `docs/INDEX.md`, `02-ARCHITECTURE.md`,
   `CLAUDE.md` monorepo structure, `07-I18N.md`. Manual smoke test: `/blog`,
   `/blog/<locale>`, a post, `/blog/<locale>/rss.xml`, the per-post
   `opengraph-image`, the sitemap includes blog URLs, locale switch on a blog
   page keeps you on the blog, nav active state on `/blog`.

## 5. Testing

- **Unchanged**: `core` / `application` / `infra` blog tests — no code change.
- **Moved**: blog page + RSS + OG tests move to `apps/site/test/app/[locale]/blog/`;
  adjust import paths and the mocked-repository wiring for the site container.
- **New**: `SideNavigation` unified test (all items render, `/blog` active on the
  blog route, drawer closes on item click); `error.tsx` renders on a thrown blog
  page; `generateStaticParams` skips a malformed fixture post.
- **Deleted**: all `buildCrossZoneHref` tests; the entire old Task 10 cross-zone
  locale checklist (no zone boundary exists any more).
- **CI**: the new `build` job must pass on the migration PRs.

## 6. Rollout

1. Merge tasks 1–9 to `develop` (stacked or sequential).
2. Deploy `develop` → verify `wallace-ferreira.dev/blog/*` on the `apps/site`
   preview.
3. In Vercel: point the apex domain's `/blog` traffic entirely at
   `portfolio-site` (it already serves it after the rewrite is removed — the
   rewrite was the only thing delegating to `portfolio-blog`). Delete the
   `portfolio-blog` project. Remove `BLOG_APP_URL` from `portfolio-site` env.
4. Confirm no redirects / analytics tied to the standalone `portfolio-blog`
   project need preserving (open question §8).

## 7. Task Master reconciliation

`feature-blog-shared-layout` tag:

- Tasks **1–5, 8–9, 11–14** — stay `done` (delivered, survive the migration).
- Task **6** — already `cancelled`.
- Task **15** (`BlogLayout` shell) — `done`, but its output is refactored by
  tasks 1/4/5 here.
- Tasks **10, 16, 17, 18** — set to `cancelled` (16 was in progress on PR #1030;
  17–18 are re-scoped as tasks 7–8 of this PRD).

New tag **`feature-blog-single-app`** parsed from this PRD.

PR #1030 (task 16) is closed unmerged. Issue #1031 is closed (misdiagnosed —
`develop` builds fine; the break was PR #1030's `href={undefined}` on
`next/link`). Branch `1031-fixblog-...` is deleted.

## 8. Open questions

- Vercel: any redirect rules, analytics history, or env config tied to the
  standalone `portfolio-blog` project that must be preserved before deleting it?
- `apps/admin` is a minimal backoffice with its own chrome and does not consume
  the shared layout — confirmed it has no stake in keeping `packages/layout`.
- Stacked PRs vs. one large migration PR — decide based on review appetite;
  tasks 1–3 are hard to split cleanly (the app only builds once the move is
  complete).
