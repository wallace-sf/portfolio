import { describe, expect, it } from 'vitest';

import { env } from '~/config/env';
import { buildBlogBreadcrumbs } from '~features/blog/buildBlogBreadcrumbs';

const labels = { home: 'Home', blog: 'Blog' };

describe('buildBlogBreadcrumbs', () => {
  it('should build Home › Blog › Year › Month › Title when the page is a post', () => {
    const { visible, jsonLd } = buildBlogBreadcrumbs({
      locale: 'en-US',
      labels,
      target: {
        title: 'Hello world',
        publishedAt: '2026-09-15T10:00:00.000Z',
        slug: 'hello-world',
      },
    });

    expect(visible).toEqual([
      { label: 'Home', href: '/' },
      { label: 'Blog', href: '/blog' },
      { label: '2026', href: '/blog/2026' },
      { label: 'September', href: '/blog/2026/09' },
      { label: 'Hello world' },
    ]);
    expect(jsonLd.map(({ name }) => name)).toEqual(
      visible.map(({ label }) => label),
    );
  });

  it('should file a post under its UTC publication month when it crosses a month boundary locally', () => {
    const { visible } = buildBlogBreadcrumbs({
      locale: 'en-US',
      labels,
      target: {
        title: 'Late night',
        publishedAt: '2026-08-31T23:30:00-03:00',
        slug: 'late-night',
      },
    });

    expect(visible[3]).toEqual({ label: 'September', href: '/blog/2026/09' });
  });

  it('should end at a current Month with no href when the page is a month archive', () => {
    const { visible } = buildBlogBreadcrumbs({
      locale: 'pt-BR',
      labels: { home: 'Início', blog: 'Blog' },
      target: { year: 2026, month: 9 },
    });

    expect(visible).toEqual([
      { label: 'Início', href: '/' },
      { label: 'Blog', href: '/blog' },
      { label: '2026', href: '/blog/2026' },
      { label: 'Setembro' },
    ]);
  });

  it('should end at a current Year with no href when the page is a year archive', () => {
    const { visible } = buildBlogBreadcrumbs({
      locale: 'en-US',
      labels,
      target: { year: 2026 },
    });

    expect(visible).toEqual([
      { label: 'Home', href: '/' },
      { label: 'Blog', href: '/blog' },
      { label: '2026' },
    ]);
  });

  it('should give every JSON-LD item an absolute locale-prefixed URL when building the trail', () => {
    const { jsonLd } = buildBlogBreadcrumbs({
      locale: 'es',
      labels: { home: 'Inicio', blog: 'Blog' },
      target: {
        title: 'Hola',
        publishedAt: '2026-09-15T10:00:00.000Z',
        slug: 'hola',
      },
    });
    const base = `${env.siteUrl}/es`;

    expect(jsonLd).toEqual([
      { name: 'Inicio', url: base },
      { name: 'Blog', url: `${base}/blog` },
      { name: '2026', url: `${base}/blog/2026` },
      { name: 'Septiembre', url: `${base}/blog/2026/09` },
      { name: 'Hola', url: `${base}/blog/2026/09/hola` },
    ]);
  });
});
