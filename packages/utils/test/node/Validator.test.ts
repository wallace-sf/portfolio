import { Validator } from '../../src';

describe('Validator', () => {
  describe('alpha', () => {
    it('should validate', () => {
      const validator = Validator.of('value').alpha('ALPHA_ERROR').validate();

      expect(validator.error).toBeNull();
      expect(validator.isValid).toBe(true);
    });

    it('should not validate', () => {
      const error = 'ALPHA_ERROR';
      const validator = Validator.of('x03').alpha(error).validate();

      expect(validator.error).toBe(error);
      expect(validator.isValid).toBe(false);
    });
  });

  describe('length', () => {
    it('should validate', () => {
      const validator = Validator.of('value')
        .length(1, 5, 'LENGTH_ERROR')
        .validate();

      expect(validator.error).toBeNull();
      expect(validator.isValid).toBe(true);
    });

    it('should not validate', () => {
      const error = 'LENGTH_ERROR';
      const validator = Validator.of(
        'Lorem ipsum odor amet, consectetuer adipiscing elit. Risus.',
      )
        .length(1, 3, error)
        .validate();

      expect(validator.error).toBe(error);
      expect(validator.isValid).toBe(false);
    });

    it('should not validate with error mustache', () => {
      const validator = Validator.of(
        'Lorem ipsum odor amet, consectetuer adipiscing elit. Risus.',
      )
        .length(
          1,
          3,
          'The text must have between {{min}} and {{max}} characters.',
        )
        .validate();

      expect(validator.error).toBe(
        'The text must have between 1 and 3 characters.',
      );
      expect(validator.isValid).toBe(false);
    });
  });

  describe('email', () => {
    it('should validate a valid email address', () => {
      const validator = Validator.of('user@example.com').email('EMAIL_ERROR').validate();

      expect(validator.error).toBeNull();
      expect(validator.isValid).toBe(true);
    });

    it('should not validate an invalid email address', () => {
      const error = 'EMAIL_ERROR';
      const validator = Validator.of('not-an-email').email(error).validate();

      expect(validator.error).toBe(error);
      expect(validator.isValid).toBe(false);
    });
  });

  describe('url', () => {
    it('should validate', () => {
      const validator = Validator.of('https://www.google.com')
        .url('URL_ERROR')
        .validate();

      expect(validator.error).toBeNull();
      expect(validator.isValid).toBe(true);
    });

    it('should not validate', () => {
      const error = 'URL_ERROR';
      const validator = Validator.of('x03').url(error).validate();

      expect(validator.error).toBe(error);
      expect(validator.isValid).toBe(false);
    });
  });

  describe('uuid', () => {
    it('should validate', () => {
      const validator = Validator.of('143495a0-1cb2-481a-aa2f-04fa087608b6')
        .uuid('UUID_ERROR')
        .validate();

      expect(validator.error).toBeNull();
      expect(validator.isValid).toBe(true);
    });

    it('should not validate', () => {
      const error = 'UUID_ERROR';
      const validator = Validator.of('x03').uuid(error).validate();

      expect(validator.error).toBe(error);
      expect(validator.isValid).toBe(false);
    });
  });

  describe('string', () => {
    it('should validate', () => {
      const validator = Validator.of('value')
        .string('STRING_ERROR')
        .validate();

      expect(validator.error).toBeNull();
      expect(validator.isValid).toBe(true);
    });

    it('should not validate', () => {
      const error = 'STRING_ERROR';
      const validator = Validator.of(0).string(error).validate();

      expect(validator.error).toBe(error);
      expect(validator.isValid).toBe(false);
    });
  });

  describe('nil', () => {
    it('should validate', () => {
      const validator = Validator.of(null).nil('NIL_ERROR').validate();

      expect(validator.error).toBeNull();
      expect(validator.isValid).toBe(true);
    });

    it('should not validate', () => {
      const error = 'NIL_ERROR';
      const validator = Validator.of(0).nil(error).validate();

      expect(validator.error).toBe(error);
      expect(validator.isValid).toBe(false);
    });
  });

  describe('notNil', () => {
    it('should validate', () => {
      const validator = Validator.of(0).notNil('NOT_NILL_ERROR').validate();

      expect(validator.error).toBeNull();
      expect(validator.isValid).toBe(true);
    });

    it('should not validate', () => {
      const error = 'NOT_NILL_ERROR';
      const validator = Validator.of(null).notNil(error).validate();

      expect(validator.error).toBe(error);
      expect(validator.isValid).toBe(false);
    });
  });

  describe('empty', () => {
    it('should validate', () => {
      const validator = Validator.of('').empty('EMPTY_ERROR').validate();

      expect(validator.error).toBeNull();
      expect(validator.isValid).toBe(true);
    });

    it('should not validate', () => {
      const error = 'EMPTY_ERROR';
      const validator = Validator.of(0).empty(error).validate();

      expect(validator.error).toBe(error);
      expect(validator.isValid).toBe(false);
    });
  });

  describe('datetime', () => {
    it('should validate', () => {
      const validator = Validator.of('2020-01-01T00:00:00.000Z')
        .datetime('DATETIME_ERROR')
        .validate();

      expect(validator.error).toBeNull();
      expect(validator.isValid).toBe(true);
    });

    it('should not validate', () => {
      const error = 'DATETIME_ERROR';
      const validator = Validator.of('x03').datetime(error).validate();

      expect(validator.error).toBe(error);
      expect(validator.isValid).toBe(false);
    });
  });

  describe('in', () => {
    it('should validate', () => {
      const validator = Validator.of('foo')
        .in(['foo', 'bar'], 'IN_ERROR')
        .validate();

      expect(validator.error).toBeNull();
      expect(validator.isValid).toBe(true);
    });

    it('should not validate', () => {
      const error = 'IN_ERROR';
      const validator = Validator.of('x03')
        .in(['foo', 'bar'], error)
        .validate();

      expect(validator.error).toBe(error);
      expect(validator.isValid).toBe(false);
    });
  });

  describe('lt', () => {
    it('should validate', () => {
      const validator = Validator.of(0).lt(1, 'LT_ERROR').validate();

      expect(validator.error).toBeNull();
      expect(validator.isValid).toBe(true);
    });

    it('should not validate', () => {
      const error = 'LT_ERROR';
      const validator = Validator.of(1).lt(0, error).validate();

      expect(validator.error).toBe(error);
      expect(validator.isValid).toBe(false);
    });
  });

  describe('lte', () => {
    it('should validate', () => {
      const validator = Validator.of(0).lte(0, 'LTE_ERROR').validate();

      expect(validator.error).toBeNull();
      expect(validator.isValid).toBe(true);
    });

    it('should not validate', () => {
      const error = 'LTE_ERROR';
      const validator = Validator.of(1).lt(0, error).validate();

      expect(validator.error).toBe(error);
      expect(validator.isValid).toBe(false);
    });
  });

  describe('gt', () => {
    it('should validate', () => {
      const validator = Validator.of(1).gt(0, 'GT_ERROR').validate();

      expect(validator.error).toBeNull();
      expect(validator.isValid).toBe(true);
    });

    it('should not validate', () => {
      const error = 'GT_ERROR';
      const validator = Validator.of(0).gt(1, error).validate();

      expect(validator.error).toBe(error);
      expect(validator.isValid).toBe(false);
    });
  });

  describe('gte', () => {
    it('should validate', () => {
      const validator = Validator.of(0).gte(0, 'GTE_ERROR').validate();

      expect(validator.error).toBeNull();
      expect(validator.isValid).toBe(true);
    });

    it('should not validate', () => {
      const error = 'GTE_ERROR';
      const validator = Validator.of(0).gte(1, error).validate();

      expect(validator.error).toBe(error);
      expect(validator.isValid).toBe(false);
    });
  });

  describe('notEmpty', () => {
    it('should validate when string has content', () => {
      const validator = Validator.of('hello').notEmpty('NOT_EMPTY_ERROR').validate();

      expect(validator.error).toBeNull();
      expect(validator.isValid).toBe(true);
    });

    it('should not validate when string is empty', () => {
      const error = 'NOT_EMPTY_ERROR';
      const validator = Validator.of('').notEmpty(error).validate();

      expect(validator.error).toBe(error);
      expect(validator.isValid).toBe(false);
    });
  });

  describe('regex', () => {
    it('should validate when value matches pattern', () => {
      const validator = Validator.of('my-slug-123')
        .regex(/^[a-z0-9-]+$/, 'REGEX_ERROR')
        .validate();

      expect(validator.error).toBeNull();
      expect(validator.isValid).toBe(true);
    });

    it('should not validate when value does not match pattern', () => {
      const error = 'REGEX_ERROR';
      const validator = Validator.of('My Slug!')
        .regex(/^[a-z0-9-]+$/, error)
        .validate();

      expect(validator.error).toBe(error);
      expect(validator.isValid).toBe(false);
    });
  });

  describe('refine', () => {
    it('should validate when predicate returns true', () => {
      const validator = Validator.of(4)
        .refine((v) => v <= 6, 'REFINE_ERROR')
        .validate();

      expect(validator.error).toBeNull();
      expect(validator.isValid).toBe(true);
    });

    it('should not validate when predicate returns false', () => {
      const error = 'REFINE_ERROR';
      const validator = Validator.of(7)
        .refine((v) => v <= 6, error)
        .validate();

      expect(validator.error).toBe(error);
      expect(validator.isValid).toBe(false);
    });
  });
});
