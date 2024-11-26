import { greaterThan } from '../../src';

describe('greaterThan', () => {
  it('should validate', () => {
    expect(greaterThan(1, 0)).toBe(true);
    expect(greaterThan(0, -1)).toBe(true);
  });

  it('should not validate', () => {
    expect(greaterThan(0, 1)).toBe(false);
    expect(greaterThan(-1, 0)).toBe(false);
  });
});
