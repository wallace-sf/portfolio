import { isNil } from '../../src';

describe('isNil', () => {
  it('should validate', () => {
    expect(isNil(null)).toBe(true);
    expect(isNil(undefined)).toBe(true);
  });

  it('should not validate', () => {
    expect(isNil(0)).toBe(false);
    expect(isNil('')).toBe(false);
    expect(isNil({})).toBe(false);
    expect(isNil([])).toBe(false);
    expect(isNil(() => {})).toBe(false);
    expect(isNil(NaN)).toBe(false);
    expect(isNil(Infinity)).toBe(false);
    expect(isNil(-Infinity)).toBe(false);
    expect(isNil('Lorem ipsum')).toBe(false);
  });
});
