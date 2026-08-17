import { describe, expect, it } from 'vitest';

import { createSeoBuilders } from '../src/createSeoBuilders';

describe('createSeoBuilders', () => {
  describe('buildAlternates', () => {
    it('should build canonical and hreflang URLs without a basePath', () => {
      const { buildAlternates } = createSeoBuilders({
        siteUrl: 'https://example.com',
        siteName: 'Example',
      });

      const result = buildAlternates('/about', 'en-US');

      expect(result.canonical).toBe('https://example.com/en-US/about');
      expect(result.languages).toEqual({
        'en-US': 'https://example.com/en-US/about',
        'pt-BR': 'https://example.com/pt-BR/about',
        es: 'https://example.com/es/about',
        'x-default': 'https://example.com/en-US/about',
      });
    });

    it('should prefix every URL with basePath when configured', () => {
      const { buildAlternates } = createSeoBuilders({
        siteUrl: 'https://example.com',
        basePath: '/blog',
        siteName: 'Example Blog',
      });

      const result = buildAlternates('/my-post', 'pt-BR');

      expect(result.canonical).toBe(
        'https://example.com/blog/pt-BR/my-post',
      );
      expect(result.languages['en-US']).toBe(
        'https://example.com/blog/en-US/my-post',
      );
    });

    it('should omit types when no rssFeed is configured', () => {
      const { buildAlternates } = createSeoBuilders({
        siteUrl: 'https://example.com',
        siteName: 'Example',
      });

      const result = buildAlternates('', 'en-US');

      expect(result.types).toBeUndefined();
    });

    it('should include the RSS type entry when rssFeed is configured', () => {
      const { buildAlternates } = createSeoBuilders({
        siteUrl: 'https://example.com',
        basePath: '/blog',
        siteName: 'Example Blog',
        rssFeed: { filename: 'rss.xml', title: 'Example Blog Feed' },
      });

      const result = buildAlternates('/my-post', 'es');

      expect(result.types).toEqual({
        'application/rss+xml': [
          {
            url: 'https://example.com/blog/es/rss.xml',
            title: 'Example Blog Feed',
          },
        ],
      });
    });
  });

  describe('buildOpenGraph', () => {
    it('should default to type "website"', () => {
      const { buildOpenGraph } = createSeoBuilders({
        siteUrl: 'https://example.com',
        siteName: 'Example',
      });

      const result = buildOpenGraph('en-US', '');

      expect(result).toEqual({
        type: 'website',
        url: 'https://example.com/en-US',
        locale: 'en-US',
        siteName: 'Example',
      });
    });

    it('should accept an explicit type and apply basePath', () => {
      const { buildOpenGraph } = createSeoBuilders({
        siteUrl: 'https://example.com',
        basePath: '/blog',
        siteName: 'Example Blog',
      });

      const result = buildOpenGraph('pt-BR', '/my-post', 'article');

      expect(result).toEqual({
        type: 'article',
        url: 'https://example.com/blog/pt-BR/my-post',
        locale: 'pt-BR',
        siteName: 'Example Blog',
      });
    });
  });
});
