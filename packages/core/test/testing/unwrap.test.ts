import { left, right, ValidationError } from '~/shared';
import { unwrap } from '~/testing';

describe('unwrap', () => {
  it('should return the value when the result is right', () => {
    expect(unwrap(right<ValidationError, number>(42))).toBe(42);
  });

  it('should throw the error when the result is left', () => {
    const error = new ValidationError({ code: 'INVALID_FIXTURE' });

    expect(() => unwrap(left<ValidationError, number>(error))).toThrow(error);
  });
});
