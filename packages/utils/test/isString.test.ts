import { isString } from '../src';

describe('isString', () => {
  it('should validate', () => {
    expect(isString('Lorem ipsum')).toBe(true);
  });

  it('should not validate', () => {
    expect(isString(0)).toBe(false);
  });
});
