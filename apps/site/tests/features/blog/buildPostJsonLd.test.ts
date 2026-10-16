import { describe, expect, it } from 'vitest';

import type { BlogPostDetailDTO } from '@repo/application/blog';

import { env } from '~/config/env';
import { buildPostJsonLd } from '~features/blog/buildPostJsonLd';

const POST: BlogPostDetailDTO = {
  slug: 'the-either-pattern',
  title: 'The Either Pattern',
  description: 'Why this codebase never throws for domain errors.',
  publishedAt: '2026-08-01T00:00:00.000Z',
  readingMinutes: 4,
  featured: false,
  tags: ['typescript', 'ddd'],
  author: {
    name: 'Test Author',
    avatarUrl: 'https://example.com/avatar.png',
    url: 'https://example.com',
  },
  content: '# The Either Pattern',
};

const POST_URL = `${env.siteUrl}/pt-BR/blog/2026/08/the-either-pattern`;

describe('buildPostJsonLd', () => {
  it('should describe the post at its absolute, locale-prefixed dated URL', () => {
    const jsonLd = buildPostJsonLd(POST, 'pt-BR');

    expect(jsonLd).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      url: POST_URL,
      headline: 'The Either Pattern',
      datePublished: '2026-08-01T00:00:00.000Z',
      inLanguage: 'pt-BR',
      keywords: 'typescript, ddd',
      author: {
        name: 'Test Author',
        url: 'https://example.com',
        image: 'https://example.com/avatar.png',
      },
    });
  });

  it('should use the cover image when the post has one', () => {
    const coverImage = { url: 'https://cdn/cover.webp', alt: 'Cover' };

    expect(buildPostJsonLd({ ...POST, coverImage }, 'pt-BR').image).toBe(
      'https://cdn/cover.webp',
    );
  });

  it('should fall back to the post OG image when the post has no cover', () => {
    expect(buildPostJsonLd(POST, 'pt-BR').image).toBe(
      `${POST_URL}/opengraph-image`,
    );
  });
});
