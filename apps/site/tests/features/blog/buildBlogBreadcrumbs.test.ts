import { describe, expect, it } from 'vitest';

import { env } from '~/config/env';
import { buildBlogBreadcrumbs } from '~features/blog/buildBlogBreadcrumbs';

const labels = { home: 'Home', blog: 'Blog', tags: 'Tags' };

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
      labels: { home: 'Início', blog: 'Blog', tags: 'Tags' },
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
      labels: { home: 'Inicio', blog: 'Blog', tags: 'Etiquetas' },
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

  it('should end at a current Tags with no href when the page is the tag index', () => {
    const { visible, jsonLd } = buildBlogBreadcrumbs({
      locale: 'en-US',
      labels,
      target: { kind: 'tags' },
    });

    expect(visible).toEqual([
      { label: 'Home', href: '/' },
      { label: 'Blog', href: '/blog' },
      { label: 'Tags' },
    ]);
    expect(jsonLd.at(-1)).toEqual({
      name: 'Tags',
      url: `${env.siteUrl}/en-US/blog/tags`,
    });
  });

  it('should build Home › Blog › Tags › #tag when the page is a tag page', () => {
    const { visible, jsonLd } = buildBlogBreadcrumbs({
      locale: 'pt-BR',
      labels,
      target: { kind: 'tags', tag: 'ddd' },
    });

    expect(visible).toEqual([
      { label: 'Home', href: '/' },
      { label: 'Blog', href: '/blog' },
      { label: 'Tags', href: '/blog/tags' },
      { label: '#ddd' },
    ]);
    expect(jsonLd.at(-1)).toEqual({
      name: '#ddd',
      url: `${env.siteUrl}/pt-BR/blog/tags/ddd`,
    });
  });
});
