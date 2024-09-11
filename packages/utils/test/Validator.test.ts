import { Validator } from '../src';

describe('Validator', () => {
  describe('alpha', () => {
    it('should validate', () => {
      const validator = Validator.new().alpha('ALPHA_ERROR').validate('value');

      expect(validator.error).toBeNull();
      expect(validator.isValid).toBe(true);
    });

    it('should not validate', () => {
      const error = 'ALPHA_ERROR';
      const validator = Validator.new().alpha(error).validate('x03');

      expect(validator.error).toBe(error);
      expect(validator.isValid).toBe(false);
    });
  });

  describe('length', () => {
    it('should validate', () => {
      const validator = Validator.new().alpha('LENGTH_ERROR').validate('value');

      expect(validator.error).toBeNull();
      expect(validator.isValid).toBe(true);
    });

    it('should not validate', () => {
      const error = 'LENGTH_ERROR';
      const validator = Validator.new()
        .length(1, 3, error)
        .validate(
          'Lorem ipsum odor amet, consectetuer adipiscing elit. Risus.',
        );

      expect(validator.error).toBe(error);
      expect(validator.isValid).toBe(false);
    });
  });
});
