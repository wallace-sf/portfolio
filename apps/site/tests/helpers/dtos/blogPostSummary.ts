import type { BlogPostSummaryDTO } from '@repo/application/blog';

/**
 * A `BlogPostSummaryDTO` as a page hands it to a blog component. Title and
 * description name the slug (`Title <slug>`, the en-US title of
 * `BlogPostBuilder.published`); override only what the scenario checks.
 */
export function buildBlogPostSummaryDTO(
  overrides: Partial<BlogPostSummaryDTO> = {},
): BlogPostSummaryDTO {
  const slug = overrides.slug ?? 'hello-blog';

  return {
    slug,
    title: `Title ${slug}`,
    description: `Description ${slug}`,
    publishedAt: '2026-08-01T12:00:00.000Z',
    readingMinutes: 3,
    featured: false,
    tags: ['ddd'],
    author: {
      name: 'Test Author',
      avatarUrl: 'https://example.com/avatar.jpg',
      url: 'https://example.com',
    },
    ...overrides,
  };
}
