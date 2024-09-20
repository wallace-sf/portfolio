import { ValidationError } from '@repo/utils';

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
      expect(() => Name.new()).toThrow(
        new ValidationError(Name.ERROR_CODE, 'Nome deve conter apenas letras.'),
      );
      expect(() => Name.new('')).toThrow(
        new ValidationError(Name.ERROR_CODE, 'Nome deve conter apenas letras.'),
      );
      expect(() => Name.new('@')).toThrow(
        new ValidationError(Name.ERROR_CODE, 'Nome deve conter apenas letras.'),
      );
      expect(() => Name.new('Nome_com_&*%$')).toThrow(
        new ValidationError(Name.ERROR_CODE, 'Nome deve conter apenas letras.'),
      );
      expect(() => Name.new('João da silva'.repeat(10))).toThrow(
        new ValidationError(
          Name.ERROR_CODE,
          'O nome deve estar entre 2 e 100 caracteres.',
        ),
      );
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
