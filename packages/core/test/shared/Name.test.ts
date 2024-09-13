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
      expect(() => Name.new('')).toThrow(new Error(Name.ERROR_CODE));
      expect(() => Name.new()).toThrow(new Error(Name.ERROR_CODE));
      expect(() => Name.new('@')).toThrow(new Error(Name.ERROR_CODE));
      expect(() => Name.new('Nome_com_&*%$')).toThrow(
        new Error(Name.ERROR_CODE),
      );

      expect(() =>
        Name.new('Nome com mais de 100 caracteres'.repeat(10)),
      ).toThrow(new Error(Name.ERROR_CODE));
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

  describe('asserts normalized', () => {
    it('compare normalized value', () => {
      const param = 'Aliaune   Damala Bouga   Time Bongo ';

      const name = Name.new(param);

      expect(name.normalized).toBe('Aliaune Damala Bouga Time Bongo');
    });
  });

  describe('assets capitalized', () => {
    it('compare capitalized value', () => {
      const param = 'aliaune damala bouga time bongo';

      const name = Name.new(param);

      expect(name.capitalized).toBe('Aliaune Damala Bouga Time Bongo');
    });
  });
});
