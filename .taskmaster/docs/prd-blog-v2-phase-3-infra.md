# Blog v2 — Phase 3: Infra + Prisma migration (`packages/infra`, `apps/site`)

> Status: proposed — pending review.
> Parent design: [2026-09-01-blog-v2-phase-0-design.md](../../docs/superpowers/specs/2026-09-01-blog-v2-phase-0-design.md) §1, §2, §8.
> Depends on **PRD 2** (Application) — issue #1086, tag `blog-v2-phase-2`, all tasks merged —
> and on **#1021** (infra test / CI gap), the stated Phase 0 prerequisite.
> Related: [02-ARCHITECTURE.md](../../docs/02-ARCHITECTURE.md), [03-BOUNDED-CONTEXTS.md](../../docs/03-BOUNDED-CONTEXTS.md), [08-TESTING.md](../../docs/08-TESTING.md), [09-PATTERNS.md](../../docs/09-PATTERNS.md).

## Goal

Move blog post content from file-backed MDX (`content/posts/<slug>/*.mdx`, read by
`FileSystemBlogPostRepository`) to Supabase/Postgres, fed by a TS seeder exactly
like portfolio projects. This is the "pure infra swap" the
[2026-07-24 MDX-in-Git design](../../docs/superpowers/specs/2026-07-24-blog-mdx-design.md)
was written to enable.

It also lands the piece PRD 1 deferred because it only makes sense once a real
column exists to feed it: **`author`** embedded on `BlogPost` (the domain field,
`create()` wiring, builder method), reading from the new Prisma `author` `Json`
column. `status` / `featured` stay optional-with-default on `IBlogPostProps`
(review decision — not worth the test churn of a full `Project` mirror when the
mapper always supplies a value anyway).

After this PRD, `content/posts/` is deleted, `FileSystemBlogPostRepository` and
its Zod schemas / fixtures are gone, and the blog reads from Postgres through
`PrismaBlogPostRepository` wired in the infra DI container.

## 1. Scope

**In scope**

- **Prisma schema** — `BlogPostStatus` enum + `BlogPost` model per Phase 0 §2
  (localized `Json` fields, nullable images, `author` `Json`, `status`,
  `featured`, `deletedAt`, indexes on `publishedAt` and `[status, publishedAt]`).
- **Migration** `*_add_blog_post_table` — `prisma migrate dev`, applied against
  the **portfolio-dev** Supabase project (confirm `DATABASE_URL` / `DIRECT_URL`
  first — see §7).
- **RLS is out of scope** — Phase 0 §2 mentioned a PUBLISHED-only read policy,
  but no table in the repo has RLS today, Prisma connects over `DIRECT_URL`
  (bypasses RLS), and the SSG build never uses the anon Supabase API. Deferred to
  a dedicated repo-wide issue — see §8.
- **Domain (`packages/core`)** — `author: IAuthorProps` (required) added to
  `IBlogPostProps` and built in the `create()` `collect([...])` chain, exposed as
  `public readonly author: Author`. `status` / `featured` keep their current
  optional-with-default shape (review decision — the mapper always supplies a
  value; a full `Project` mirror isn't worth the test churn).
  `BlogPostBuilder` gains `withAuthor()` + a default fixture author. Domain tests.
- **`PrismaBlogPostRepository`** implementing `IBlogPostRepository`
  (`findAll()` → non-deleted rows, any status; `findBySlug()`), mirroring
  `PrismaProjectRepository` structure.
- **`BlogPostMapper` rewrite** — `toDomain(raw: PrismaBlogPost): BlogPost`
  reading the real `status` column and the `author` `Json`; the
  `status: BlogPostStatus.PUBLISHED` hardcode (PRD 2 R6) is deleted. Add
  `toPrisma` only if a test or the seeder needs it (default: no).
- **`seedBlogPosts(db)`** in `packages/infra/prisma/seeders.ts` — the 4 existing
  posts migrated MDX → inline TS (localized `content` string per locale, a
  fixed `ID.blogPosts.*` uuid map, `author` = the site owner fixture,
  `status: 'PUBLISHED'`, `publishedAt` from each `meta.json`, `featured: true`
  for `the-either-pattern-in-typescript` and `value-objects-vs-primitives`,
  `false` for the other two — §8). Wired into `prisma/seed.ts` `main()`.
- **DI container** — `blogPostRepository` added to the infra `Container`
  (`makeContainer()` in `packages/infra/src/container.ts`), backed by
  `new PrismaBlogPostRepository(prisma)`. The `apps/site` container override in
  `apps/site/src/lib/server/container.ts` is removed entirely.
- **Delete** `FileSystemBlogPostRepository.ts`, `schemas.ts`
  (`MetaJsonSchema` / `MdxFrontmatterSchema` / types), the `ParsedLocaleFiles` /
  `IParsedLocaleFile` types, their exports from `packages/infra/src/index.ts`,
  `packages/infra/test/repositories/blog/FileSystemBlogPostRepository.test.ts`,
  and `packages/infra/test/fixtures/posts/`.
- **Delete** the `content/posts/` directory (4 posts) once the seeder is verified
  against dev.
- **Application (`packages/application`)** — `author` on `BlogPostSummaryDTO`
  (`{ name, avatarUrl, url? }`), `updatedAt?` + `author.bio?` on
  `BlogPostDetailDTO`; `toDTO` wiring in `ListBlogPosts` / `GetBlogPostBySlug`
  (`GetAdjacentBlogPosts.toLink` unchanged — link DTO carries no author).
  Use-case + DTO tests updated.
- **`apps/site`** — no UI change; verify `pnpm --filter @repo/site build`, the
  `/blog` listing, a post page, RSS, sitemap, and the OG image route all still
  render from Postgres.
- **Test factory** `buildPrismaBlogPost` under `packages/infra/test/factories/`.

**Out of scope**

- `IBlogPostRepository` growing query methods (`findPublished()`, …) — Phase 0:
  few posts + SSG, status filtering stays a use-case concern (PRD 2).
- A `save()` on the port / repository, upsert error mapping — no writer exists
  until `apps/admin`; the seeder calls `db.blogPost.upsert` directly like
  `seedProjects`.
- A normalized `Author` table, author pages — Phase 0 §2 defers these.
- URL restructure, `[year]/[month]/[slug]` routes, redirects, dated
  sitemap / RSS — **PRD 4**.
- Author byline UI, reading time, metadata grid, featured band — **PRD 5**. This
  PRD only makes `author` / `featured` *available* on the DTOs.
- MDX rendering changes — `PostBody` still compiles a raw string via
  `next-mdx-remote/rsc`; `content` stays a string per locale.
- A CI Postgres job for the new integration test — covered by #1021's own AC;
  this PRD's new integration suite follows whatever gating #1021 establishes.

## 2. Design constraints

- **Dependency rule** — Prisma stays inside `packages/infra`. `core` /
  `application` never import `@prisma/client`. The mapper depends on
  `@repo/core/blog` (`BlogPost`, `BlogPostStatus`, `Author`, `IBlogPostProps`).
- **Mirror `Project`** — schema conventions (localized fields as `Json`
  `{ "en-US", "pt-BR", "es" }`), `PrismaProjectRepository` /
  `ProjectMapper` structure, `seedProjects` upsert shape,
  `buildPrismaProject` factory. Images are **nullable** on `BlogPost` (the domain
  treats cover / thumbnail as optional), unlike `Project`.
- **Either everywhere** — `BlogPostMapper.toDomain` throws
  `InfrastructureError` on a `Left` from `BlogPost.create()` (same as
  `ProjectMapper`); that is an infra-boundary failure, not a domain rule.
- **One `Validator`, one `left`** in the domain changes; never rename
  `error` / `isValid` when destructuring.
- **No hardcoded `Validator` messages** in domain code — code only.
- Files stay under 200 lines. `BlogPostMapper.ts` and `BlogPost.ts` are the ones
  to watch; extract the `author` assembly or a `toLocalized` helper if needed.
- **`deletedAt` filtering is the repository's job** (`where: { deletedAt: null }`
  in `findAll`); **`status` filtering is the use case's job** (`publishedOnly`,
  PRD 2). Do not add a status filter to the repository.
- Test naming `should <expected behavior> when <context>`; behavior-focused.
- Integration tests that touch a live DB are gated per #1021 (env check wrapping
  the whole file, `*.integration.test.ts` suffix). The `BlogPostMapper` unit
  test stays a pure unit test (no DB).

## 3. Requirements

### R1 — Prisma schema + migration

Add to `packages/infra/prisma/schema.prisma` (Phase 0 §2, verbatim shape):

```prisma
enum BlogPostStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

model BlogPost {
  id                String         @id @default(uuid()) @db.Uuid
  slug              String         @unique
  title             Json
  description       Json
  content           Json
  tags              String[]
  author            Json
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

Migration name: `add_blog_post_table`. Generated with `prisma migrate dev`; the
Prisma client is regenerated (`db.blogPost` becomes available). Nothing consumes
the model until R3, so this requirement is TS-inert on its own.

### R2 — Domain: `author`

`packages/core/src/blog/entities/BlogPost.ts`:

```ts
export interface IBlogPostProps extends IEntityProps {
  // …existing…
  status?: BlogPostStatus;  // unchanged — optional, defaults to DRAFT in create()
  featured?: boolean;       // unchanged — optional, defaults to false in create()
  author: IAuthorProps;     // new, required
}
```

- Add `Author.create(props.author)` to the `collect([...])` array in `create()`;
  the first inner `left` propagates (an invalid author surfaces as
  `INVALID_AUTHOR` / `INVALID_PERSON_NAME`, matching how `Image` propagates
  `INVALID_URL`).
- Expose `public readonly author: Author`; assign in the private constructor.
- `status` / `featured` handling — the `?? DRAFT` / `?? false` defaults and the
  `.in(Object.values(BlogPostStatus))` + `PUBLISHED ⇒ tags.length > 0`
  `Validator` chain (PRD 1 R3/R4) are all unchanged.
- `BlogPostBuilder` (`packages/core/test/helpers/builders/BlogPostBuilder.ts`) —
  add `withAuthor(props)`, default the author to a stable fixture
  (`Wallace Ferreira` + the real Supabase avatar URL used by `seedProfile`).
  Existing `.build()` defaults (`status: DRAFT`, `featured: false`) stay.
- Existing `packages/core` blog tests that call `BlogPost.create` directly with a
  bare props object need the `author` key added (or switch to the builder).

### R3 — `PrismaBlogPostRepository` + `BlogPostMapper` rewrite

`packages/infra/src/repositories/blog/PrismaBlogPostRepository.ts`:

```ts
export class PrismaBlogPostRepository implements IBlogPostRepository {
  constructor(private readonly db: PrismaClient) {}

  async findAll(): Promise<BlogPost[]> {
    const rows = await this.db.blogPost.findMany({
      where: { deletedAt: null },
      orderBy: { publishedAt: 'desc' },
    });
    return rows.map(BlogPostMapper.toDomain);
  }

  async findBySlug(slug: Slug): Promise<BlogPost | null> {
    const row = await this.db.blogPost.findFirst({
      where: { slug: slug.value, deletedAt: null },
    });
    return row ? BlogPostMapper.toDomain(row) : null;
  }
}
```

`BlogPostMapper` — replace the current `toDomain(meta, locales)` signature with
`toDomain(raw: PrismaBlogPost): BlogPost`:

- localized `Json` columns → `ILocalizedTextInput` (cast, like `ProjectMapper`);
- `author` `Json` → `IAuthorProps` (cast);
- `status: raw.status as BlogPostStatus`, `featured: raw.featured`;
- images: `raw.coverImageUrl ? { url, alt } : undefined` (nullable);
- `publishedAt: raw.publishedAt.toISOString()`,
  `created_at` / `updated_at` / `deleted_at` from the row;
- `Left` → `throw new InfrastructureError(...)`.

Delete the old `toLocalizedInput` / `ParsedLocaleFiles` machinery. Keep the file
under 200 lines.

### R4 — `seedBlogPosts`

`packages/infra/prisma/seeders.ts` — new `export async function seedBlogPosts(db)`,
same upsert-in-a-loop shape as `seedProjects`. The 4 posts
(`one-validator-one-left`, `server-components-as-composition-root`,
`the-either-pattern-in-typescript`, `value-objects-vs-primitives`) migrated from
`content/posts/*`:

- `content` — the current `*.mdx` bodies (frontmatter stripped) as a localized
  `Json` string per locale;
- `title` / `description` — from each locale file's frontmatter;
- `tags`, `publishedAt` — from `meta.json`;
- `author` — the site-owner fixture (`ID.blogPosts` uuid map added to the `ID`
  const);
- `status: 'PUBLISHED'`; `featured: true` for `the-either-pattern-in-typescript`
  and `value-objects-vs-primitives`, `false` for the other two (§8);
- no cover / thumbnail (the current posts have none).

Wire `await seedBlogPosts(prisma)` into `prisma/seed.ts` `main()`.

### R5 — DI container + `apps/site`

- `packages/infra/src/container.ts` — add `blogPostRepository: IBlogPostRepository`
  to `Container`, `new PrismaBlogPostRepository(prisma)` in `makeContainer()`.
  Import `IBlogPostRepository` from `@repo/application/blog`.
- `apps/site/src/lib/server/container.ts` — delete `BLOG_CONTENT_DIR`, the
  `FileSystemBlogPostRepository` import / instantiation, and the
  `blogPostRepository` extension of the type; `getServerContainer()` returns
  `getInfraContainer()` (now already carrying `blogPostRepository`). If nothing
  else remains app-specific, collapse the file to a re-export.
- `packages/infra/src/index.ts` — export `PrismaBlogPostRepository`; drop
  `FileSystemBlogPostRepository`, `MetaJsonSchema`, `MdxFrontmatterSchema`,
  `MetaJson`, `MdxFrontmatter`, `IParsedLocaleFile`, `ParsedLocaleFiles`. Keep
  `BlogPostMapper` exported.
- `apps/site/src/app/[locale]/blog/[slug]/opengraph-image.tsx` — the comment
  about the edge runtime not being able to use `FileSystemBlogPostRepository` is
  now stale; the OG image already runs its data fetch at build via
  `generateStaticParams` + `ListBlogPosts`, so confirm it still builds and drop
  the obsolete note.

### R6 — Application DTOs

`BlogPostSummaryDTO`:

```ts
export type BlogPostAuthorDTO = {
  name: string;
  avatarUrl: string;
  url?: string;
};

export type BlogPostSummaryDTO = {
  // …existing…
  author: BlogPostAuthorDTO; // ← new
};
```

`BlogPostDetailDTO`:

```ts
export type BlogPostDetailDTO = BlogPostSummaryDTO & {
  content: string;
  updatedAt?: string;                       // ← new
  author: BlogPostAuthorDTO & { bio?: string }; // ← bio only on the detail view
};
```

Mapper wiring:

- `ListBlogPosts.toDTO` / `GetBlogPostBySlug.toDTO` — add
  `author: { name: post.author.name.value, avatarUrl: post.author.avatarUrl.value, url: post.author.url?.value }`.
- `GetBlogPostBySlug.toDTO` — also `updatedAt: post.updated_at.value` and
  `author.bio: post.author.bio?.get(locale)`.
- `GetAdjacentBlogPosts.toLink` — unchanged.

`dtos/index.ts` re-exports the new `BlogPostAuthorDTO`.

### R7 — Docs

Phase 0 §7 already reconciled `docs/03-BOUNDED-CONTEXTS.md` and `docs/07-I18N.md`
with the Postgres model. Verify they are current; only touch them if stale. No
new doc change is expected in this PRD.

## 4. Acceptance criteria

- [ ] `prisma migrate dev` applied to portfolio-dev; `BlogPost` table + enum +
      indexes exist; `prisma migrate status` clean.
- [ ] `BlogPost.create()` requires `author` and exposes it; an invalid `author`
      yields a single `left`; `status` / `featured` still default when omitted;
      `@repo/core` tests green, no file > 200 lines.
- [ ] `PrismaBlogPostRepository.findAll()` returns non-deleted posts of any
      status, newest first; `findBySlug()` returns `null` for a missing /
      soft-deleted slug.
- [ ] `BlogPostMapper.toDomain` maps a Prisma row (real `status`, `author` Json,
      nullable images) to a `BlogPost`; throws `InfrastructureError` on a domain
      `Left`. No `status: PUBLISHED` hardcode remains.
- [ ] `seedBlogPosts` upserts the 4 posts; `pnpm --filter @repo/infra db:seed`
      (or the repo's seed command) against dev populates them as `PUBLISHED`.
- [ ] `FileSystemBlogPostRepository`, `schemas.ts`, the filesystem test, the
      `test/fixtures/posts/` dir, and `content/posts/` are deleted; no dangling
      imports (`pnpm -w lint` / `types` green).
- [ ] `blogPostRepository` resolves from the infra container;
      `apps/site/src/lib/server/container.ts` no longer references the filesystem.
- [ ] `BlogPostSummaryDTO.author` and `BlogPostDetailDTO.updatedAt` /
      `author.bio` populated from the domain object; `@repo/application` tests
      green.
- [ ] `pnpm --filter @repo/site build` succeeds; `/blog` lists all 4 posts, a
      post page renders, RSS + sitemap + OG image still produced.
- [ ] Infra **unit** tests (incl. `BlogPostMapper`) run in `test:ci` (via #1021).
- [ ] No new `IBlogPostRepository` method; no new error code.

## 5. Files

**Create**

- `packages/infra/prisma/migrations/*_add_blog_post_table/migration.sql`
- `packages/infra/src/repositories/blog/PrismaBlogPostRepository.ts`
- `packages/infra/test/factories/prisma-blog-post.factory.ts`
- `packages/infra/test/repositories/blog/PrismaBlogPostRepository.integration.test.ts`
- `packages/application/src/blog/dtos/BlogPostAuthorDTO.ts` (or inline in `BlogPostSummaryDTO.ts`)

**Update**

- `packages/infra/prisma/schema.prisma`
- `packages/infra/prisma/seeders.ts` (`seedBlogPosts`, `ID.blogPosts`)
- `packages/infra/prisma/seed.ts`
- `packages/infra/src/repositories/blog/BlogPostMapper.ts` (rewrite)
- `packages/infra/src/repositories/blog/index.ts`
- `packages/infra/src/container.ts`
- `packages/infra/src/index.ts`
- `packages/infra/test/repositories/blog/BlogPostMapper.test.ts` (rewrite)
- `packages/core/src/blog/entities/BlogPost.ts`
- `packages/core/test/helpers/builders/BlogPostBuilder.ts`
- `packages/core/test/blog/BlogPost.test.ts` (author key / builder)
- `packages/application/src/blog/dtos/BlogPostSummaryDTO.ts`
- `packages/application/src/blog/dtos/BlogPostDetailDTO.ts`
- `packages/application/src/blog/dtos/index.ts`
- `packages/application/src/blog/use-cases/ListBlogPosts.ts`
- `packages/application/src/blog/use-cases/GetBlogPostBySlug.ts`
- `packages/application/test/blog/ListBlogPosts.test.ts`
- `packages/application/test/blog/GetBlogPostBySlug.test.ts`
- `apps/site/src/lib/server/container.ts`
- `apps/site/src/app/[locale]/blog/[slug]/opengraph-image.tsx` (stale comment)

**Delete**

- `packages/infra/src/repositories/blog/FileSystemBlogPostRepository.ts`
- `packages/infra/src/repositories/blog/schemas.ts`
- `packages/infra/test/repositories/blog/FileSystemBlogPostRepository.test.ts`
- `packages/infra/test/fixtures/posts/**`
- `content/posts/**`

## 6. Test plan

**`BlogPost` (core)**

- creates a post when `author` is valid and `status` / `featured` are provided
- returns a single `left` when `author.name` / `author.avatarUrl` is invalid
- exposes `author` on the created post
- existing status / invariant / transition tests still pass (author key added)

**`BlogPostMapper` (infra unit)**

- maps a Prisma row → `BlogPost` with the row's `status` (not hardcoded)
- maps `author` Json → `Author`; maps `bio` when present
- maps a row with null cover / thumbnail → `coverImage` / `thumbnailImage`
  `undefined`
- throws `InfrastructureError` when the row violates a domain rule (PUBLISHED +
  empty `tags`)

**`PrismaBlogPostRepository` (infra integration, gated)**

- `findAll` returns non-deleted posts of every status, ordered `publishedAt` desc
- `findAll` excludes a soft-deleted post
- `findBySlug` returns the post / `null` for missing / `null` for soft-deleted

**`ListBlogPosts` / `GetBlogPostBySlug` (application)**

- `author` present on every summary DTO
- `GetBlogPostBySlug` returns `updatedAt` and `author.bio` (locale-resolved)
- existing published-only / ordering / not-found tests unchanged

**Manual (`apps/site`)**

- `pnpm --filter @repo/site build` green after seeding dev
- `/en-US/blog`, `/pt-BR/blog`, one post page, `rss.xml`, `sitemap.xml`, an OG
  image URL all render with DB-backed content

## 7. Operational notes

- **Confirm the target DB before `migrate` / `seed`** — `DATABASE_URL` /
  `DIRECT_URL` must point at the **portfolio-dev** Supabase project, never
  production ([memory: seed-migration-dev-db]).
- `content/posts/` is deleted only **after** a dev seed run confirms the 4 posts
  render identically (same slugs, same bodies).
- Production rollout (running the migration + seed against prod) is a deploy
  step, tracked with the PR, not part of the code review.

## 8. Decisions (resolved during scoping)

- **`status` / `featured` stay optional-with-default** on `IBlogPostProps` — not
  worth the `packages/core` test churn of a full `Project` mirror when the mapper
  always supplies a value. Only `author` becomes a required prop.
- **Seed `featured`:** `the-either-pattern-in-typescript` and
  `value-objects-vs-primitives` seeded `featured: true`; the other two `false`.
  Gives PRD 5's featured band real data to render.
- **Slice order for `parse-prd`:** (a) schema + migration →
  (b) core `author` **+** `BlogPostMapper` rewrite + `PrismaBlogPostRepository`
  + container + delete filesystem repo (one green "swap" slice) →
  (c) `seedBlogPosts` + seed wiring + run against dev + delete `content/posts/` →
  (d) application DTOs (`author`, `updatedAt`) + wiring + tests →
  (e) `apps/site` build / RSS / sitemap / OG verification + AC checklist.
- **`IBlogPostRepository` stays read-only** (`findAll` / `findBySlug`). No
  speculative `save()` — the seeder calls `db.blogPost.upsert` directly like
  `seedProjects`; a writer + upsert error mapping arrive with `apps/admin`.
- **RLS deferred.** Phase 0 §2 floated a PUBLISHED-only read policy, but no table
  in the repo uses RLS, Prisma bypasses it via `DIRECT_URL`, and the SSG build
  never touches the anon API. When the anon Supabase API or `apps/admin` (anon
  key) is introduced, handle RLS for all public tables in one dedicated issue.
