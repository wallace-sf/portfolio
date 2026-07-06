import { describe, expect, it } from 'vitest';

import { env } from '../../../src/config/env';
import { buildOpenGraph } from '../../../src/lib/seo/openGraph';

const SITE_URL = env.siteUrl;

describe('buildOpenGraph', () => {
  it('should default to type website and build the locale-prefixed url', () => {
    const result = buildOpenGraph('pt-BR', '/about');

    expect(result).toEqual({
      type: 'website',
      url: `${SITE_URL}/pt-BR/about`,
      locale: 'pt-BR',
      siteName: 'Wallace Ferreira',
    });
  });

  it('should build the root url when pathname is empty (home page)', () => {
    const result = buildOpenGraph('en-US', '');

    expect(result.url).toBe(`${SITE_URL}/en-US`);
  });

  it('should use type article when explicitly requested for project detail pages', () => {
    const result = buildOpenGraph('es', '/projects/my-project', 'article');

    expect(result.type).toBe('article');
    expect(result.url).toBe(`${SITE_URL}/es/projects/my-project`);
  });
});
