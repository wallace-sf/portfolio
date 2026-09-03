# Blog v2 — Phase 1: Domain (`packages/core/src/blog`)

> Status: proposed — pending review.
> Parent design: [2026-09-01-blog-v2-phase-0-design.md](../../docs/superpowers/specs/2026-09-01-blog-v2-phase-0-design.md) §3, §8.
> Tracked by #1069. Depends on #1067 (Phase 0, merged via #1068).
> Related: [03-BOUNDED-CONTEXTS.md](../../docs/03-BOUNDED-CONTEXTS.md), [06-VALIDATION.md](../../docs/06-VALIDATION.md), [09-PATTERNS.md](../../docs/09-PATTERNS.md).

## Goal

Evolve the `BlogPost` aggregate from its MVP shape (slug, localized title /
description / content, tags, `publishedAt`, optional cover / thumbnail) into the
Blog v2 shape: a lifecycle (`DRAFT | PUBLISHED | ARCHIVED`), a `featured` flag, an
embedded `Author`, business methods for status transitions, and the invariant that
a post can only be `PUBLISHED` with at least one tag.

This is the first buildable slice of Blog v2. It is **domain-only** — everything
lands in `packages/core/src/blog` with tests in `packages/core/test`. No
application, infra, Prisma, route, or `apps/site` change is in scope; those are
PRDs 2–5.

## 1. Scope

**In scope**

- New enum `BlogPostStatus` (`DRAFT | PUBLISHED | ARCHIVED`).
- New value object `Author` (`packages/core/src/blog/value-objects/Author.ts`).
- `BlogPost` gains three fields: `status: BlogPostStatus`, `featured: boolean`,
  `author: Author`.
- `BlogPost` gains business methods `publish()` and `archive()` returning
  `Either<ValidationError, void>`, mirroring `Project`'s transitions.
- Invariant: a post may be `PUBLISHED` only with `tags.length >= 1`. Enforced in
  `BlogPost.create()` (when the incoming `status` is `PUBLISHED`) and in
  `publish()`.
- `BlogPost.create()` validates `status` with `Validator … .in(Object.values(BlogPostStatus))`,
  like `Project`.
- Barrel exports (`packages/core/src/blog/index.ts`) updated for the new symbols.
- New `ERROR_MESSAGE` entries only if review adopts a distinct code (see R4); the
  default reuses `BlogPost.ERROR_CODE`, which already has entries.
- `BlogPostBuilder` (`packages/core/test/helpers/builders/BlogPostBuilder.ts`)
  extended with `withStatus`, `withFeatured`, `withAuthor`, sensible defaults, and
  the existing tests updated for the new required props.
- Unit tests for `Author`, `BlogPostStatus` handling, the invariant, and the
  transition methods.

**Out of scope**

- `IBlogPostRepository` / use-case / DTO changes (PRD 2).
- Prisma model, migration, RLS, `PrismaBlogPostRepository`, `BlogPostMapper`,
  seeder (PRD 3).
- URL restructure, archive pages, redirects, `generateStaticParams` (PRD 4).
- Reading time, author byline UI, any presentation concern (PRD 5).
- A normalized `Author` table / author pages — explicitly deferred in Phase 0 §2.
- Domain events for publish / archive — not needed until a consumer exists.

## 2. Design constraints

Follow the repository conventions (`CLAUDE.md`, `docs/06-VALIDATION.md`,
`docs/09-PATTERNS.md`):

- Either pattern for all fallible construction and all business-rule failures —
  never `throw` for domain errors.
- One `left` per validation flow. Use `Validator` from `@repo/utils/validator`
  with chained rules and a single `if (!isValid) return left(...)` after
  `.validate()`. No manual `if` guards for invariants.
- Never rename `error` / `isValid` when destructuring `Validator.validate()`; use
  a `{}` block if scopes collide.
- No hardcoded message strings passed to `Validator` rule methods in domain code —
  only the error `code`. The user-facing message is resolved later from
  `ERROR_MESSAGE`.
- VO vs primitive boundary (`CLAUDE.md`): `Author` is a rich, reused concept → a
  Value Object. `status` is a stable enum, entity-local → primitive enum +
  `Validator .in()` in `create()` (mirror `ProjectStatus`). `featured` is a plain
  boolean, no validation.
- Files stay under 200 lines. `BlogPost.ts` is already ~140 lines; if the new
  fields + methods push it past 200, extract the transition logic or the
  create-time field assembly into a helper within `packages/core/src/blog`.
- Test naming: `should <expected behavior> when <context>`.

## 3. Requirements

### R1 — `BlogPostStatus` enum

`packages/core/src/blog/value-objects/BlogPostStatus.ts` (or `entities/` —
match wherever `ProjectStatus` sits relative to `Project`; `ProjectStatus` lives
next to `Project` in `entities/project/model/`, so co-locate with `BlogPost`).

```ts
export enum BlogPostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}
```

Exported from `packages/core/src/blog/index.ts`.

### R2 — `Author` value object

`packages/core/src/blog/value-objects/Author.ts`, extending `ValueObject`.

**Props** (`IAuthorProps`):

| Prop | Type | Rule |
|------|------|------|
| `name` | `string` | trimmed, non-empty, length 2–100 |
| `avatarUrl` | `string` | valid URL — reuse the shared `Url` VO |
| `url` | `string \| undefined` | when present, valid URL (`Url` VO) |
| `bio` | `ILocalizedTextInput \| undefined` | when present, valid `LocalizedText`; **not** required to have all locales (unlike post body) |

**Exposed** (readonly): `name: string`, `avatarUrl: Url`, `url: Url | undefined`,
`bio: LocalizedText | undefined`.

- `static readonly ERROR_CODE = 'INVALID_AUTHOR'`.
- `static create(props: IAuthorProps): Either<ValidationError, Author>`.
- Build the inner VOs with `collect([...])` (like `BlogPost.create`), then a
  single `Validator` chain for `name` and the optional-field presence rules, then
  one `left` on failure.
- Private constructor; equality via the `ValueObject` base (structural on the
  serialized props).
- Exported from `packages/core/src/blog/index.ts`.

### R3 — `BlogPost` new fields

Extend `IBlogPostProps`:

```ts
export interface IBlogPostProps extends IEntityProps {
  // …existing…
  status: BlogPostStatus;
  featured: boolean;
  author: IAuthorProps;
}
```

`BlogPost` exposes `public readonly status: BlogPostStatus` (mutable internally
for transitions — see R5; model it like `Project.status`, which is `public status`
with no external setter but reassigned by `publish()` / `archive()`),
`public readonly featured: boolean`, `public readonly author: Author`.

In `create()`:

- Add `Author.create(props.author)` to the `collect([...])` block.
- After the existing locale checks, validate `status` with
  `Validator.of(props.status).in(Object.values(BlogPostStatus)).validate()` → one
  `left` with `BlogPost.ERROR_CODE` on failure.
- `featured` is assigned as-is (no rule).

### R4 — "PUBLISHED requires ≥ 1 tag" invariant

- In `create()`: after tags are parsed, if `props.status === BlogPostStatus.PUBLISHED`
  and `tags.length === 0`, return `left(new ValidationError({ code: BlogPost.PUBLISHED_WITHOUT_TAGS }))`
  — expressed through a `Validator .refine()` in the same flow, not a bare `if`.
- **Established precedent:** `Project.create()`, `Project.publish()` and
  `Project.archive()` all return a single `Project.ERROR_CODE` (`'INVALID_PROJECT'`)
  for every failure path — no per-rule codes. Matching that, the default here is
  to reuse `BlogPost.ERROR_CODE` (`'INVALID_BLOG_POST'`) for this invariant too,
  and no new `ERROR_MESSAGE` entry is needed.
- Deviation to weigh in review: a distinct `BLOG_POST_PUBLISHED_WITHOUT_TAGS`
  code so a future admin form can tell the author *which* rule failed. This
  breaks the current one-code-per-entity pattern and is really a #980 question;
  flagged, not adopted.

### R5 — `publish()` / `archive()` transitions

Mirror `Project.publish()` / `Project.archive()`:

```ts
publish(): Either<ValidationError, void> {
  // rule 1: not already PUBLISHED
  // rule 2: this.tags.length >= 1   (the R4 invariant, at transition time)
  // on success: this.status = BlogPostStatus.PUBLISHED; return right(undefined)
}

archive(): Either<ValidationError, void> {
  // rule: not already ARCHIVED
  // on success: this.status = BlogPostStatus.ARCHIVED; return right(undefined)
}
```

- Both use a single `Validator` chain and one `left`.
- `publish()` from `DRAFT` or `ARCHIVED` is allowed (re-publishing an archived
  post). Only "already in the target state" is rejected — same shape as `Project`.
- Error code: `Project.publish()` / `archive()` both return
  `new ValidationError({ code: Project.ERROR_CODE })` on the "already in target
  state" path. Match that — return `new ValidationError({ code: BlogPost.ERROR_CODE })`.
  No new `ERROR_MESSAGE` entry needed.
- No `unpublish()` / `toDraft()` — not needed yet.

### R6 — `compareByPublication` unchanged

No change. Called out only so the implementer does not touch it.

### R7 — `BlogPostBuilder` + existing test updates

- `BlogPostBuilder.build()` defaults: `status: BlogPostStatus.PUBLISHED`,
  `featured: false`, `author: { name: 'Wallace Ferreira', avatarUrl: <valid url> }`
  (keep the default a valid PUBLISHED post so existing `packages/core` and, later,
  `packages/application` builder consumers keep working with no churn).
- Add `withStatus(status)`, `withFeatured(flag)`, `withAuthor(props)`.
- Update any existing `BlogPost` test / builder call that now fails type-check for
  the new required props.

### R8 — Barrel + docs

- `packages/core/src/blog/index.ts` exports `BlogPostStatus`, `Author`,
  `IAuthorProps`.
- No `docs/` change in this PRD — Phase 0 already reconciled `03-BOUNDED-CONTEXTS.md`
  and `07-I18N.md` with the planned domain shape.

## 4. Acceptance criteria

- [ ] `BlogPostStatus` enum exists and is exported from `@repo/core/blog`.
- [ ] `Author` VO exists, validates `name` (2–100, non-empty), `avatarUrl` (URL),
      optional `url` (URL when present), optional `bio` (`LocalizedText` when
      present); returns exactly one `left` per invalid input; is exported.
- [ ] `BlogPost.create()` requires `status`, `featured`, `author`; rejects an
      invalid `status` value; rejects `PUBLISHED` + zero tags with a
      `ValidationError`.
- [ ] `BlogPost.create()` with `status: DRAFT` and zero tags succeeds.
- [ ] `publish()` sets `status` to `PUBLISHED` from `DRAFT`/`ARCHIVED` when the
      post has ≥ 1 tag; returns `left` when already `PUBLISHED`; returns `left`
      when the post has no tags.
- [ ] `archive()` sets `status` to `ARCHIVED`; returns `left` when already
      `ARCHIVED`.
- [ ] Both methods mutate only via the method (no public setter added).
- [ ] Failure paths reuse `BlogPost.ERROR_CODE` (default), or, if review adopts a
      distinct code, it has `pt-BR` + `en-US` entries in `ERROR_MESSAGE`.
- [ ] `BlogPostBuilder` supports the new fields with valid defaults; all existing
      `packages/core` blog tests pass unchanged in intent.
- [ ] `pnpm --filter @repo/core test` green; `pnpm --filter @repo/core lint` and
      `types` clean.
- [ ] No file in `packages/core/src/blog` exceeds 200 lines.
- [ ] No change outside `packages/core` (verified by the PR diff).

## 5. Files

- `packages/core/src/blog/value-objects/BlogPostStatus.ts` ← create
- `packages/core/src/blog/value-objects/Author.ts` ← create
- `packages/core/src/blog/entities/BlogPost.ts` ← update (fields, `create()`,
  `publish()`, `archive()`, error codes)
- `packages/core/src/blog/index.ts` ← update (exports)
- `packages/core/src/shared/i18n/ERROR_MESSAGE.ts` ← update **only if** review
  adopts a distinct error code (default: no change, reuse `BlogPost.ERROR_CODE`)
- `packages/core/test/helpers/builders/BlogPostBuilder.ts` ← update
- `packages/core/test/blog/Author.test.ts` ← create
- `packages/core/test/blog/BlogPost.test.ts` ← update / create (status, invariant,
  transitions)
- `packages/core/test/blog/BlogPostStatus.test.ts` ← create only if there is
  logic to test beyond the enum literal (probably folded into `BlogPost.test.ts`)

## 6. Test plan

Unit tests, behavior-focused (`docs/08-TESTING.md`).

**`Author`**

- should create an author when name, avatarUrl are valid and url/bio are omitted
- should create an author when url and bio are provided and valid
- should return left when name is empty / whitespace
- should return left when name is shorter than 2 / longer than 100
- should return left when avatarUrl is not a valid URL
- should return left when url is present but invalid
- should return left when bio is present but not a valid LocalizedText
- should return a single left when multiple fields are invalid
- should treat two authors with the same props as equal

**`BlogPost` — status & fields**

- should create a post when status is DRAFT and there are no tags
- should create a post when status is PUBLISHED and there is at least one tag
- should return left when status is not a BlogPostStatus value
- should return left when status is PUBLISHED and tags is empty
- should expose featured and author on the created post

**`BlogPost` — publish()**

- should set status to PUBLISHED when called on a DRAFT post with tags
- should set status to PUBLISHED when called on an ARCHIVED post with tags
- should return left when the post is already PUBLISHED
- should return left when the post has no tags
- should not change status when publish() returns left

**`BlogPost` — archive()**

- should set status to ARCHIVED when called on a DRAFT post
- should set status to ARCHIVED when called on a PUBLISHED post
- should return left when the post is already ARCHIVED

**Regression**

- existing `BlogPost.create` locale-completeness tests still pass
- `compareByPublication` tests unchanged

## 7. Dependencies

- **#1067 / Phase 0** — done (merged via #1068). This PRD implements Phase 0 §3.
- No blocking dependency on #1021, #1062, #980 — those gate PRD 3 (infra) and the
  error-code convention question in R4 (a review decision here, not a blocker).

## 8. Open questions (resolve in review)

1. **One blog-post error code or several?** `Project` uses a single
   `Project.ERROR_CODE` for `create()` + `publish()` + `archive()`. This PRD's
   default follows that precedent (reuse `BlogPost.ERROR_CODE`). The alternative —
   distinct codes like `BLOG_POST_PUBLISHED_WITHOUT_TAGS` so a future admin form
   can surface which rule failed — is a repo-wide convention change and belongs to
   #980, not this PRD.
2. **`BlogPostStatus` file location** — next to `BlogPost` in `entities/` (like
   `ProjectStatus` next to `Project`) vs `value-objects/`. Default: match
   `ProjectStatus`.
3. **`Author` default in `BlogPostBuilder`** — a shared fixture author vs a
   generated one. Default: a stable fixture (`Wallace Ferreira` + a real avatar
   URL) so snapshot-ish assertions stay readable.
