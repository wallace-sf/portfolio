import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BlogPost } from '@repo/core/blog';

import Image, {
  alt,
  contentType,
  generateStaticParams,
  size,
} from '~/app/[locale]/blog/[slug]/opengraph-image';

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

function makePost(slug: string): BlogPost {
  const localized = (prefix: string) => ({
    'en-US': `${prefix} ${slug}`,
    'pt-BR': `${prefix} ${slug}`,
    es: `${prefix} ${slug}`,
  });
  const result = BlogPost.create({
    slug,
    title: localized('Title'),
    description: localized('Description'),
    content: { 'en-US': '# Body', 'pt-BR': '# Corpo', es: '# Cuerpo' },
    tags: ['nextjs'],
    publishedAt: '2026-08-01',
  });
  if (result.isLeft()) throw result.value;
  return result.value;
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

  it('should generate params for every locale and slug combination', async () => {
    findAll.mockResolvedValue([makePost('post-a'), makePost('post-b')]);

    const params = await generateStaticParams();

    expect(params).toHaveLength(6);
    expect(params).toContainEqual({ locale: 'pt-BR', slug: 'post-b' });
  });

  it('should render the card for the requested post with its title and description', async () => {
    findBySlug.mockResolvedValue(makePost('hello-post'));

    await Image({
      params: Promise.resolve({ locale: 'es', slug: 'hello-post' }),
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
      Image({ params: Promise.resolve({ locale: 'en-US', slug: 'missing' }) }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
    expect(imageResponseCtor).not.toHaveBeenCalled();
  });
});
