import { ValidationError } from '@repo/utils';

import { Fluency } from '../../src';

describe('Fluency', () => {
  describe('when is new', () => {
    it('should be valid when param is valid', () => {
      const beginner = Fluency.new('BEGINNER');
      const elementary = Fluency.new('ELEMENTARY');
      const intermediate = Fluency.new('INTERMEDIATE');
      const upperIntermediate = Fluency.new('UPPER-INTERMEDIATE');
      const advanced = Fluency.new('ADVANCED');
      const native = Fluency.new('NATIVE');

      expect(beginner.value).toBe('BEGINNER');
      expect(elementary.value).toBe('ELEMENTARY');
      expect(intermediate.value).toBe('INTERMEDIATE');
      expect(upperIntermediate.value).toBe('UPPER-INTERMEDIATE');
      expect(advanced.value).toBe('ADVANCED');
      expect(native.value).toBe('NATIVE');
      expect(beginner.isNew).toBe(false);
      expect(elementary.isNew).toBe(false);
      expect(intermediate.isNew).toBe(false);
      expect(upperIntermediate.isNew).toBe(false);
      expect(advanced.isNew).toBe(false);
      expect(native.isNew).toBe(false);
    });

    it('should be invalid when param is invalid', () => {
      expect(() => Fluency.new('' as 'BEGINNER')).toThrow(
        new ValidationError(
          Fluency.ERROR_CODE,
          'O valor deve ser um nível de fluência válido.',
        ),
      );
      expect(() => Fluency.new('#' as 'BEGINNER')).toThrow(
        new ValidationError(
          Fluency.ERROR_CODE,
          'O valor deve ser um nível de fluência válido.',
        ),
      );
    });
  });

  describe('when is compared', () => {
    it('should be valid when two fluencies are equal', () => {
      const param = 'BEGINNER';

      const fluency1 = Fluency.new(param);
      const fluency2 = Fluency.new(fluency1.value);

      expect(fluency1.equals(fluency2)).toBe(true);
      expect(fluency1.diff(fluency2)).toBe(false);
    });
  });
});
