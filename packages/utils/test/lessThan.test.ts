import { lessThan } from '../src';

describe('lessThan', () => {
  it('should validate', () => {
    expect(lessThan(0, 1)).toBe(true);
    expect(lessThan(-1, 0)).toBe(true);
  });

  it('should not validate', () => {
    expect(lessThan(1, 0)).toBe(false);
    expect(lessThan(0, -1)).toBe(false);
  });
});
