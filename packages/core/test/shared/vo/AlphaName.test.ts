import { AlphaName, ValidationError } from '~/index';

describe('AlphaName', () => {
  describe('when created from valid value', () => {
    it('should return Right with the provided name', () => {
      const result = AlphaName.create('John');

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.value).toBe('John');
    });

    it('should trim surrounding whitespace', () => {
      const result = AlphaName.create('  Portuguese  ');

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.value).toBe('Portuguese');
    });

    it('should accept accented letters', () => {
      const result = AlphaName.create('André');

      expect(result.isRight()).toBe(true);
    });
  });

  describe('when created from invalid value', () => {
    it('should return Left for undefined', () => {
      const result = AlphaName.create(undefined);

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(AlphaName.ERROR_CODE);
    });

    it('should return Left for empty string', () => {
      const result = AlphaName.create('');

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(AlphaName.ERROR_CODE);
    });

    it('should return Left for a value shorter than 3 characters', () => {
      const result = AlphaName.create('Hi');

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(AlphaName.ERROR_CODE);
    });

    it('should return Left for a value with digits', () => {
      const result = AlphaName.create('Web3');

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(AlphaName.ERROR_CODE);
    });

    it('should return Left for a value with special characters', () => {
      const result = AlphaName.create('@');

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(AlphaName.ERROR_CODE);
    });

    it('should return Left for a value with underscores and symbols', () => {
      const result = AlphaName.create('Nome_com_&*%$');

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(AlphaName.ERROR_CODE);
    });

    it('should return Left for a value exceeding 100 characters', () => {
      const result = AlphaName.create('Joao da silva'.repeat(10));

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(AlphaName.ERROR_CODE);
    });
  });

  describe('when compared', () => {
    it('should return false when compared with null', () => {
      const result = AlphaName.create('John');

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.equals(null as never)).toBe(false);
    });

    it('should be equal when two names have the same value', () => {
      const r1 = AlphaName.create('John');
      const r2 = AlphaName.create('John');

      expect(r1.isRight() && r2.isRight()).toBe(true);
      if (!r1.isRight() || !r2.isRight()) return;
      expect(r1.value.equals(r2.value)).toBe(true);
      expect(r1.value.diff(r2.value)).toBe(false);
    });
  });

  describe('normalized getter', () => {
    it('should collapse multiple spaces into one', () => {
      const result = AlphaName.create('Aliaune   Damala Bouga   Time Bongo');

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.normalized).toBe('Aliaune Damala Bouga Time Bongo');
    });
  });

  describe('capitalized getter', () => {
    it('should capitalize each word', () => {
      const result = AlphaName.create('aliaune damala bouga time bongo');

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.capitalized).toBe('Aliaune Damala Bouga Time Bongo');
    });
  });
});
