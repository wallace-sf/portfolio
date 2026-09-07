import { PersonName, ValidationError } from '~/index';

describe('PersonName', () => {
  describe('when created from valid value', () => {
    it.each([
      'John',
      'Wallace Ferreira',
      "O'Brien",
      'Anne-Marie',
      'J. R. R. Tolkien',
      'José da Silva',
      'Ng',
    ])('should return Right for %j', (name) => {
      const result = PersonName.create(name);

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.value).toBe(name);
    });

    it('should trim surrounding whitespace', () => {
      const result = PersonName.create('  Wallace Ferreira  ');

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.value).toBe('Wallace Ferreira');
    });
  });

  describe('when created from invalid value', () => {
    it.each([
      undefined,
      '',
      '   ',
      'A',
      '123',
      '50 Cent',
      'x_ae_a12',
      '-John',
      'John & Jane',
      'a'.repeat(101),
    ])('should return Left for %j', (name) => {
      const result = PersonName.create(name as string | undefined);

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(PersonName.ERROR_CODE);
    });
  });

  describe('getters', () => {
    it('should collapse multiple spaces in normalized', () => {
      const result = PersonName.create('Jean   Luc   Picard');

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.normalized).toBe('Jean Luc Picard');
    });

    it('should title-case each word in capitalized', () => {
      const result = PersonName.create("conan o'brien");

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.capitalized).toBe("Conan O'Brien");
    });
  });

  describe('equality', () => {
    it('should be equal when two names share the same value', () => {
      const a = PersonName.create('Anne-Marie');
      const b = PersonName.create('Anne-Marie');

      expect(a.isRight() && b.isRight()).toBe(true);
      if (!a.isRight() || !b.isRight()) return;
      expect(a.value.equals(b.value)).toBe(true);
    });
  });
});
