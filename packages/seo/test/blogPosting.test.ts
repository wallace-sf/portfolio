import { describe, expect, it } from 'vitest';

import { buildBlogPostingJsonLd } from '../src/blogPosting';

const INPUT = {
  url: 'https://example.com/en-US/blog/2026/08/the-either-pattern',
  headline: 'The Either Pattern',
  description: 'Why this codebase never throws for domain errors.',
  datePublished: '2026-08-01T00:00:00.000Z',
  author: { name: 'Test Author', url: 'https://example.com/about' },
  keywords: ['typescript', 'ddd'],
  inLanguage: 'en-US',
};

describe('buildBlogPostingJsonLd', () => {
  it('should describe the post as a BlogPosting that is the main entity of its page', () => {
    expect(buildBlogPostingJsonLd(INPUT)).toEqual({
      '@type': 'BlogPosting',
      mainEntityOfPage: { '@type': 'WebPage', '@id': INPUT.url },
      url: INPUT.url,
      headline: 'The Either Pattern',
      description: 'Why this codebase never throws for domain errors.',
      datePublished: '2026-08-01T00:00:00.000Z',
      dateModified: '2026-08-01T00:00:00.000Z',
      author: {
        '@type': 'Person',
        name: 'Test Author',
        url: 'https://example.com/about',
      },
      keywords: 'typescript, ddd',
      inLanguage: 'en-US',
    });
  });

  it('should keep dateModified when the post was updated', () => {
    const node = buildBlogPostingJsonLd({
      ...INPUT,
      dateModified: '2026-09-03T00:00:00.000Z',
    });

    expect(node.dateModified).toBe('2026-09-03T00:00:00.000Z');
  });

  it('should include the image when given one', () => {
    const image = 'https://example.com/cover.webp';

    expect(buildBlogPostingJsonLd({ ...INPUT, image }).image).toBe(image);
  });

  it('should leave the image out of the serialized node when there is none', () => {
    const json = JSON.stringify(
      buildBlogPostingJsonLd({ ...INPUT, image: undefined }),
    );

    expect(json).not.toContain('"image"');
  });
});
