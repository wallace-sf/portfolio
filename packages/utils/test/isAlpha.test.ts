import { isAlpha } from '../src';

describe('isAlpha', () => {
  it('should validate', () => {
    expect(isAlpha('abcdef')).toBe(true);
  });

  it('should not validate', () => {
    expect(isAlpha('12345')).toBe(false);
    expect(isAlpha(0 as unknown as string)).toBe(false);
  });
});
