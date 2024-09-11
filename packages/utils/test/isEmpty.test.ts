import { isEmpty } from '../src';

describe('isEmpty', () => {
  it('should validate', () => {
    expect(isEmpty('')).toBe(true);
  });

  it('should not validate', () => {
    expect(isEmpty('Lorem ipsum')).toBe(false);
    expect(isEmpty(0 as unknown as string)).toBe(false);
  });
});
