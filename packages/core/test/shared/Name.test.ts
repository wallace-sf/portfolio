import { Name } from '../../src';

describe('Name', () => {
  describe('when is new', () => {
    const param = 'John';
    const name = Name.new(param);

    it('should be valid when param is valid', () => {
      expect(name.value).toBe(param);
      expect(name.isNew).toBe(false);
    });

    it('should be invalid when param is invalid', () => {
      expect(() => Name.new('')).toThrow(new Error(Name.ERROR_INVALID_NAME));
      expect(() => Name.new()).toThrow(new Error(Name.ERROR_INVALID_NAME));
    });
  });

  describe('when is compared', () => {
    it('should be valid when two names are equal', () => {
      const param = 'John';

      const name1 = Name.new(param);
      const name2 = Name.new(name1.value);

      expect(name1.equals(name2)).toBe(true);
      expect(name1.diff(name2)).toBe(false);
    });
  });

  describe('asserts static method isValid', () => {
    it('should be valid when param is a name', () => {
      const param = 'John';

      expect(Name.isValid(param)).toBe(true);
    });

    it('should be invalid when param is empty', () => {
      expect(Name.isValid('')).toBe(false);
      expect(Name.isValid()).toBe(false);
    });
  });
});
