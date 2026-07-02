import { describe, expect, it } from 'vitest';

import { buildAlternates } from '../../../src/lib/seo/alternates';
import { SITE_URL } from '../../../src/lib/og';

describe('buildAlternates', () => {
  it('should build canonical and all locale alternates when given a pathname and locale', () => {
    const result = buildAlternates('/about', 'pt-BR');

    expect(result.canonical).toBe(`${SITE_URL}/pt-BR/about`);
    expect(result.languages).toEqual({
      'en-US': `${SITE_URL}/en-US/about`,
      'pt-BR': `${SITE_URL}/pt-BR/about`,
      es: `${SITE_URL}/es/about`,
      'x-default': `${SITE_URL}/en-US/about`,
    });
  });

  it('should build root URLs when pathname is empty (home page)', () => {
    const result = buildAlternates('', 'en-US');

    expect(result.canonical).toBe(`${SITE_URL}/en-US`);
    expect(result.languages['en-US']).toBe(`${SITE_URL}/en-US`);
    expect(result.languages['pt-BR']).toBe(`${SITE_URL}/pt-BR`);
  });

  it('should build correct URLs for nested paths like project detail pages', () => {
    const result = buildAlternates('/projects/my-project', 'es');

    expect(result.canonical).toBe(`${SITE_URL}/es/projects/my-project`);
    expect(result.languages.es).toBe(`${SITE_URL}/es/projects/my-project`);
  });

  it('should always point x-default to en-US regardless of the current locale', () => {
    const result = buildAlternates('/projects', 'es');

    expect(result.languages['x-default']).toBe(`${SITE_URL}/en-US/projects`);
  });
});
