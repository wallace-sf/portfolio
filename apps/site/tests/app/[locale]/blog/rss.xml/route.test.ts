import { describe, expect, it, vi } from 'vitest';

import { GET } from '~/app/[locale]/blog/rss.xml/route';

import { blogPost } from '../../../../helpers/blogPosts';

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

function makeRequest(locale: string): {
  request: Request;
  context: { params: Promise<{ locale: string }> };
} {
  return {
    request: new Request(`http://localhost:3000/${locale}/blog/rss.xml`),
    context: { params: Promise.resolve({ locale }) },
  };
}

describe('GET /[locale]/blog/rss.xml', () => {
  it('should return valid RSS 2.0 XML with an item per post', async () => {
    findAll.mockResolvedValue([blogPost('hello', '2026-08-01').now()]);

    const { request, context } = makeRequest('en-US');
    const response = await GET(request, context);
    const xml = await response.text();

    expect(response.headers.get('Content-Type')).toBe(
      'application/xml; charset=utf-8',
    );
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain('<title>Title hello</title>');
    expect(xml).toContain(
      '<link>http://localhost:3000/en-US/blog/2026/08/hello</link>',
    );
    expect(xml).toContain(
      '<guid isPermaLink="true">http://localhost:3000/en-US/blog/2026/08/hello</guid>',
    );
    expect(xml).toContain('<pubDate>');
  });

  it('should only include posts for the requested locale', async () => {
    findAll.mockResolvedValue([blogPost('only-en', '2026-08-01').now()]);

    const { request, context } = makeRequest('pt-BR');
    const response = await GET(request, context);
    const xml = await response.text();

    expect(xml).toContain('<language>pt-BR</language>');
    expect(xml).toContain(
      '<link>http://localhost:3000/pt-BR/blog/2026/08/only-en</link>',
    );
  });

  it('should escape XML-unsafe characters in post fields', async () => {
    findAll.mockResolvedValue([
      blogPost('amp-post', '2026-08-01')
        .withTitle({
          'en-US': 'A & B <Test>',
          'pt-BR': 'A & B <Test>',
          es: 'A & B <Test>',
        })
        .now(),
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
