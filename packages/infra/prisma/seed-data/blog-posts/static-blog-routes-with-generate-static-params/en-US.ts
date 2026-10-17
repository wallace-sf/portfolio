export const content = `Every post on this blog lives at a dated URL, \`/{locale}/blog/{yyyy}/{MM}/{slug}\`, and every one
of those pages is HTML generated at build time. Three small pieces make that work.

## One function lists every route

\`generateStaticParams\` returns the params of every page to prerender. The post page and its
OpenGraph image need exactly the same list, so it lives in one route-glue file next to them:

\`\`\`ts
export async function blogPostStaticParams(): Promise<BlogPostRouteParams[]> {
  const result = await new ListBlogPosts(
    getServerContainer().blogPostRepository,
  ).execute({ locale: DEFAULT_LOCALE });

  if (result.isLeft()) return [];

  return LOCALES.flatMap((locale) =>
    result.value.map(({ publishedAt, slug }) => ({
      locale,
      ...publicationSegments(publishedAt),
      slug,
    })),
  );
}
\`\`\`

It calls the same use case as the listing page, so a draft can never get a route: \`ListBlogPosts\`
only returns published posts. The year and month come from \`publicationSegments\`, which reads the
date in UTC so the build machine's timezone can't move a post to another month.

## Everything else is a 404

\`\`\`ts
export const dynamicParams = false;
export const generateStaticParams = blogPostStaticParams;
\`\`\`

With \`dynamicParams = false\`, any URL that isn't in the list is a 404 in production: an unknown
slug, an unpublished post, or a real slug under the wrong month. Nothing renders on demand.

\`next dev\` ignores that and renders any params, so the page checks again before rendering. It
loads the post by slug and compares the URL's year and month with its publication date; a mismatch
calls \`notFound()\`. Both environments give the same answer.

## SEO falls out of the same data

The URL is built in one place, \`blogPostPath(publishedAt, slug)\`, and everything that needs it
reuses it:

- **Metadata**: the canonical URL and the \`hreflang\` alternates for every locale come from
  \`buildAlternates(path, locale)\`.
- **Sitemap**: \`sitemap.ts\` calls \`ListBlogPosts\` and maps each post through
  \`blogPostPath\` for every locale.
- **Links**: cards, breadcrumbs and prev/next all use the same helper.

Because the page list, the sitemap and the links read the same use case and the same path
helper, they can't disagree. A post that is in the sitemap has a page, and a page always has
its canonical URL.
`;
