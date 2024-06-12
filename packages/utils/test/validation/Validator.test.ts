import { Validator } from '../../src';

describe('Validator', () => {
  it('should validate', () => {
    const validator = Validator.new()
      .push(() => null)
      .validate();

    expect(validator.error).toBeNull();
    expect(validator.isValid).toBe(true);
  });

  it('should not validate', () => {
    const validator = Validator.new()
      .push(() => 'error')
      .validate();

    expect(validator.error).toBe('error');
    expect(validator.isValid).toBe(false);
  });
});
