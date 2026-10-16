import type { BlogPostDetailDTO } from '@repo/application/blog';
import { buildBlogPostingJsonLd, type IBlogPostingNode } from '@repo/seo';

import { env } from '~/config/env';

import { blogPostPath } from './paths';

export type PostJsonLd = IBlogPostingNode & { '@context': string };

/** The post's `BlogPosting` JSON-LD, with absolute, locale-prefixed URLs. */
export function buildPostJsonLd(
  post: BlogPostDetailDTO,
  locale: string,
): PostJsonLd {
  const url = `${env.siteUrl}/${locale}${blogPostPath(post.publishedAt, post.slug)}`;
  const { name, url: authorUrl, avatarUrl } = post.author;

  return {
    '@context': 'https://schema.org',
    ...buildBlogPostingJsonLd({
      url,
      headline: post.title,
      description: post.description,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      author: { name, url: authorUrl, image: avatarUrl },
      // The sibling `opengraph-image.tsx` route renders a card for every post.
      image: post.coverImage?.url ?? `${url}/opengraph-image`,
      keywords: post.tags,
      inLanguage: locale,
    }),
  };
}
