import { Description } from '../../src';

describe('Description', () => {
  describe('when is new ', () => {
    it('should be valid when param is valid', () => {
      const param = 'Lorem ipsum odor amet, consectetuer adipiscing elit.';
      const description = Description.new(param);

      expect(description.value).toBe(param);
      expect(description.isNew).toBe(false);
    });

    it('should be invalid when param is invalid', () => {
      expect(() => Description.new('')).toThrow(
        new Error(Description.ERROR_INVALID_DESCRIPTION),
      );
      expect(() => Description.new()).toThrow(
        new Error(Description.ERROR_INVALID_DESCRIPTION),
      );
    });
  });

  describe('when is compared', () => {
    it('should be valid when two descriptions are equal', () => {
      const param = 'Lorem ipsum odor amet, consectetuer adipiscing elit.';

      const description1 = Description.new(param);
      const description2 = Description.new(description1.value);

      expect(description1.equals(description2)).toBe(true);
      expect(description1.diff(description2)).toBe(false);
    });
  });

  describe('asserts static method isValid', () => {
    it('should be valid when param is string word, phrase or sentence', () => {
      const param = 'Lorem ipsum odor amet, consectetuer adipiscing elit.';

      expect(Description.isValid(param)).toBe(true);
    });

    it('should be invalid when param is empty', () => {
      expect(Description.isValid()).toBe(false);
    });

    it('should be invalid when param is invalid', () => {
      expect(Description.isValid('')).toBe(false);
    });
  });
});
