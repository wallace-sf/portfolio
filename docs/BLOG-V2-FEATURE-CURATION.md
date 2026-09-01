# Blog v2 — Feature Curation

> **Status:** Exploration / benchmarking notes. Not a PRD, not a commitment.
> Input for the future Blog v2 planning (posts move from mocked MDX to Supabase).
> Benchmarked 2026-09-01 against three developer blogs.

---

## Context

The Blog MVP shipped with **mocked articles** — a deliberate trade-off. Blog v2
will persist posts in Supabase (nothing mocked). Before planning v2, we
benchmarked three reference blogs to curate features worth bringing in.

**Guiding principle for the curation:** the blog lives *inside* `apps/site` and
must follow the portfolio's own design and architecture. We adopt *behaviours*
and *interactions*, never another site's chrome or identity.

### Benchmarked blogs

| Blog | Stack | Character |
|------|-------|-----------|
| [loiane.com](https://loiane.com) | **Chirpy theme (Jekyll)**, near-stock | Classic technical blog; most "nice" features are Chirpy defaults |
| [vinniciusgomes.dev](https://vinniciusgomes.dev/articles) | Chirpy, heavily customized | Custom article layout, metadata grid, hover cards, giscus comments |
| [paulie.dev](https://www.paulie.dev/posts/) | Custom (Astro/React + Neon/Postgres) | "Build in public" — public analytics dashboard, anonymous reactions |

---

## ✅ Adopt in Blog v2 core (high value, low/medium cost)

These are content + layout + simple queries. No third-party services, no
moderation/abuse surface.

| Feature | Source | Rationale | Implementation notes |
|---------|--------|-----------|----------------------|
| **Reading time per post** | all three | Expected signal on a dev blog | Derived at build from the MDX/body (~200 wpm). Derived field, not stored in Supabase |
| **Author byline on the post** ("By …" / "Written by …", near the date/reading-time line) | all three | Missing in the MVP; standard for an article page, and feeds `article:author` / JSON-LD `author` | Single-author blog: a static site-owner value (name + avatar + short bio/link) is enough. Add an `author` field on the post only if guest posts are ever expected |
| **Reading progress bar** | Vinnicius | Cheap microinteraction, high polish | Client component only (scroll listener + `scrollHeight`). No backend |
| **Post metadata grid** (date · reading time · category/language) | Vinnicius | Scannable; adds information density to listings | Layout only; align with the design system |
| **Curated listing page** (title + subtitle + "Featured articles" band, then the full list) | Vinnicius | Lifts the blog landing page above a flat list | Needs a `featured` flag on the post (Supabase) — mirrors the existing `Project.weight` pattern |
| **TOC with scrollspy** ("On this page" — nested h2/h3, active section highlighted) | Loiane, Paul | Essential for long technical posts | Generate from MDX at build; `IntersectionObserver` on the client. Paul's *nested* version is the layout reference |
| **Breadcrumbs** (`Home › Blog › Post title` on the post page, `Home › Blog` on the listing) | Loiane, Paul | Missing in the MVP. Improves orientation on deep pages and feeds `BreadcrumbList` structured data | Derive from the route segments. Emit JSON-LD via `@repo/seo` (breadcrumb builder) so it doubles as an SEO win |
| **Date-based post URLs** (`/blog/{year}/{month}/{slug}`) + archive pages | Loiane | Chronological grouping, natural archive pages, avoids slug collisions across years | Architectural decision with migration cost — see [§ Post URL structure](#post-url-structure) below |
| **Share to socials** (X, LinkedIn, Telegram, copy link) | all three | Distribution; trivial | Static `share` URLs + copy button. No third-party SDK |
| **"Further Reading" / related posts** | Loiane | Retains the reader; improves internal linking | By shared tag/category, ordered by recency. Simple Supabase query |
| **Older / Newer post navigation** (post footer) | Loiane | Reading continuity | Query by adjacent date |
| **Tags + tag/category pages** and **"Trending tags"** | Loiane | Discovery + SEO (indexable pages) | Tag model in Supabase. "Trending" = simple count |
| **Search** | Loiane, Paul | Expected once there are >10 posts | Client-side over a build-time static index (Pagefind / FlexSearch). No service needed |
| **Diff highlighting in code blocks** (`+`/`-` lines colored green/red) | Paul | Very useful for "before/after" technical posts | Pipeline config only — Shiki / `rehype-pretty-code` with `// [!code ++]` / `// [!code --]`. Low cost |
| **Content count badges** (`Posts x81`, `Content ▾ 19`) | Paul | Small, satisfying detail | Trivial `count` from Supabase |

---

## Post URL structure

Loiane groups posts by publish date in the URL:
`https://loiane.com/2026/08/ai-loop-engineering-github-pr-claude-code/`.
The MVP uses a flat `/[locale]/blog/{slug}`. For v2 the candidate is
`/[locale]/blog/{year}/{month}/{slug}` (keeps the `blog` and `locale`
segments this app needs; Loiane's blog owns the whole domain, we don't).

**In favour**

- Chronological grouping; enables clean archive routes
  (`/blog/{year}`, `/blog/{year}/{month}`) that pair naturally with breadcrumbs.
- Slugs only need to be unique *within a month*, not forever.
- Matches a familiar pattern for a dated, article-style blog.

**Against**

- A date in the URL is a mild negative-to-neutral SEO signal (can read as
  "old content"); most modern engineering blogs use flat `/blog/{slug}`.
- The publish date becomes effectively immutable once indexed — moving a post
  to a new month means a redirect.
- More route params and more static params to generate.

**Migration cost**

- MVP posts are mocked, so few (if any) real URLs are live yet. Still, whatever
  is published before v2 needs `301` redirects from `/blog/{slug}` to the new
  path. Plan a redirect map (Next.js `redirects()` or middleware) as part of v2.

**Recommendation:** adopt `/blog/{year}/{month}/{slug}` **only if** we also
build the archive pages — the date segments earn their place through the
`/blog/{year}[/{month}]` routes and breadcrumb trail. If archive pages are cut
from scope, keep the flat `/blog/{slug}` and expose chronology through the
listing and tag pages instead. Decide this early: it drives the route tree,
the Supabase query shape, the sitemap, and the redirect map.

---

## 🟡 Nice-to-have — evaluate after the v2 core

| Feature | Source | Caveat |
|---------|--------|--------|
| **Anonymous emoji reactions** at post end | Paul (model), Vinnicius (idea) | Feasible without login by writing straight to Supabase, deduped by cookie/localStorage. **Use Paul's model, not Vinnicius's giscus-login model.** Still needs rate-limiting / anti-abuse |
| **Comments** | Vinnicius (giscus) | giscus = free, moderation on GitHub, zero backend — but forces the reader to have a GitHub account. A custom Supabase solution means moderation, spam, GDPR. Recommend **giscus** if comments are wanted soon |
| **Per-post view counter** | Vinnicius, Paul | Needs an increment endpoint + dedupe. Defer until there's real analytics |
| **Hover card / link preview** (preview card on hovering an internal link) | Vinnicius | Great touch, but requires generating previews and a mobile fallback (no hover). Scope to internal post-to-post links only |
| **"Recently Updated" sidebar** | Loiane | Only useful at volume with frequent edits |
| **Accessibility Statement page** | Paul | Cheap to write; signals care. Not a feature, an editorial page |
| **Nested nav with content dropdown** | Paul | Only if the blog grows several content types |

---

## ❌ Skip — does not fit our case

| Feature | Source | Why skip |
|---------|--------|----------|
| **Chirpy-style fixed sidebar** (avatar + vertical menu + YouTube counter + ad block) | Loiane | It's *her* blog's identity. Our blog lives inside the portfolio and must follow the portfolio design |
| **Per-post CC BY 4.0 license notice** | Loiane, Vinnicius | An editorial licensing decision, not a feature — adopt only if we actually want that license |
| **Per-post language toggle** (PT/EN badge) | Vinnicius | Only if we genuinely publish bilingual content; otherwise it's noise. (Note: blog i18n strategy is MDX-in-Git per `docs/07-I18N.md`) |
| **Grid view / List view toggle** on the listing | Vinnicius | Doubles layout maintenance for marginal gain. Pick one layout |
| **Cross-post source attribution** (`paulie.dev •`, "publishers" list) | Paul | Only relevant if we cross-post to dev.to / Medium / etc. |
| **GitHub Activity feed** | Paul | Noise; the GitHub events API changes |

---

## 🔭 Separate track — not a Blog v2 feature

### Public analytics dashboard (`/dashboard`)

Paul's signature feature: a public page with charts for posts per year/month,
per weekday, post views, visits by day/city/country (map), top referrers,
aggregated reactions, GitHub activity. Data in Neon/Postgres.

This is effectively **a portfolio project disguised as a blog page** — it
demonstrates dataviz + backend + geo-IP + aggregation skills. The scope (event
tracking, geo-IP, rollups, visualization) is too large to embed in Blog v2.

**Recommendation:** if it's interesting, treat it as its own project
("public analytics dashboard"), planned separately.

---

## Suggested delivery split for Blog v2

1. **Core v2** (no social features): posts in Supabase + reading time + author
   byline + progress bar + metadata grid + scrollspy TOC + breadcrumbs +
   curated/featured listing
   + related posts + Older/Newer + tags & tag pages + search + code-block diff
   highlighting + count badges. All content, layout, and simple queries — no
   external services, no moderation surface. **Settle the [post URL
   structure](#post-url-structure) before this lot starts** — it drives the
   route tree, sitemap, and redirect map.
2. **Social lot** (later): comments (giscus), anonymous reactions (Paul's
   model), view counts. Each carries operational cost (spam, moderation,
   dedupe) disproportionate to an MVP.

---

## Related docs

- [SEO-BACKLINK-STRATEGY.md](./SEO-BACKLINK-STRATEGY.md) — earlier benchmarking against paulie.dev
- [07-I18N.md](./07-I18N.md) — blog i18n strategy (MDX-in-Git)
- [03-BOUNDED-CONTEXTS.md](./03-BOUNDED-CONTEXTS.md) — Blog bounded context
