
import { LocationType, ValidationError } from '../../src';

describe('LocationType', () => {
  describe('when is new', () => {
    it('should be valid when param is valid', () => {
      const hybrid = LocationType.new('HYBRID');
      const onSite = LocationType.new('ON-SITE');
      const remote = LocationType.new('REMOTE');

      expect(hybrid.value).toBe('HYBRID');
      expect(onSite.value).toBe('ON-SITE');
      expect(remote.value).toBe('REMOTE');
      expect(hybrid.isNew).toBe(false);
      expect(onSite.isNew).toBe(false);
      expect(remote.isNew).toBe(false);
    });

    it('should be invalid when param is invalid', () => {
      expect(() => LocationType.new('' as 'HYBRID')).toThrow(
        new ValidationError({ code: LocationType.ERROR_CODE, message: 'O valor deve ser um tipo localização válido.' }),
      );
      expect(() => LocationType.new('#' as 'ON-SITE')).toThrow(
        new ValidationError({ code: LocationType.ERROR_CODE, message: 'O valor deve ser um tipo localização válido.' }),
      );
    });
  });

  describe('when is compared', () => {
    it('should be valid when two location types are equal', () => {
      const param = 'HYBRID';

      const LocationType1 = LocationType.new(param);
      const LocationType2 = LocationType.new(LocationType1.value);

      expect(LocationType1.equals(LocationType2)).toBe(true);
      expect(LocationType1.diff(LocationType2)).toBe(false);
    });
  });
});
