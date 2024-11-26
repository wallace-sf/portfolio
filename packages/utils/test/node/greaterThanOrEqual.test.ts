import { greaterThanOrEqual } from '../../src';

describe('greaterThanOrEqual', () => {
  it('should validate', () => {
    expect(greaterThanOrEqual(0, 0)).toBe(true);
    expect(greaterThanOrEqual(0, -1)).toBe(true);
  });

  it('should not validate', () => {
    expect(greaterThanOrEqual(0, 1)).toBe(false);
    expect(greaterThanOrEqual(-1, 0)).toBe(false);
  });
});
