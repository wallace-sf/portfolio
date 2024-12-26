import { isIn } from '../../src';

describe('isIn', () => {
  it('should validate', () => {
    expect(isIn('foo', ['foo', 'bar'])).toBe(true);
    expect(isIn('foo', ['bar', 'fooz', 'foo'])).toBe(true);
  });

  it('should not validate', () => {
    expect(isIn('foo', [])).toBe(false);
    expect(isIn('foo', ['bar'])).toBe(false);
    expect(isIn('foo', ['bar', 'fooz'])).toBe(false);
    expect(isIn(0 as unknown as string, ['foo', 'bar'])).toBe(false);
  });
});
