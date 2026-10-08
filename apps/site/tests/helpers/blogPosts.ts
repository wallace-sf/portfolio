import { BlogPostStatus } from '@repo/core/blog';
import { BlogPostBuilder } from '@repo/core/testing';

/**
 * A post whose title/description name its slug, with a per-locale suffix so
 * tests can tell which locale was rendered: `Title <slug>` (en-US),
 * `Title <slug> (pt)`, `Title <slug> (es)`.
 */
export function blogPost(
  slug: string,
  publishedAt: string,
  status = BlogPostStatus.PUBLISHED,
): BlogPostBuilder {
  const localized = (prefix: string) => ({
    'en-US': `${prefix} ${slug}`,
    'pt-BR': `${prefix} ${slug} (pt)`,
    es: `${prefix} ${slug} (es)`,
  });

  return BlogPostBuilder.build()
    .withSlug(slug)
    .withTitle(localized('Title'))
    .withDescription(localized('Description'))
    .withPublishedAt(publishedAt)
    .withStatus(status);
}
