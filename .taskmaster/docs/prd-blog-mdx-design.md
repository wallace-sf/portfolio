# Blog — MDX-in-Git Design

> Status: design delivered (core/application/infra + pages). Delivery topology
> changed — see the delivery note below.
> Related: [ROADMAP.md](../../docs/ROADMAP.md), [03-BOUNDED-CONTEXTS.md](../../docs/03-BOUNDED-CONTEXTS.md),
> [SEO-BACKLINK-STRATEGY.md](../../docs/SEO-BACKLINK-STRATEGY.md), [12-DESIGN-SYSTEM.md](../../docs/12-DESIGN-SYSTEM.md).

> **Delivery topology (updated 2026-08-29):** the blog was originally built as a
> separate `apps/blog` Next.js app composed into `wallace-ferreira.dev/blog` via
> a Vercel multi-zone rewrite. That split was reversed — the blog is now a
> `/[locale]/blog/...` route tree **inside `apps/site`**. Rationale and migration
> in [RFC-blog-multizone-vs-single-app.md](../../docs/RFC-blog-multizone-vs-single-app.md)
> and [prd-blog-single-app-migration.md](./prd-blog-single-app-migration.md).
> §1 and §6 below are updated for this; the bounded-context, content-model,
> rendering/SEO, and RSS design (§2–5) is topology-independent and unchanged.
> Public URLs are unchanged.

## Goal

Ship a technical blog to drive SEO/backlink authority (per `SEO-BACKLINK-STRATEGY.md`), as fast
as possible, without blocking on a backoffice/admin UI. Content is authored as MDX files
committed to git and reviewed via PR — same workflow already used for project content.

A backoffice (`apps/admin`) for authoring posts via a database-backed UI is a deliberate
**future phase**, not part of this design. The architecture below is chosen so that phase is a
pure infra swap.

## 1. Scope

**In scope now:**
- The blog served at `wallace-ferreira.dev/blog`, as a `/[locale]/blog/...` route tree inside
  `apps/site` (see delivery note above — originally a separate `apps/blog` multi-zone app).
- Content authored as MDX in git, no database.
- Full i18n from day one: every published post ships in `en-US`, `pt-BR`, and `es` — no partial
  translations, `en-US` is the runtime fallback only for locale-negotiation edge cases, never an
  excuse to skip a translation.
- SEO: per-post metadata, OG images, sitemap.
- Syntax highlighting for code blocks (posts are technical write-ups).
- Tags: stored in `meta.json`, displayed on the post as metadata/badges.
- RSS: one feed per locale (`/blog/<locale>/rss.xml`).

**Explicitly out of scope (future phases, tracked in [ROADMAP.md](../../docs/ROADMAP.md)):**
- Backoffice/admin authoring UI backed by a database.
- Tag listing/index pages (e.g. `/blog/[locale]/tag/[tag]`) — tags exist as data now, but no
  dedicated navigation/filtering pages yet.
- `/archives` page (year-grouped post timeline).
- "Recently updated" and "trending tags" sidebar widgets.
- Sticky table of contents on post pages.
- Reading-time estimate on post pages.
- Comments, newsletter, reading analytics.

## 2. Architecture

The Blog bounded context follows the same Dependency Rule as Portfolio
(`core ← application ← infra ← apps`), even though there is no database yet. This means the
future migration to a backoffice is an **infra swap only** — no changes to domain, use cases, or
pages.

- **`packages/core`** — `BlogPost` entity and `Tag` value object. Invariants via `Validator`
  (kebab-case slug, `publishedAt` present, at least one `LocalizedText` for title/description).
  Zero framework dependencies.
- **`packages/application`** — `IBlogPostRepository` port (`findAll()`, `findBySlug(slug)`) and
  use cases `ListBlogPosts`, `GetBlogPostBySlug`.
- **`packages/infra`** — `FileSystemBlogPostRepository`: reads `content/posts/<slug>/*`, parses
  frontmatter (Zod schema, edge validation per `06-VALIDATION.md`), constructs `BlogPost`
  entities. No Prisma/Supabase involved in this phase.
- **`apps/site` (blog routes)** — Server Components call `ListBlogPosts` / `GetBlogPostBySlug`
  directly at build time (SSG), same pattern as Portfolio.

When the backoffice phase happens: implement `PrismaBlogPostRepository`, wire it in the DI
container instead of `FileSystemBlogPostRepository`. `core`, `application`, and the blog pages
are untouched.

## 3. Content model

```
content/posts/<slug>/
  meta.json       # shared across locales — immutable metadata
  en-US.mdx
  pt-BR.mdx
  es.mdx
  cover.png       # optional, referenced by meta.json
```

`meta.json`:
```json
{
  "slug": "abstracting-gatsby-functions-as-an-api",
  "publishedAt": "2026-08-01",
  "tags": ["nextjs", "architecture"],
  "coverImage": "/content/posts/<slug>/cover.png"
}
```

Each `.mdx` file carries only the locale-specific `title`, `description` (frontmatter) and body.
Immutable metadata (slug, date, tags) is not duplicated per locale.

**Validation:** a `BlogPostFrontmatterSchema` (Zod) validates `meta.json` and every `.mdx`
frontmatter at build time. A missing locale file, malformed frontmatter, or invalid slug fails
the build — never ships a broken post to production.

## 4. Rendering & SEO

- **MDX compilation**: `next-mdx-remote/rsc` — Server Components, SSG. Not `TextRich` from
  `@repo/ui`, which is client-side and designed for markdown coming from the database (e.g.
  project descriptions); blog posts render server-side for performance and SEO.
- **Syntax highlighting**: `rehype-pretty-code` (Shiki) at build time — no client JS shipped for
  highlighting.
- **Custom MDX components**: map to `@repo/ui` components (`Badge`, `SectionHeader`, etc.) where
  it makes sense inside post bodies.
- **Per-post SEO**: `generateMetadata` (title/description/canonical per locale),
  `generateStaticParams` (SSG per slug × locale), dynamic `opengraph-image.tsx` (from
  `coverImage` or generated from the title), `sitemap.ts` covering all posts × locales.

## 5. RSS feeds

- One feed per locale: `apps/site/src/app/[locale]/blog/rss.xml/route.ts` (Route Handler),
  reachable as `wallace-ferreira.dev/blog/<locale>/rss.xml`.
- Each feed calls `ListBlogPosts` (same use case as the listing page) and renders title,
  description, link, and `publishedAt` for that locale only — no mixing locales in one feed.
- Feed link (`<link rel="alternate" type="application/rss+xml">`) added per locale in the blog
  layout `<head>`, and referenced in `robots.txt`/footer for discoverability.

## 6. Routing

- The blog lives under `apps/site/src/app/[locale]/blog/...` — native routes, one `[locale]`
  segment shared with the portfolio, one next-intl config, one middleware. No `basePath`, no
  rewrite hop, no per-zone `NEXT_LOCALE` cookie scoping.
- Reuses `LOCALES`/`DEFAULT_LOCALE` from `@repo/core/shared` (same as the portfolio routes).
- Post URLs embed the publication year/month (`/blog/<locale>/<yyyy>/<mm>/<slug>`), derived from
  `BlogPost.publishedAt`. Decided in the MVP (not deferred) because changing URL structure later
  breaks already-indexed links and SEO equity — cheap to do now, expensive to retrofit.
- Final URLs: `wallace-ferreira.dev/blog`, `wallace-ferreira.dev/blog/pt-BR/2026/08/<slug>`, etc.
  — path on the primary domain, not a subdomain, to keep domain authority/link equity unified (per
  `SEO-BACKLINK-STRATEGY.md` findings on paulie.dev's backlink profile).
- History: originally an independent `apps/blog` Vercel project reached via
  `apps/site` `rewrites()` — see [RFC-blog-multizone-vs-single-app.md](../../docs/RFC-blog-multizone-vs-single-app.md).

## 7. Testing

- **`core`**: invariant tests for `BlogPost`/`Tag` (invalid slug, missing `publishedAt`, etc.) —
  Either pattern, no mocks.
- **`infra`**: `FileSystemBlogPostRepository` tests against a test fixture `content/posts/`
  directory (valid post, post missing a locale file → build error, malformed frontmatter → Zod
  error).
- **`apps/site` (blog routes)**: detail page renders correct title/OG/canonical from a mocked
  `IBlogPostRepository` (no integration with real files); RSS route returns valid XML with only
  the requested locale's posts, from the same mocked repository.

## Open questions for implementation planning

- First post topic(s) and publishing cadence — not decided here, tracked separately.
- Exact DI container wiring for the blog's `IBlogPostRepository` inside `apps/site` (mirrors how
  `apps/site` wires Portfolio use cases today — to confirm during planning).
