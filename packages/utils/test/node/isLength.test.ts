import { isLength } from '../../src';

describe('isLength', () => {
  it('should validate', () => {
    expect(isLength('Lorem Ipsum', { min: 0, max: 300 })).toBe(true);
  });

  it('should not validate', () => {
    expect(isLength('Lorem', { min: 0, max: 3 })).toBe(false);
    expect(isLength(0 as unknown as string, { min: 0, max: 3 })).toBe(false);
    expect(isLength('Lorem', { min: 2, max: 1 })).toBe(false);
    expect(isLength('Lorem', {})).toBe(false);
  });
});
