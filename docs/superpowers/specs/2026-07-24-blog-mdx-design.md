# Blog (`apps/blog`) — MDX-in-Git Design

> Status: approved design, pending implementation plan.
> Related: [ROADMAP.md](../../ROADMAP.md), [03-BOUNDED-CONTEXTS.md](../../03-BOUNDED-CONTEXTS.md),
> [SEO-BACKLINK-STRATEGY.md](../../SEO-BACKLINK-STRATEGY.md), [12-DESIGN-SYSTEM.md](../../12-DESIGN-SYSTEM.md).

## Goal

Ship a technical blog to drive SEO/backlink authority (per `SEO-BACKLINK-STRATEGY.md`), as fast
as possible, without blocking on a backoffice/admin UI. Content is authored as MDX files
committed to git and reviewed via PR — same workflow already used for project content.

A backoffice (`apps/admin`) for authoring posts via a database-backed UI is a deliberate
**future phase**, not part of this design. The architecture below is chosen so that phase is a
pure infra swap.

## 1. Scope

**In scope now:**
- `apps/blog`, a dedicated Next.js app, served at `wallace-ferreira.dev/blog` via Vercel
  multi-zone rewrite from `apps/site`.
- Content authored as MDX in git, no database.
- Full i18n from day one: every published post ships in `en-US`, `pt-BR`, and `es` — no partial
  translations, `en-US` is the runtime fallback only for locale-negotiation edge cases, never an
  excuse to skip a translation.
- SEO: per-post metadata, OG images, sitemap.
- Syntax highlighting for code blocks (posts are technical write-ups).

**Explicitly out of scope (future phases, tracked in ROADMAP.md):**
- Backoffice/admin authoring UI backed by a database.
- Tags/categories as a navigation/filtering feature (tags are stored in `meta.json` now, but no
  tag index pages yet).
- RSS feed.
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
- **`apps/blog`** — Server Components call `ListBlogPosts` / `GetBlogPostBySlug` directly at
  build time (SSG), same pattern as Portfolio.

When the backoffice phase happens: implement `PrismaBlogPostRepository`, wire it in the DI
container instead of `FileSystemBlogPostRepository`. `core`, `application`, and `apps/blog`
pages are untouched.

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

## 5. Cross-app routing (Vercel multi-zone)

- `apps/site`: `next.config.mjs` `rewrites()` sends `/blog` and `/blog/:path*` to the `apps/blog`
  Vercel deployment URL.
- `apps/blog`: `basePath: '/blog'`, its own `[locale]` routing via next-intl, reusing
  `LOCALES`/`DEFAULT_LOCALE` from `@repo/core/shared`. Deployed as an independent Vercel project.
- Final URLs: `wallace-ferreira.dev/blog`, `wallace-ferreira.dev/blog/pt-BR/<slug>`, etc. — path
  on the primary domain, not a subdomain, to keep domain authority/link equity unified (per
  `SEO-BACKLINK-STRATEGY.md` findings on paulie.dev's backlink profile).

## 6. Testing

- **`core`**: invariant tests for `BlogPost`/`Tag` (invalid slug, missing `publishedAt`, etc.) —
  Either pattern, no mocks.
- **`infra`**: `FileSystemBlogPostRepository` tests against a test fixture `content/posts/`
  directory (valid post, post missing a locale file → build error, malformed frontmatter → Zod
  error).
- **`apps/blog`**: detail page renders correct title/OG/canonical from a mocked
  `IBlogPostRepository` (no integration with real files).

## Open questions for implementation planning

- First post topic(s) and publishing cadence — not decided here, tracked separately.
- Exact DI container wiring pattern for `apps/blog` (mirrors how `apps/site` wires Portfolio use
  cases today — to confirm during planning).
