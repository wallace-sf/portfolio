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

  describe('chain-loop bug fix', () => {
    it('should stop chain on first failure even when message is empty string', () => {
      const secondRuleCalled = { value: false };
      const result = Validator.of('x')
        .refine(() => false, '')
        .refine(() => {
          secondRuleCalled.value = true;
          return true;
        }, 'second-rule')
        .validate();

      expect(result.isValid).toBe(false);
      expect(secondRuleCalled.value).toBe(false);
    });

    it('should stop chain on first failure even when message is omitted', () => {
      const secondRuleCalled = { value: false };
      const result = Validator.of('x')
        .refine(() => false)
        .refine(() => {
          secondRuleCalled.value = true;
          return true;
        }, 'second-rule')
        .validate();

      expect(result.isValid).toBe(false);
      expect(secondRuleCalled.value).toBe(false);
    });

    it('should stop chain on first failure and not let passing rule overwrite failure', () => {
      const result = Validator.of('x')
        .refine(() => false, '')
        .refine(() => true, 'second-rule')
        .validate();

      expect(result.isValid).toBe(false);
    });

    it('should continue chain when first rule passes', () => {
      const result = Validator.of('x')
        .refine(() => true, '')
        .refine(() => false, 'second-fails')
        .validate();

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('second-fails');
    });

    it('should return isValid true when all rules pass with empty messages', () => {
      const result = Validator.of('x')
        .refine(() => true, '')
        .refine(() => true, '')
        .validate();

      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  describe('optional message parameter', () => {
    describe('default fallback', () => {
      it('should return "validation-error" when refine fails without message', () => {
        const result = Validator.of(7).refine((v) => v <= 6).validate();

        expect(result.isValid).toBe(false);
        expect(result.error).toBe('validation-error');
      });

      it('should return "validation-error" when alpha fails without message', () => {
        const result = Validator.of('x03').alpha().validate();

        expect(result.isValid).toBe(false);
        expect(result.error).toBe('validation-error');
      });

      it('should return "validation-error" when length fails without message', () => {
        const result = Validator.of('toolong').length(1, 3).validate();

        expect(result.isValid).toBe(false);
        expect(result.error).toBe('validation-error');
      });

      it('should return "validation-error" when email fails without message', () => {
        const result = Validator.of('not-an-email').email().validate();

        expect(result.isValid).toBe(false);
        expect(result.error).toBe('validation-error');
      });

      it('should return "validation-error" when url fails without message', () => {
        const result = Validator.of('not-a-url').url().validate();

        expect(result.isValid).toBe(false);
        expect(result.error).toBe('validation-error');
      });

      it('should return "validation-error" when uuid fails without message', () => {
        const result = Validator.of('not-a-uuid').uuid().validate();

        expect(result.isValid).toBe(false);
        expect(result.error).toBe('validation-error');
      });

      it('should return "validation-error" when datetime fails without message', () => {
        const result = Validator.of('not-a-date').datetime().validate();

        expect(result.isValid).toBe(false);
        expect(result.error).toBe('validation-error');
      });

      it('should return "validation-error" when notEmpty fails without message', () => {
        const result = Validator.of('').notEmpty().validate();

        expect(result.isValid).toBe(false);
        expect(result.error).toBe('validation-error');
      });

      it('should return "validation-error" when notNil fails without message', () => {
        const result = Validator.of(null).notNil().validate();

        expect(result.isValid).toBe(false);
        expect(result.error).toBe('validation-error');
      });

      it('should return "validation-error" when nil fails without message', () => {
        const result = Validator.of('value').nil().validate();

        expect(result.isValid).toBe(false);
        expect(result.error).toBe('validation-error');
      });

      it('should return "validation-error" when string fails without message', () => {
        const result = Validator.of(42).string().validate();

        expect(result.isValid).toBe(false);
        expect(result.error).toBe('validation-error');
      });

      it('should return "validation-error" when in fails without message', () => {
        const result = Validator.of('baz').in(['foo', 'bar']).validate();

        expect(result.isValid).toBe(false);
        expect(result.error).toBe('validation-error');
      });

      it('should return "validation-error" when regex fails without message', () => {
        const result = Validator.of('My Slug!').regex(/^[a-z0-9-]+$/).validate();

        expect(result.isValid).toBe(false);
        expect(result.error).toBe('validation-error');
      });

      it('should return "validation-error" when gt fails without message', () => {
        const result = Validator.of(0).gt(1).validate();

        expect(result.isValid).toBe(false);
        expect(result.error).toBe('validation-error');
      });

      it('should return "validation-error" when gte fails without message', () => {
        const result = Validator.of(0).gte(1).validate();

        expect(result.isValid).toBe(false);
        expect(result.error).toBe('validation-error');
      });

      it('should return "validation-error" when lt fails without message', () => {
        const result = Validator.of(1).lt(0).validate();

        expect(result.isValid).toBe(false);
        expect(result.error).toBe('validation-error');
      });

      it('should return "validation-error" when lte fails without message', () => {
        const result = Validator.of(2).lte(1).validate();

        expect(result.isValid).toBe(false);
        expect(result.error).toBe('validation-error');
      });
    });

    describe('null error on success', () => {
      it('should return null error when refine passes without message', () => {
        const result = Validator.of(4).refine((v) => v <= 6).validate();

        expect(result.isValid).toBe(true);
        expect(result.error).toBeNull();
      });

      it('should return null error when notEmpty passes without message', () => {
        const result = Validator.of('hello').notEmpty().validate();

        expect(result.isValid).toBe(true);
        expect(result.error).toBeNull();
      });

      it('should return null error when email passes without message', () => {
        const result = Validator.of('user@example.com').email().validate();

        expect(result.isValid).toBe(true);
        expect(result.error).toBeNull();
      });
    });

    describe('mixed chain', () => {
      it('should use explicit message from the failing rule when mixed with rules without messages', () => {
        const result = Validator.of('')
          .notEmpty()
          .email('INVALID_EMAIL')
          .validate();

        expect(result.isValid).toBe(false);
        expect(result.error).toBe('validation-error');
      });

      it('should use explicit message when the rule with message fails first', () => {
        const result = Validator.of('not-an-email')
          .notEmpty('REQUIRED')
          .email('INVALID_EMAIL')
          .validate();

        expect(result.isValid).toBe(false);
        expect(result.error).toBe('INVALID_EMAIL');
      });

      it('should return null error when all mixed rules pass', () => {
        const result = Validator.of('user@example.com')
          .notEmpty()
          .email('INVALID_EMAIL')
          .validate();

        expect(result.isValid).toBe(true);
        expect(result.error).toBeNull();
      });

      it('should stop on first failure and not evaluate subsequent rules', () => {
        const thirdRuleCalled = { value: false };
        const result = Validator.of('')
          .notEmpty()
          .refine(() => {
            thirdRuleCalled.value = true;
            return true;
          })
          .validate();

        expect(result.isValid).toBe(false);
        expect(thirdRuleCalled.value).toBe(false);
      });
    });

    describe('backward compatibility', () => {
      it('should return explicit message when provided and validation fails', () => {
        const result = Validator.of('x03').alpha('ALPHA_ERROR').validate();

        expect(result.isValid).toBe(false);
        expect(result.error).toBe('ALPHA_ERROR');
      });

      it('should return explicit message for length with mustache interpolation', () => {
        const result = Validator.of('toolong')
          .length(1, 3, 'Must be between {{min}} and {{max}} chars.')
          .validate();

        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Must be between 1 and 3 chars.');
      });

      it('should return null error when validation passes regardless of explicit message', () => {
        const result = Validator.of('hello').notEmpty('REQUIRED').validate();

        expect(result.isValid).toBe(true);
        expect(result.error).toBeNull();
      });
    });
  });
});
