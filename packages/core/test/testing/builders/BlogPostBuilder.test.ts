import { BlogPostStatus } from '~/index';
import { BlogPostBuilder } from '~/testing';

describe('BlogPostBuilder.published', () => {
  it('should build a published post with the given slug and date', () => {
    const post = BlogPostBuilder.published(
      'hello-world',
      '2026-09-01T00:00:00.000Z',
    ).now();

    expect(post.slug.value).toBe('hello-world');
    expect(post.status).toBe(BlogPostStatus.PUBLISHED);
    expect(post.publishedAt.value).toBe('2026-09-01T00:00:00.000Z');
  });

  it('should keep the builder default date when none is given', () => {
    const post = BlogPostBuilder.published('hello-world').now();

    expect(post.publishedAt.value).toBe('2026-08-01T00:00:00.000Z');
  });
});
