import { LOCALES } from '@repo/core/shared';
import { afterEach } from 'vitest';

import { buildCrossZoneHref } from '../src/buildCrossZoneHref';

const ORIGIN = 'https://wallace-ferreira.dev';

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', ORIGIN);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('buildCrossZoneHref', () => {
  it.each(LOCALES)(
    'should build an absolute site URL with no basePath for locale %s',
    (locale) => {
      expect(buildCrossZoneHref('site', locale)).toBe(`${ORIGIN}/${locale}`);
    },
  );

  it.each(LOCALES)(
    'should build an absolute blog URL with the /blog basePath for locale %s',
    (locale) => {
      expect(buildCrossZoneHref('blog', locale)).toBe(
        `${ORIGIN}/blog/${locale}`,
      );
    },
  );

  it('should append an empty path as no-op', () => {
    expect(buildCrossZoneHref('site', 'en-US', '')).toBe(`${ORIGIN}/en-US`);
  });

  it('should append a root path', () => {
    expect(buildCrossZoneHref('blog', 'en-US', '/')).toBe(
      `${ORIGIN}/blog/en-US/`,
    );
  });

  it('should append a nested path', () => {
    expect(buildCrossZoneHref('blog', 'pt-BR', '/foo/bar')).toBe(
      `${ORIGIN}/blog/pt-BR/foo/bar`,
    );
  });

  it('should tolerate a trailing slash on the configured origin', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', `${ORIGIN}/`);
    expect(buildCrossZoneHref('site', 'en-US')).toBe(`${ORIGIN}/en-US`);
  });

  it('should fall back to the local site dev server when the origin is unset', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
    expect(buildCrossZoneHref('blog', 'en-US')).toBe(
      'http://localhost:3000/blog/en-US',
    );
  });

  it('should throw when path does not start with a slash', () => {
    expect(() => buildCrossZoneHref('site', 'en-US', 'about')).toThrow(
      /must start with "\/"/,
    );
  });

  it('should throw for an invalid locale', () => {
    expect(() => buildCrossZoneHref('site', 'fr-FR' as never)).toThrow(
      /invalid locale/,
    );
  });
});
