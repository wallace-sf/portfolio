import { isUUID } from '../src';

describe('isUUID', () => {
  it('should validate', () => {
    expect(isUUID('143495a0-1cb2-481a-aa2f-04fa087608b6')).toBe(true);
    expect(isUUID('f9ffcadc-33a3-437f-a2b1-666e43ca7b93')).toBe(true);
  });

  it('should not validate', () => {
    expect(isUUID(0 as unknown as string)).toBe(false);
    expect(isUUID('Lorem ipsum')).toBe(false);
    expect(isUUID('')).toBe(false);
    expect(isUUID('12345678-1234-1234-1234-12345678901')).toBe(false);
  });
});
