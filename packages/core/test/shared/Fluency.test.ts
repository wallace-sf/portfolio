import { Fluency, ValidationError } from '../../src';

describe('Fluency', () => {
  describe('when created from valid value', () => {
    it('should return Right for every valid fluency level', () => {
      const levels = Fluency.LEVELS;

      for (const level of levels) {
        const result = Fluency.create(level);
        expect(result.isRight()).toBe(true);
        if (!result.isRight()) continue;
        expect(result.value.value).toBe(level);
      }
    });
  });

  describe('when created from invalid value', () => {
    it('should return Left with ValidationError for empty string', () => {
      const result = Fluency.create('' as 'BEGINNER');

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ValidationError);
      expect((result.value as ValidationError).code).toBe(Fluency.ERROR_CODE);
      expect((result.value as ValidationError).message).toBe(
        'The value must be a valid fluency level.',
      );
    });

    it('should return Left for unrecognized value', () => {
      const result = Fluency.create('#' as 'BEGINNER');

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Fluency.ERROR_CODE);
    });
  });

  describe('when compared', () => {
    it('should be equal when two fluencies have the same value', () => {
      const r1 = Fluency.create('BEGINNER');
      const r2 = Fluency.create('BEGINNER');

      expect(r1.isRight() && r2.isRight()).toBe(true);
      if (!r1.isRight() || !r2.isRight()) return;
      expect(r1.value.equals(r2.value)).toBe(true);
      expect(r1.value.diff(r2.value)).toBe(false);
    });
  });
});
