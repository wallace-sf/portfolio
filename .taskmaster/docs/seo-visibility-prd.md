# PRD — SEO Visibility

## Context

`apps/site` is already in production with a solid SEO baseline: `sitemap.ts`,
`robots.ts`, a dynamic OG image route (`/og`), an RSS feed
(`[locale]/feed.xml`), and per-page `generateMetadata` (home, about, projects
list, project detail). This PRD closes the remaining gaps that affect how
well the portfolio gets crawled, indexed, and ranked by search engines,
without introducing new infrastructure.

Gaps identified:

1. No `hreflang` alternates between the site's three locales (`en-US`,
   `pt-BR`, `es`) — search engines can't tell that `/en-US/about` and
   `/pt-BR/about` are translations of the same page, and may treat them as
   duplicate content or rank the wrong locale for a given market.
2. No canonical URLs — no explicit signal for the preferred URL of a page.
3. No structured data (JSON-LD) — no `Person`/`WebSite`/`CreativeWork` markup,
   so search engines can't build rich results (knowledge panel, sitelinks,
   breadcrumbs) from the page content.

Explicitly out of scope: Search Console / Bing Webmaster verification. It
requires a verification token the user doesn't have yet and isn't a code
change on its own — it can be added later as a one-line `verification` field
in `generateMetadata` once a token exists.

## Architecture

All new code lives in `apps/site` (presentation layer). None of it touches
`packages/core` or `packages/application` — it's metadata/markup built from
data that Server Components already fetch via existing use cases
(`GetProfile`, `GetProjectBySlug`, `GetPublishedProjects`). This respects the
dependency rule: Server Components call use cases directly, and the new SEO
helpers are pure functions that transform the resulting DTOs into
`Metadata`/JSON-LD shapes — no framework or domain coupling either way.

```
apps/site/src/lib/seo/
  alternates.ts        # buildAlternates(pathname, locale) -> Metadata['alternates']
  structuredData.ts     # buildPersonJsonLd(...), buildProjectJsonLd(...)
apps/site/src/components/JsonLd/
  index.tsx             # <JsonLd data={...}> server component
```

### 1. hreflang alternates + canonical URLs

`buildAlternates(pathname: string, locale: Locale): NonNullable<Metadata['alternates']>`

- `pathname` is the locale-agnostic path: `''`, `'/about'`, `'/projects'`, or
  `'/projects/${slug}'`.
- Returns:
  ```ts
  {
    canonical: `${SITE_URL}/${locale}${pathname}`,
    languages: {
      'en-US': `${SITE_URL}/en-US${pathname}`,
      'pt-BR': `${SITE_URL}/pt-BR${pathname}`,
      es: `${SITE_URL}/es${pathname}`,
      'x-default': `${SITE_URL}/en-US${pathname}`,
    },
  }
  ```
- `SITE_URL` reuses the existing constant from `~/lib/og.ts` (already
  `NEXT_PUBLIC_SITE_URL`-driven) — no new env var.
- Called from the 4 existing `generateMetadata` functions (home, about,
  projects list, project detail) and merged into their returned `Metadata`
  object under the `alternates` key.
- The root layout's existing `alternates.types` (RSS feed) is locale-specific
  and stays as-is; page-level `alternates.languages`/`canonical` from this
  helper take precedence per Next.js metadata merging rules (child overrides
  parent per key), so no conflict.

### 2. JSON-LD structured data

`~/lib/seo/structuredData.ts` exports two pure builders:

- `buildPersonJsonLd({ name, headline, photo, locale }): object` — a
  `@graph` with a `Person` node (`name`, `jobTitle` from `headline`, `image`,
  `url: SITE_URL`, `sameAs: [NEXT_PUBLIC_LINKEDIN_URL, NEXT_PUBLIC_GITHUB_URL].filter(Boolean)`)
  and a `WebSite` node (`name: 'Wallace Ferreira'`, `url: SITE_URL`).
  Rendered once in the root layout (`[locale]/layout.tsx`) using data from the
  `GetProfile` use case, so it's present on every page.
- `buildProjectJsonLd({ title, caption, coverImage, slug, locale }): object` —
  a `CreativeWork` node (`name`, `description`, `image`, `url`) plus a
  `BreadcrumbList` (Home → Projects → project title). Rendered only on the
  project detail page (`projects/[slug]/page.tsx`).

`~components/JsonLd/index.tsx` is a small server component:

```tsx
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
```

The `<` escape prevents `</script>`-breakout since `bio`/`headline`/
`caption` are CMS-editable text that flows into the JSON-LD payload.

## Error Handling

Both builders operate on data the pages already validated (they only render
once `result.isRight()`), so no new Either/left branches are introduced.
`sameAs` filters out any social URL env var that's unset, so a missing
`NEXT_PUBLIC_GITHUB_URL`/`NEXT_PUBLIC_LINKEDIN_URL` degrades gracefully
instead of emitting `undefined` in the JSON-LD.

## Testing

Per `docs/08-TESTING.md`, unit tests colocated with each module:

- `alternates.test.ts` — should build canonical + all 3 language alternates
  + x-default for a given pathname/locale; should handle the empty (home)
  pathname correctly.
- `structuredData.test.ts` — should include required schema.org fields
  (`@context`, `@type`) for `Person`, `WebSite`, `CreativeWork`, and
  `BreadcrumbList`; should omit falsy entries from `sameAs`.
- `JsonLd.test.tsx` — should escape `<` in serialized output to prevent
  script-tag breakout, given a payload containing `</script>`-like text.

No existing tests are expected to break — this is additive metadata only.
