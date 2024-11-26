import { isDateTime } from '../../src';

describe('isDateTime', () => {
  it('should validate', () => {
    expect(isDateTime('2020-01-01')).toBe(true);
    expect(isDateTime('2020-01-01T00:00:00.000Z')).toBe(true);
    expect(isDateTime('2020-01-01T00:00:00.000+00:00')).toBe(true);
    expect(isDateTime('2020-01-01T00:00:00.000+01:00')).toBe(true);
    expect(isDateTime(new Date().toISOString())).toBe(true);
  });

  it('should not validate', () => {
    expect(isDateTime('')).toBe(false);
    expect(isDateTime(0 as unknown as string)).toBe(false);
    expect(isDateTime('Lorem ipsum')).toBe(false);
    expect(isDateTime({} as unknown as Date)).toBe(false);
  });
});
