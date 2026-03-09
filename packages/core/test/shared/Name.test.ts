import { Name, ValidationError } from '../../src';

describe('Name', () => {
  describe('when created from valid value', () => {
    it('should return Right with the provided name', () => {
      const result = Name.create('John');

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.value).toBe('John');
    });
  });

  describe('when created from invalid value', () => {
    it('should return Left for undefined', () => {
      const result = Name.create(undefined);

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Name.ERROR_CODE);
      expect((result.value as ValidationError).message).toBe('The name must contain only letters.');
    });

    it('should return Left for empty string', () => {
      const result = Name.create('');

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Name.ERROR_CODE);
    });

    it('should return Left for value with special characters', () => {
      const result = Name.create('@');

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).message).toBe('The name must contain only letters.');
    });

    it('should return Left for value with underscores and symbols', () => {
      const result = Name.create('Nome_com_&*%$');

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Name.ERROR_CODE);
    });

    it('should return Left for value exceeding 100 characters', () => {
      const result = Name.create('João da silva'.repeat(10));

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).message).toBe(
        'The name must be between 3 and 100 characters.',
      );
    });
  });

  describe('when compared', () => {
    it('should be equal when two names have the same value', () => {
      const r1 = Name.create('John');
      const r2 = Name.create('John');

      expect(r1.isRight() && r2.isRight()).toBe(true);
      if (!r1.isRight() || !r2.isRight()) return;
      expect(r1.value.equals(r2.value)).toBe(true);
      expect(r1.value.diff(r2.value)).toBe(false);
    });
  });

  describe('normalized getter', () => {
    it('should collapse multiple spaces into one', () => {
      const result = Name.create('Aliaune   Damala Bouga   Time Bongo');

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.normalized).toBe('Aliaune Damala Bouga Time Bongo');
    });
  });

  describe('capitalized getter', () => {
    it('should capitalize each word', () => {
      const result = Name.create('aliaune damala bouga time bongo');

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.capitalized).toBe('Aliaune Damala Bouga Time Bongo');
    });
  });
});
