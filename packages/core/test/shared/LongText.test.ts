import { ValidationError } from '@repo/utils';

import { LongText } from '../../src';

describe('LongText', () => {
  describe('when is new', () => {
    const text = 'Lorem ipsum odor amet, consectetuer adipiscing elit.';
    const longText = LongText.new(text);

    it('should be valid when text is valid', () => {
      expect(longText.value).toBe(text);
      expect(longText.isNew).toBe(false);
    });

    it('should be invalid when text is invalid', () => {
      const error = new ValidationError(
        LongText.ERROR_CODE,
        'O texto deve ter entre 3 e 125000 caracteres.',
      );

      expect(() => LongText.new('')).toThrow(error);
      expect(() => LongText.new()).toThrow(error);
    });
  });

  describe('when is compared', () => {
    it('should be valid when two short texts are equal', () => {
      const text = 'Lorem ipsum odor amet, consectetuer adipiscing elit.';

      const longText1 = LongText.new(text);
      const longText2 = LongText.new(longText1.value);

      expect(longText1.equals(longText2)).toBe(true);
      expect(longText1.diff(longText2)).toBe(false);
    });
  });
});
