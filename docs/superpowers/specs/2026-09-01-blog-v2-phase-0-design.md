# Blog v2 — Phase 0: Foundational Decisions + Data Model

> Status: **approved design** (brainstorm 2026-09-01), pending phase PRDs.
> Scope: decisions + data model only — **no code in this phase**.
> Related: [BLOG-V2-FEATURE-CURATION.md](../../BLOG-V2-FEATURE-CURATION.md),
> [2026-07-24-blog-mdx-design.md](./2026-07-24-blog-mdx-design.md),
> [03-BOUNDED-CONTEXTS.md](../../03-BOUNDED-CONTEXTS.md),
> [07-I18N.md](../../07-I18N.md).
> Tracked by #1067.

---

## Goal

Move blog post content from file-backed MDX (`content/posts/<slug>/*.mdx`, read by
`FileSystemBlogPostRepository`) to Supabase/Postgres, fed like portfolio projects
(seeder → DB; a future `apps/admin` for database-backed authoring). The
[2026-07-24 MDX-in-Git design](./2026-07-24-blog-mdx-design.md) was written so this
would be "a pure infra swap" — v2 is that swap, plus the URL restructure and the
presentation features curated in
[BLOG-V2-FEATURE-CURATION.md](../../BLOG-V2-FEATURE-CURATION.md).

This is a large change. Phase 0 locks the decisions and the data model so each
later phase can be specced against a stable base. Phase 0's output is this
document; it produces **no code**.

---

## 1. Decisions

| # | Decision | Notes |
|---|----------|-------|
| 1 | **Supabase is the source of truth.** Fed like portfolio projects (seeder TS → Postgres). A future `apps/admin` panel authors posts. | Git stops holding post content once migrated. |
| 2 | **Post URL: `/[locale]/blog/{year}/{month}/{slug}`** + archive pages `/blog/{year}` and `/blog/{year}/{month}`. | `301` from the MVP `/blog/{slug}` URLs. `year`/`month` derive from `publishedAt`; the slug stays the lookup key. |
| 3 | **Tags: `tags String[]` column** on `BlogPost`. | Denormalized, like `Project.skillIds` / `relatedProjectSlugs`. `Tag` VO (kebab-case) stays. Tag pages, trending, and counts are computed at build by aggregating the arrays (few posts). No per-tag metadata. |
| 4 | **Lifecycle mirrors `Project`:** `status DRAFT \| PUBLISHED \| ARCHIVED` + `deletedAt` soft delete. | Public listings, adjacency, RSS, sitemap and static route generation include **`PUBLISHED` only**. |
| 5 | **`author` column** on `BlogPost`. | Guest posts are on the horizon. Embedded as `Json` (not a table) — see §2. |
| 6 | **`content` = MDX string per locale** inside a `Json` column. | Same shape as `Project.content` (Markdown-in-`Json`); the renderer differs (`next-mdx-remote/rsc`, server, Shiki). |
| 7 | **Reading time is derived, not stored.** No `weight` column. | Ordering: `publishedAt DESC`, with `featured` surfaced separately on the listing. |
| 8 | **Phase 0 is doc-only.** Phases 1–5 are separate PRDs. | More checkpoints, smaller PRs. |

---

## 2. Data model — Prisma

Follows the `Project` conventions in `packages/infra/prisma/schema.prisma`
(localized fields as `Json` holding `{ "en-US": "...", "pt-BR": "...", "es": "..." }`).

```prisma
enum BlogPostStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

model BlogPost {
  id                String         @id @default(uuid()) @db.Uuid
  slug              String         @unique          // lookup key; year/month come from publishedAt
  title             Json                            // { locale: text }
  description       Json
  content           Json                            // { locale: "<MDX string>" }
  tags              String[]
  author            Json                            // { name, avatarUrl, url?, bio?: { locale: text } }
  coverImageUrl     String?
  coverImageAlt     Json?
  thumbnailImageUrl String?
  thumbnailImageAlt Json?
  publishedAt       DateTime
  status            BlogPostStatus @default(DRAFT)
  featured          Boolean        @default(false)
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  deletedAt         DateTime?

  @@index([publishedAt])
  @@index([status, publishedAt])
}
```

**Notes**

- **`content`** — the MDX body as a string per locale. `PostBody` already compiles
  a raw string via `next-mdx-remote/rsc`, and `BlogPostDetailDTO.content` is already
  `string`, so the delivery layer's body rendering does not change.
- **`author`** — embedded `Json`, not a table. Domain VO `Author`:
  `name` + `Url` (avatar) + optional `url` + optional `bio` (`LocalizedText`).
  Each post names its author, which fits guest posts. **Alternative for later:**
  a normalized `Author` table + FK, if authorship becomes a rich entity (author
  pages, aggregated post lists). Not now.
- **Images** — URL + `Json` alt, **nullable** (the domain already treats cover /
  thumbnail as optional), unlike `Project` which requires them.
- **RLS** — public read for `status = PUBLISHED AND deletedAt IS NULL`; writes
  restricted to the service role / future admin. Detailed in PRD 3.

---

## 3. Domain — `packages/core/src/blog`

| Change | Detail |
|--------|--------|
| `BlogPostStatus` enum | `DRAFT \| PUBLISHED \| ARCHIVED`. Validated in `create()` with `Validator … .in(Object.values(BlogPostStatus))`, like `ProjectStatus`. |
| `BlogPost` new fields | `status`, `featured`, `author`. |
| `Author` VO | `packages/core/src/blog/value-objects/Author.ts` — `name` (non-empty), `avatarUrl` (`Url`), `url?` (`Url`), `bio?` (`LocalizedText`). Single `left` per `Validator.validate()`. |
| Invariant | A post may be `PUBLISHED` only with **≥ 1 tag** (`docs/03`'s own example of a context-specific rule). Enforced in `publish()` and in `create()` when `status = PUBLISHED`. |
| Business methods | `publish()` / `archive()` returning `Either<ValidationError, void>`, mirroring `Project`'s status transitions. No public setters. |
| Unchanged | `compareByPublication`, `Tag` VO, `LocalizedText` fields, `Image` VO usage. |

---

## 4. Application — `packages/application/src/blog`

### Repository port

`IBlogPostRepository` stays minimal:

```ts
interface IBlogPostRepository {
  findAll(): Promise<BlogPost[]>;      // all non-deleted posts, any status
  findBySlug(slug: Slug): Promise<BlogPost | null>;
}
```

Few posts + SSG → no need for `findAllPublished()` / query methods. Status
filtering is a use-case concern.

### Status filtering (use cases)

- `ListBlogPosts`, `GetAdjacentBlogPosts` — filter `status === PUBLISHED` before
  mapping/ordering.
- `GetBlogPostBySlug` — return `left` (→ `notFound`) when the post is not
  `PUBLISHED`, so a guessed draft slug 404s in production.
- Net effect: `DRAFT` / `ARCHIVED` / soft-deleted posts never appear in the
  listing, adjacency, RSS, sitemap, or static route generation.

### DTOs

| DTO | Change |
|-----|--------|
| `BlogPostSummaryDTO` | `+ author: { name, avatarUrl, url? }`, `+ featured: boolean`. (`readingTime` added in Phase 5.) |
| `BlogPostLinkDTO` | `+ publishedAt: string` — needed to build the dated href. |
| `BlogPostDetailDTO` | `+ updatedAt?: string`, `+ author.bio?`. (`content` already present.) |

### New use cases (named now, built later)

| Use case | Phase | Purpose |
|----------|-------|---------|
| `ListBlogArchive` | 4 | Group published posts by year → month with counts, for the archive index pages. |
| `ListFeaturedBlogPosts` | 5 | The "Featured articles" band on the listing. |
| `ListBlogPostsByTag` | 5 | Tag pages. |
| `ListRelatedBlogPosts` | 5 | "Further reading" by shared tags. |
| `GetBlogTags` | 5 | All tags with counts / trending. |

---

## 5. Route tree — `apps/site/src/app/[locale]/blog/`

```
page.tsx                                  → listing (existing; Phase 5 adds featured band)
[year]/page.tsx                           → year archive          (Phase 4)
[year]/[month]/page.tsx                   → month archive         (Phase 4)
[year]/[month]/[slug]/page.tsx            → post (moved from [slug]/page.tsx)   (Phase 4)
[year]/[month]/[slug]/opengraph-image.tsx → moved
rss.xml/route.ts                          → existing; item links become dated URLs
```

- `export const dynamicParams = false` on the dynamic routes → an unknown
  `{year}` / `{month}` / `{slug}` 404s automatically. `generateStaticParams`
  emits only real `(year, month, slug)` tuples from published posts.
- **href construction** — reference DTOs carry `publishedAt`; a small
  `apps/site` helper `blogPostPath(locale, publishedAt, slug)` builds
  `/{locale}/blog/{yyyy}/{MM}/{slug}`. Used by cards, prev/next nav, RSS, sitemap.
- `rss.xml` route conflict with the `[year]` segment: Next resolves the static
  `rss.xml` segment before the dynamic `[year]`, so no collision.

---

## 6. Redirects — MVP URLs

- `/[locale]/blog/[slug]` → the dated URL, **`301` permanent**.
- **Mechanism:** a build-time map. `next.config.ts` `redirects()` is async and
  reads the published-post list (`slug → publishedAt`) at config-eval time,
  emitting one redirect per post
  (`{ source: '/:locale/blog/:slug', destination: '/:locale/blog/YYYY/MM/:slug', permanent: true }`).
  Middleware is the fallback if config-eval can't reach the data at build.
- **Sitemap** regenerated with dated URLs; old URLs left out (the `301`s cover
  stragglers).

---

## 7. Documentation reconciliation (part of Phase 0)

| Doc | Change |
|-----|--------|
| `docs/07-I18N.md` § "Blog i18n" | Rewrite: post content is now **Postgres `Json` localized columns (Option A)**, same as portfolio domain content. Drop "MDX-in-Git, one file per locale". The body is an **MDX string per locale** inside the `content` `Json`. |
| `docs/03-BOUNDED-CONTEXTS.md` | Line 12: "content as MDX-in-Git" → "content in Postgres (`Json` localized columns)". Add `BlogPost` to the aggregates table with its invariants (`PUBLISHED` requires ≥ 1 tag; status transitions). |
| `docs/INDEX.md` | Link this design doc. |

**Trusted-content note.** Today the MDX body is "fully trusted" (repo files).
With content in the DB and a future admin, the MDX body could carry arbitrary
JSX / expressions that `next-mdx-remote` evaluates. For v2 (seeded, trusted)
this stays as-is; **the future `apps/admin` needs a constrained MDX subset or
sanitization**. Recorded here, not a Phase 0 blocker.

---

## 8. Phase → PRD breakdown

Each PRD gets its own spec → `parse-prd` → issues cycle.

| PRD | Scope | Layer | Prereq |
|-----|-------|-------|--------|
| **1 — Domain** | `BlogPost` v2 (`status`, `featured`, `author`, `publish()` / `archive()`, tag invariant), `Author` VO, `BlogPostStatus` enum. Tests. | `packages/core` | Phase 0 |
| **2 — Application** | `PUBLISHED` filtering in `ListBlogPosts` / `GetAdjacentBlogPosts` / `GetBlogPostBySlug`; DTO changes (`author`, `featured`, `publishedAt` on the link DTO). Tests. | `packages/application` | PRD 1 |
| **3 — Infra + migration** | Prisma `BlogPost` model + migration + RLS, `PrismaBlogPostRepository` + `BlogPostMapper`, `seedBlogPosts` migrating the 4 posts MDX → TS, remove `FileSystemBlogPostRepository` + fixtures, swap the container. Tests. | `packages/infra`, `apps/site` | **#1021**, PRD 2 |
| **4 — Routes + redirects** | New `[year]/[month]/[slug]` tree, year/month archive pages, `generateStaticParams`, redirect map, dated sitemap + RSS, breadcrumbs + `BreadcrumbList` JSON-LD via `@repo/seo`. | `apps/site` | PRD 3 |
| **5 — Presentation** | Metadata grid, reading time, author byline, TOC + scrollspy, progress bar, code-block diff + dual theme (**#1063**), related posts, prev/next polish, featured band, tag pages + trending, count badges, search. `Prose` primitive (**#1058**) lands just before. | `apps/site` | PRD 4 |
| **6 — Social (deferred)** | Comments (giscus), anonymous reactions, view counts. | `apps/site` | after PRD 5 is stable |

**Overall order:** close #612 / #627 (MVP) → #1021 → Phase 0 (this doc) →
PRD 1 → 2 → 3 → 4 → 5. #1062 runs alongside PRDs 1–4.
