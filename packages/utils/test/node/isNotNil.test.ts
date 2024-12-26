import { isNotNil } from '../../src';

describe('isNotNil', () => {
  it('should validate', () => {
    expect(isNotNil(0)).toBe(true);
    expect(isNotNil('')).toBe(true);
    expect(isNotNil({})).toBe(true);
    expect(isNotNil([])).toBe(true);
    expect(isNotNil(() => {})).toBe(true);
    expect(isNotNil(NaN)).toBe(true);
    expect(isNotNil(Infinity)).toBe(true);
    expect(isNotNil(-Infinity)).toBe(true);
    expect(isNotNil('Lorem ipsum')).toBe(true);
  });

  it('should not validate', () => {
    expect(isNotNil(null)).toBe(false);
    expect(isNotNil(undefined)).toBe(false);
  });
});
