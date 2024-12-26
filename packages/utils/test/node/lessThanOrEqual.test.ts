import { lessThanOrEqual } from '../../src';

describe('lessThanOrEqual', () => {
  it('should validate', () => {
    expect(lessThanOrEqual(0, 0)).toBe(true);
    expect(lessThanOrEqual(-1, 0)).toBe(true);
  });

  it('should not validate', () => {
    expect(lessThanOrEqual(1, 0)).toBe(false);
    expect(lessThanOrEqual(0, -1)).toBe(false);
  });
});
