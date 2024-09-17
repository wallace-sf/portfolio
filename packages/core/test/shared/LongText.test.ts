import { LongText } from '../../src';

describe('ShortText', () => {
  describe('when is new', () => {
    const text = 'Lorem ipsum odor amet, consectetuer adipiscing elit.';
    const longText = LongText.new(text);

    it('should be valid when text is valid', () => {
      expect(longText.value).toBe(text);
      expect(longText.isNew).toBe(false);
    });

    it('should be invalid when text is invalid', () => {
      expect(() => LongText.new('')).toThrow(new Error(LongText.ERROR_CODE));
      expect(() => LongText.new()).toThrow(new Error(LongText.ERROR_CODE));
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

  describe('asserts static method isValid', () => {
    it('should be valid when param is a text', () => {
      const text = 'Lorem ipsum odor amet, consectetuer adipiscing elit.';

      expect(LongText.isValid(text)).toBe(true);
    });

    it('should be invalid when param is empty', () => {
      expect(LongText.isValid('')).toBe(false);
      expect(LongText.isValid()).toBe(false);
    });
  });
});
