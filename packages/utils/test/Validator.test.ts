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
      const validator = Validator.new()
        .length(1, 5, 'LENGTH_ERROR')
        .validate('value');

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

    it('should not validate with error mustache', () => {
      const validator = Validator.new()
        .length(
          1,
          3,
          'The text must have between {{min}} and {{max}} characters.',
        )
        .validate(
          'Lorem ipsum odor amet, consectetuer adipiscing elit. Risus.',
        );

      expect(validator.error).toBe(
        'The text must have between 1 and 3 characters.',
      );
      expect(validator.isValid).toBe(false);
    });
  });

  describe('url', () => {
    it('should validate', () => {
      const validator = Validator.new()
        .url('URL_ERROR')
        .validate('https://www.google.com');

      expect(validator.error).toBeNull();
      expect(validator.isValid).toBe(true);
    });

    it('should not validate', () => {
      const error = 'URL_ERROR';
      const validator = Validator.new().url(error).validate('x03');

      expect(validator.error).toBe(error);
      expect(validator.isValid).toBe(false);
    });
  });

  describe('uuid', () => {
    it('should validate', () => {
      const validator = Validator.new()
        .uuid('UUID_ERROR')
        .validate('143495a0-1cb2-481a-aa2f-04fa087608b6');

      expect(validator.error).toBeNull();
      expect(validator.isValid).toBe(true);
    });

    it('should not validate', () => {
      const error = 'UUID_ERROR';
      const validator = Validator.new().uuid(error).validate('x03');

      expect(validator.error).toBe(error);
      expect(validator.isValid).toBe(false);
    });
  });

  describe('string', () => {
    it('should validate', () => {
      const validator = Validator.new()
        .string('STRING_ERROR')
        .validate('value');

      expect(validator.error).toBeNull();
      expect(validator.isValid).toBe(true);
    });

    it('should not validate', () => {
      const error = 'STRING_ERROR';
      const validator = Validator.new().string(error).validate(0);

      expect(validator.error).toBe(error);
      expect(validator.isValid).toBe(false);
    });
  });

  describe('nil', () => {
    it('should validate', () => {
      const validator = Validator.new().nil('NIL_ERROR').validate(null);

      expect(validator.error).toBeNull();
      expect(validator.isValid).toBe(true);
    });

    it('should not validate', () => {
      const error = 'NIL_ERROR';
      const validator = Validator.new().nil(error).validate(0);

      expect(validator.error).toBe(error);
      expect(validator.isValid).toBe(false);
    });
  });

  describe('notNil', () => {
    it('should validate', () => {
      const validator = Validator.new().notNil('NOT_NILL_ERROR').validate(0);

      expect(validator.error).toBeNull();
      expect(validator.isValid).toBe(true);
    });

    it('should not validate', () => {
      const error = 'NOT_NILL_ERROR';
      const validator = Validator.new().notNil(error).validate(null);

      expect(validator.error).toBe(error);
      expect(validator.isValid).toBe(false);
    });
  });

  describe('empty', () => {
    it('should validate', () => {
      const validator = Validator.new().empty('EMPTY_ERROR').validate('');

      expect(validator.error).toBeNull();
      expect(validator.isValid).toBe(true);
    });

    it('should not validate', () => {
      const error = 'EMPTY_ERROR';
      const validator = Validator.new().empty(error).validate(0);

      expect(validator.error).toBe(error);
      expect(validator.isValid).toBe(false);
    });
  });

  describe('datetime', () => {
    it('should validate', () => {
      const validator = Validator.new()
        .datetime('DATETIME_ERROR')
        .validate('2020-01-01T00:00:00.000Z');

      expect(validator.error).toBeNull();
      expect(validator.isValid).toBe(true);
    });

    it('should not validate', () => {
      const error = 'DATETIME_ERROR';
      const validator = Validator.new().datetime(error).validate('x03');

      expect(validator.error).toBe(error);
      expect(validator.isValid).toBe(false);
    });
  });

  describe('in', () => {
    it('should validate', () => {
      const validator = Validator.new()
        .in(['foo', 'bar'], 'IN_ERROR')
        .validate('foo');

      expect(validator.error).toBeNull();
      expect(validator.isValid).toBe(true);
    });

    it('should not validate', () => {
      const error = 'IN_ERROR';
      const validator = Validator.new()
        .in(['foo', 'bar'], error)
        .validate('x03');

      expect(validator.error).toBe(error);
      expect(validator.isValid).toBe(false);
    });
  });
});
