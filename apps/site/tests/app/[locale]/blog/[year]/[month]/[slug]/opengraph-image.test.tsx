import { BlogPostStatus } from '@repo/core/blog';
import { BlogPostBuilder } from '@repo/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Image, {
  alt,
  contentType,
  dynamicParams,
  generateStaticParams,
  size,
} from '~/app/[locale]/blog/[year]/[month]/[slug]/opengraph-image';

const imageResponseCtor = vi.fn();

vi.mock('next/og', () => ({
  ImageResponse: class {
    constructor(element: unknown, options: unknown) {
      imageResponseCtor(element, options);
    }
  },
}));

const notFound = vi.fn(() => {
  throw new Error('NEXT_NOT_FOUND');
});
vi.mock('next/navigation', () => ({
  notFound: () => notFound(),
}));

const findAll = vi.fn();
const findBySlug = vi.fn();

vi.mock('~/lib/server/container', () => ({
  getServerContainer: () => ({
    blogPostRepository: {
      findAll: () => findAll(),
      findBySlug: (slug: string) => findBySlug(slug),
    },
  }),
}));

function publishedPost(
  slug: string,
  publishedAt = '2026-08-01T10:00:00.000Z',
): BlogPostBuilder {
  const localized = (prefix: string) => ({
    'en-US': `${prefix} ${slug}`,
    'pt-BR': `${prefix} ${slug}`,
    es: `${prefix} ${slug}`,
  });
  return BlogPostBuilder.build()
    .withSlug(slug)
    .withTitle(localized('Title'))
    .withDescription(localized('Description'))
    .withPublishedAt(publishedAt)
    .withStatus(BlogPostStatus.PUBLISHED);
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('blog post opengraph-image', () => {
  it('should expose the shared 1200x630 PNG image metadata', () => {
    expect(size).toEqual({ width: 1200, height: 630 });
    expect(contentType).toBe('image/png');
    expect(alt).toBeTruthy();
  });

  it('should only serve prerendered params when an unknown path is requested', () => {
    expect(dynamicParams).toBe(false);
  });

  it('should generate dated params for every locale and published post', async () => {
    findAll.mockResolvedValue([
      publishedPost('post-a', '2026-08-01T10:00:00.000Z').now(),
      publishedPost('post-b', '2025-12-24T10:00:00.000Z').now(),
    ]);

    const params = await generateStaticParams();

    expect(params).toHaveLength(6);
    expect(params).toContainEqual({
      locale: 'pt-BR',
      year: '2025',
      month: '12',
      slug: 'post-b',
    });
  });

  it('should render the card for the requested post with its title and description', async () => {
    findBySlug.mockResolvedValue(publishedPost('hello-post').now());

    await Image({
      params: Promise.resolve({
        locale: 'es',
        year: '2026',
        month: '08',
        slug: 'hello-post',
      }),
    });

    expect(findBySlug).toHaveBeenCalledOnce();
    const [slugArg] = findBySlug.mock.calls[0]!;
    expect(slugArg.value).toBe('hello-post');

    expect(imageResponseCtor).toHaveBeenCalledOnce();
    const [element, options] = imageResponseCtor.mock.calls[0]!;
    expect(element).toBeTruthy();
    expect(options).toEqual({ width: 1200, height: 630 });
  });

  it('should call notFound when the post does not exist', async () => {
    findBySlug.mockResolvedValue(null);

    await expect(
      Image({
        params: Promise.resolve({
          locale: 'en-US',
          year: '2026',
          month: '08',
          slug: 'missing',
        }),
      }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
    expect(imageResponseCtor).not.toHaveBeenCalled();
  });
});
