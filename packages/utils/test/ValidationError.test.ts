import { ValidationError } from '../src';

describe('ValidationError', () => {
  it('should return a valid validation error instance', () => {
    const error = new ValidationError('code', 'message');

    expect(error.name).toBe('code');
    expect(error.message).toBe('message');
    expect(error).toBeInstanceOf(ValidationError);
  });
});
