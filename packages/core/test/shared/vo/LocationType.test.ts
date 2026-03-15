import { LocationType, ValidationError } from '../../../src';

describe('LocationType', () => {
  describe('when created from valid value', () => {
    it('should return Right for every valid location type', () => {
      const locations = LocationType.LOCATIONS;

      for (const location of locations) {
        const result = LocationType.create(location);
        expect(result.isRight()).toBe(true);
        if (!result.isRight()) continue;
        expect(result.value.value).toBe(location);
      }
    });
  });

  describe('when created from invalid value', () => {
    it('should return Left with ValidationError for empty string', () => {
      const result = LocationType.create('' as 'HYBRID');

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ValidationError);
      expect((result.value as ValidationError).code).toBe(LocationType.ERROR_CODE);
      expect((result.value as ValidationError).message).toBe(
        'The value must be a valid location type.',
      );
    });

    it('should return Left for unrecognized value', () => {
      const result = LocationType.create('#' as 'HYBRID');

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(LocationType.ERROR_CODE);
    });
  });

  describe('when compared', () => {
    it('should be equal when two location types have the same value', () => {
      const r1 = LocationType.create('HYBRID');
      const r2 = LocationType.create('HYBRID');

      expect(r1.isRight() && r2.isRight()).toBe(true);
      if (!r1.isRight() || !r2.isRight()) return;
      expect(r1.value.equals(r2.value)).toBe(true);
      expect(r1.value.diff(r2.value)).toBe(false);
    });
  });
});
