# RFC — Blog delivery: Vercel multi-zone vs. single Next app

> Status: **proposed** — awaiting decision.
> Author: review session, 2026-08-29.
> Related: [prd-blog-mdx-design.md](../.taskmaster/docs/prd-blog-mdx-design.md),
> [prd-blog-shared-layout.md](../.taskmaster/docs/prd-blog-shared-layout.md),
> [02-ARCHITECTURE.md](./02-ARCHITECTURE.md).

## 1. Summary

`apps/blog` is currently a **separate Next.js app** deployed as an independent
Vercel project, composed into `wallace-ferreira.dev/blog` via an HTTP rewrite
from `apps/site` (Vercel multi-zone). A shared presentational package
(`packages/layout`) plus a `buildCrossZoneHref` helper exist to make the two
zones "feel like one site".

This RFC proposes **collapsing `apps/blog` into `apps/site` as a native
`/[locale]/blog/...` route tree**, deleting the multi-zone plumbing and the
`packages/layout` boundary.

**Recommendation: collapse to a single app.**

## 2. Why this is being reconsidered

Two concrete costs, raised during the task-16 review:

1. **Duplicated code across two apps.** Every shared chrome element (nav,
   header, footer, theme/language controls) must be implemented or wired in
   both apps. The routing/i18n/proxy/SEO substrate is copied per app.
2. **Drift risk.** "Feels like one system" is not enforced by anything — it is
   a manual invariant maintained by keeping two near-identical nav files in
   sync. Nothing in CI catches divergence (CI does not even run `build`).

A third observation from reviewing the decision record: the documented choice
was **multi-zone vs. Module Federation** — both "keep two apps" options. A
**single app** was never evaluated against multi-zone. The "discussion log"
referenced in `prd-blog-shared-layout.md` §Goal is not in the repo.

## 3. Current cost inventory

### 3.1 Code that exists *only* because there are two apps

| Item | Location | ~LOC |
|---|---|---|
| `rewrites()` block + `env` passthrough | `apps/site/next.config.mjs` | ~15 |
| Entire second Next config (`basePath`, headers, images, `agentRules`) | `apps/blog/next.config.mjs` | ~25 |
| `proxy.ts` (intl middleware) | `apps/blog/src/proxy.ts` — near-exact copy of site's | ~18 |
| `i18n/routing.ts` + `i18n/request.ts` | `apps/blog/src/i18n/*` — exact copies of site's | ~55 |
| `buildCrossZoneHref` + test | `packages/layout/src/buildCrossZoneHref.ts` (+ test) | ~110 |
| Per-zone SEO builders (`alternates`, `builders`, `openGraph`, `robots`) | `apps/blog/src/lib/seo/*` — parallel to site, parameterized for `basePath` | ~60 |
| Second `sitemap.ts` / `robots.ts` / GA wiring / `vercel.json` | `apps/blog/src/app/*`, `apps/blog/vercel.json` | ~50 |
| `NEXT_LOCALE` cookie-scoping discipline + **Task 10** (cross-zone locale-preservation E2E checklist) | conceptual + `.taskmaster` task 10 | — |
| `@repo/layout` as a **published tsup package** (dist build, subpath exports, React 18→19 peer-dep juggling) | `packages/layout/*` | 683 src + 791 test |
| 2× `SideNavigation` (~135 LOC each, ~85% identical) + 2× test + 2× i18n namespaces (`SideNavigation`/`Theme`/`Language` × 3 locales) + 2× `env` getters + `environment.d.ts` + 2× `lib/resume.ts` + 2× layout composition | `apps/site` + `apps/blog` | ~500 |

### 3.2 What multi-zone actually buys — assessed for *this* project

| Claimed benefit | Reality here |
|---|---|
| Independent deploy cadence | A post PR doesn't redeploy the portfolio. Low value: portfolio build is fast; a monorepo single app only redeploys on change anyway. |
| Bundle isolation (blog's MDX/`shiki`/`rehype` deps) | **Neutralized** — those deps are RSC/server-only. Zero client-bundle impact. Build-time only, minor. |
| Blast radius — a broken blog build can't block a portfolio deploy | The strongest point. Partially reproducible in a single app with error boundaries + `dynamicParams`, but multi-zone isolation is cleaner. |
| Blog could become a different stack / repo later | Speculative. `prd-blog-mdx-design.md` says the planned future is an **admin infra swap**, not a blog rewrite. |
| Independent teams | N/A — solo project. |

### 3.3 Ongoing hazards introduced by the split

- Cross-zone locale loss — each zone scopes its own `NEXT_LOCALE` cookie by
  `basePath`; every cross-zone link must carry the locale in the path or
  language is dropped. `buildCrossZoneHref` had to be reworked twice already
  (returns an absolute URL now) and issue #988 was a routing bug from the
  `proxy.ts` matcher.
- `next dev` does not run the cross-zone rewrite locally — verifying the
  integrated experience needs `BLOG_APP_URL` set or both apps running.
- "One system" is a manual invariant (§2.2).

## 4. Proposed target: single app

Fold `apps/blog` into `apps/site`:

- **Routes** — move `apps/blog/src/app/[locale]/{page,[slug],rss.xml}` to
  `apps/site/src/app/[locale]/blog/...`. URLs are unchanged
  (`wallace-ferreira.dev/blog/...`), now native routes: no rewrite hop, no
  cookie-scoping problem, `[locale]` is one shared segment for everything.
- **i18n** — merge `apps/blog/messages/*.json` into `apps/site/messages/*.json`
  under a `Blog.*` namespace. One `routing.ts` / `request.ts` / `proxy.ts`.
- **DI** — keep a `blogPostRepository` in the site's server container (or a
  dedicated `lib/server/blog-container.ts`); `FileSystemBlogPostRepository`
  reads `content/posts/` exactly as today.
- **Chrome** — dissolve `packages/layout` into local `apps/site` components
  (`SiteHeader`, `SiteFooter`, `ThemeToggle`, `LanguageSelector`,
  `SideNavigation`). No tsup package, no subpath exports, no peer-dep dance.
- **Nav** — one `SideNavigation`: all items, real active states everywhere,
  one i18n namespace, one test.
- **SEO** — one `sitemap.ts` covers portfolio + blog; blog RSS stays as route
  handlers under `/blog/[locale]/rss.xml`. `@repo/seo`'s `createSeoBuilders`
  is still used, with a single config.
- **Deps** — blog's server-only deps (`next-mdx-remote`, `rehype-pretty-code`,
  `shiki`, `gray-matter`) move to `apps/site/package.json`; server bundle only.
- **Delete** — `apps/blog/` app shell, its `next.config` / `proxy.ts` /
  `i18n/*` / `vercel.json`, the site's `rewrites()` block, `buildCrossZoneHref`
  + tests, Task 10 in its entirety, `packages/layout` (or slim to nothing).

### 4.1 Explicitly **not** touched (not sunk cost)

- `packages/core` — `BlogPost` entity, `Tag` VO.
- `packages/application` — `IBlogPostRepository`, `ListBlogPosts`,
  `GetBlogPostBySlug`.
- `packages/infra` — `FileSystemBlogPostRepository`, mapper, Zod schemas.
- `packages/config` (Task 1), `packages/seo` (Tasks 8–9) — useful regardless.
- Tasks 17–18 (styled listing / post pages) — zone-agnostic page styling,
  transfer ~1:1.
- The future `apps/admin` infra swap (`PrismaBlogPostRepository`) is unaffected
  — it's an `infra` concern, not an app-topology concern.

### 4.2 Blast-radius mitigation (the one real trade-off given up)

If a blog page throws during SSG it fails the whole `site` build. Mitigations:
- Wrap blog route segments in an `error.tsx` boundary.
- `generateStaticParams` for posts wrapped so a single malformed post is
  skipped with a build warning, not a hard failure.
- Add `pnpm --filter site build` to CI (currently no `build` job exists at all
  — this gap is what let the task-16 break through).

## 5. Options considered

| Option | Description | Verdict |
|---|---|---|
| **A. Finish the extraction** | Keep two apps. Move the *whole* `SideNavigation` (items + i18n + test) into `packages/layout`, parameterized by `zone`. Add `build` to CI. | Viable **only if** blast-radius isolation is a hard requirement. Keeps all the §3.1 substrate duplication. |
| **B. Single app** *(proposed)* | Collapse `apps/blog` into `apps/site`. | **Recommended.** Removes the duplication and the drift hazard at the root. |
| **C. Status quo** | Shared shell, duplicated item lists. | Not defensible — pays the package-boundary cost without the dedup payoff. |

## 6. Recommendation

**Option B.** For a solo portfolio + blog on a single domain, multi-zone is
over-engineering: it pays a permanent duplication + drift-risk tax for deploy
independence that is close to worthless in this context. The two costs that
prompted this RFC — code volume across two apps, and drift breaking the unified
experience — are resolved at the root by a single app, because the unified
experience stops being a hand-maintained invariant.

Choose **Option A** only if "the blog can never affect the portfolio's build /
availability" is elevated to a hard requirement. In that case, still add `build`
to CI and finish the nav extraction — do not stay on Option C.

## 7. If Option B is accepted — migration outline

Roughly one focused PR (or a short stacked series):

1. Move blog routes into `apps/site/src/app/[locale]/blog/`; merge messages
   under `Blog.*`; wire `blogPostRepository` into the site container.
2. Inline `packages/layout` components into `apps/site`; build the single
   `SideNavigation` with full active states; delete the package.
3. Delete multi-zone plumbing (site `rewrites()`, `apps/blog/`,
   `buildCrossZoneHref`, cross-zone tests, Task 10).
4. Move blog server-only deps into `apps/site/package.json`.
5. Add blast-radius mitigations (§4.2) + a `build` job to `.github/workflows/ci.yml`.
6. Update `prd-blog-mdx-design.md` §6, `prd-blog-shared-layout.md`,
   `02-ARCHITECTURE.md`, and the `docs/INDEX.md` map.
7. Re-point the Vercel `portfolio-blog` project (delete it; `/blog` now served
   by `portfolio-site`). Remove `BLOG_APP_URL`.

## 8. Open questions

- Vercel: any redirect/analytics history tied to the separate `portfolio-blog`
  project that needs preserving?
- Is there appetite to keep `packages/layout` alive purely for a *future*
  `apps/admin` public-facing surface? (Current `apps/admin` is a minimal
  backoffice with its own chrome — it would not consume this.)
- Task Master: how to reconcile the `feature-blog-shared-layout` tag (tasks
  1–18) — mark 6, 10, and the cross-zone parts of 15–16 as cancelled, keep
  11–14 and 17–18.
