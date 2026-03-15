import { EmploymentType, ValidationError } from '../../../src';

describe('EmploymentType', () => {
  describe('when created from valid value', () => {
    it('should return Right for every valid employment type', () => {
      const types = EmploymentType.EMPLOYMENTS;

      for (const type of types) {
        const result = EmploymentType.create(type);
        expect(result.isRight()).toBe(true);
        if (!result.isRight()) continue;
        expect(result.value.value).toBe(type);
      }
    });
  });

  describe('when created from invalid value', () => {
    it('should return Left with ValidationError for empty string', () => {
      const result = EmploymentType.create('' as 'APPRENTICE');

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ValidationError);
      expect((result.value as ValidationError).code).toBe(EmploymentType.ERROR_CODE);
      expect((result.value as ValidationError).message).toBe(
        'The value must be a valid employment type.',
      );
    });

    it('should return Left for unrecognized value', () => {
      const result = EmploymentType.create('#' as 'APPRENTICE');

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(EmploymentType.ERROR_CODE);
    });
  });

  describe('when compared', () => {
    it('should be equal when two employment types have the same value', () => {
      const r1 = EmploymentType.create('APPRENTICE');
      const r2 = EmploymentType.create('APPRENTICE');

      expect(r1.isRight() && r2.isRight()).toBe(true);
      if (!r1.isRight() || !r2.isRight()) return;
      expect(r1.value.equals(r2.value)).toBe(true);
      expect(r1.value.diff(r2.value)).toBe(false);
    });
  });
});
