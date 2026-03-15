import { DateTime, ValidationError } from '../../../src';

describe('DateTime', () => {
  describe('when created from valid value', () => {
    it('should return Right with the provided ISO timestamp', () => {
      const param = '2020-01-01T00:00:00.000Z';
      const result = DateTime.create(param);

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.value).toBe(param);
    });
  });

  describe('when created from invalid value', () => {
    it('should return Left with ValidationError for empty string', () => {
      const result = DateTime.create('');

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ValidationError);
      expect((result.value as ValidationError).code).toBe(DateTime.ERROR_CODE);
      expect((result.value as ValidationError).message).toBe('The value must be a valid date and time.');
    });
  });

  describe('when generated via now()', () => {
    it('should return a valid 24-character ISO timestamp', () => {
      const dateTime = DateTime.now();

      expect(dateTime.value).toHaveLength(24);
      expect(DateTime.create(dateTime.value).isRight()).toBe(true);
    });
  });

  describe('when accessing ms getter', () => {
    it('should return numeric timestamp in milliseconds', () => {
      const param = '2020-01-01T00:00:00.000Z';
      const result = DateTime.create(param);

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.ms).toBe(new Date(param).getTime());
    });
  });

  describe('when compared', () => {
    it('should be equal when two dates have the same value', () => {
      const param = '2020-01-01T00:00:00.000Z';
      const r1 = DateTime.create(param);
      const r2 = DateTime.create(param);

      expect(r1.isRight() && r2.isRight()).toBe(true);
      if (!r1.isRight() || !r2.isRight()) return;
      expect(r1.value.equals(r2.value)).toBe(true);
      expect(r1.value.diff(r2.value)).toBe(false);
    });
  });
});
