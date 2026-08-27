import { LOCALES } from '@repo/core/shared';

import { buildCrossZoneHref } from '../src/buildCrossZoneHref';

describe('buildCrossZoneHref', () => {
  it.each(LOCALES)(
    'should build a site href with no basePath for locale %s',
    (locale) => {
      expect(buildCrossZoneHref('site', locale)).toBe(`/${locale}`);
    },
  );

  it.each(LOCALES)(
    'should build a blog href with the /blog basePath for locale %s',
    (locale) => {
      expect(buildCrossZoneHref('blog', locale)).toBe(`/blog/${locale}`);
    },
  );

  it('should append an empty path as no-op', () => {
    expect(buildCrossZoneHref('site', 'en-US', '')).toBe('/en-US');
  });

  it('should append a root path', () => {
    expect(buildCrossZoneHref('blog', 'en-US', '/')).toBe('/blog/en-US/');
  });

  it('should append a nested path', () => {
    expect(buildCrossZoneHref('blog', 'pt-BR', '/foo/bar')).toBe(
      '/blog/pt-BR/foo/bar',
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
