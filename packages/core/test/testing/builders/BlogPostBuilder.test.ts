import { BlogPostStatus } from '~/index';
import { BlogPostBuilder } from '~/testing';

describe('BlogPostBuilder presets', () => {
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

  it('should name the title and description after the slug in each locale', () => {
    const post = BlogPostBuilder.published('hello-world').now();

    expect(post.title.get('en-US')).toBe('Title hello-world');
    expect(post.title.get('pt-BR')).toBe('Title hello-world (pt)');
    expect(post.title.get('es')).toBe('Title hello-world (es)');
    expect(post.description.get('pt-BR')).toBe('Description hello-world (pt)');
  });

  it.each([
    ['draft', BlogPostStatus.DRAFT],
    ['archived', BlogPostStatus.ARCHIVED],
  ] as const)(
    'should build a %s post named like a published one',
    (preset, status) => {
      const post = BlogPostBuilder[preset](
        'hidden',
        '2026-09-01T00:00:00.000Z',
      ).now();

      expect(post.status).toBe(status);
      expect(post.title.get('en-US')).toBe('Title hidden');
      expect(post.publishedAt.value).toBe('2026-09-01T00:00:00.000Z');
    },
  );
});
