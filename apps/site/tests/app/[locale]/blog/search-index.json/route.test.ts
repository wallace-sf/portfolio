import { BlogPostBuilder } from '@repo/core/testing';
import { describe, expect, it, vi } from 'vitest';

import { GET } from '~/app/[locale]/blog/search-index.json/route';

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
    request: new Request(
      `http://localhost:3000/${locale}/blog/search-index.json`,
    ),
    context: { params: Promise.resolve({ locale }) },
  };
}

describe('GET /[locale]/blog/search-index.json', () => {
  it('should return the locale plain-text entries as JSON when posts are published', async () => {
    findAll.mockResolvedValue([
      BlogPostBuilder.published('either', '2026-08-01')
        .withContent({
          'en-US': '## Why\n\nReturn **one** left.',
          'pt-BR': '## Por quê\n\nRetorne **um** left.',
          es: '## Por qué\n\nDevuelve **un** left.',
        })
        .now(),
      BlogPostBuilder.draft('draft').withTags([]).now(),
    ]);

    const { request, context } = makeRequest('pt-BR');
    const response = await GET(request, context);

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe(
      'application/json; charset=utf-8',
    );
    expect(await response.json()).toEqual([
      { slug: 'either', text: 'Por quê Retorne um left.' },
    ]);
  });

  it('should return a 500 response when the use case fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    findAll.mockRejectedValue(new Error('db down'));

    const { request, context } = makeRequest('en-US');
    const response = await GET(request, context);

    expect(response.status).toBe(500);
  });
});
