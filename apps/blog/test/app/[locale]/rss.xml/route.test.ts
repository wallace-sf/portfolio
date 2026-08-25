import { describe, expect, it, vi } from 'vitest';

import { BlogPost } from '@repo/core/blog';

import { GET } from '~/app/[locale]/rss.xml/route';

vi.mock('next-intl/server', () => ({
  getTranslations: async () => (key: string) =>
    ({ description: 'Technical articles.' })[key],
}));

const findAll = vi.fn();

vi.mock('~/lib/server/container', () => ({
  getServerContainer: () => ({
    blogPostRepository: { findAll: () => findAll(), findBySlug: vi.fn() },
  }),
}));

function makePost(slug: string, title: string, publishedAt: string): BlogPost {
  const localized = (value: string) => ({
    'en-US': value,
    'pt-BR': value,
    es: value,
  });
  const result = BlogPost.create({
    slug,
    title: localized(title),
    description: localized(`${title} description`),
    content: { 'en-US': '# Body', 'pt-BR': '# Corpo', es: '# Cuerpo' },
    tags: ['nextjs'],
    publishedAt,
  });
  if (result.isLeft()) throw result.value;
  return result.value;
}

function makeRequest(locale: string): {
  request: Request;
  context: { params: Promise<{ locale: string }> };
} {
  return {
    request: new Request(`http://localhost:3002/blog/${locale}/rss.xml`),
    context: { params: Promise.resolve({ locale }) },
  };
}

describe('GET /blog/[locale]/rss.xml', () => {
  it('should return valid RSS 2.0 XML with an item per post', async () => {
    findAll.mockResolvedValue([
      makePost('hello', 'Hello', '2026-08-01'),
    ]);

    const { request, context } = makeRequest('en-US');
    const response = await GET(request, context);
    const xml = await response.text();

    expect(response.headers.get('Content-Type')).toBe(
      'application/xml; charset=utf-8',
    );
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain('<title>Hello</title>');
    expect(xml).toContain(
      '<link>http://localhost:3002/blog/en-US/hello</link>',
    );
    expect(xml).toContain('<pubDate>');
  });

  it('should only include posts for the requested locale', async () => {
    findAll.mockResolvedValue([makePost('only-en', 'Only EN', '2026-08-01')]);

    const { request, context } = makeRequest('pt-BR');
    const response = await GET(request, context);
    const xml = await response.text();

    expect(xml).toContain('<language>pt-BR</language>');
    expect(xml).toContain(
      '<link>http://localhost:3002/blog/pt-BR/only-en</link>',
    );
  });

  it('should escape XML-unsafe characters in post fields', async () => {
    findAll.mockResolvedValue([
      makePost('amp-post', 'A & B <Test>', '2026-08-01'),
    ]);

    const { request, context } = makeRequest('en-US');
    const response = await GET(request, context);
    const xml = await response.text();

    expect(xml).toContain('<title>A &amp; B &lt;Test&gt;</title>');
  });

  it('should return a 500 response when the use case fails', async () => {
    findAll.mockRejectedValue(new Error('fs error'));

    const { request, context } = makeRequest('en-US');
    const response = await GET(request, context);

    expect(response.status).toBe(500);
  });
});
