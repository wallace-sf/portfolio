import { isUrl } from '../../src';

describe('isUrl', () => {
  it('should validate', () => {
    expect(isUrl('https://www.google.com')).toBe(true);
    expect(isUrl('http://www.google.com')).toBe(true);
    expect(isUrl('ftp://www.google.com')).toBe(true);
    expect(isUrl('https://www.google.com/')).toBe(true);
    expect(isUrl('https://www.google.com/#foo')).toBe(true);
    expect(isUrl('https://www.google.com/?foo=bar')).toBe(true);
  });

  it('should not validate', () => {
    expect(isUrl('')).toBe(false);
    expect(isUrl('htp://invalid-url.com')).toBe(false);
    expect(isUrl('http://.com')).toBe(false);
    expect(isUrl('http://com. ')).toBe(false);
    expect(isUrl('http://example..com')).toBe(false);
    expect(isUrl('http:/missing-slash.com')).toBe(false);
    expect(isUrl('http://-invalid-dash.com')).toBe(false);
    expect(isUrl('http://invalid_domain.com')).toBe(false);
    expect(isUrl(0 as unknown as string)).toBe(false);
  });
});
