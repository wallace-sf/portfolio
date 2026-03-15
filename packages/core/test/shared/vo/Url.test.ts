import { Url, ValidationError } from '../../../src';

describe('Url', () => {
  describe('when created from valid value', () => {
    it('should return Right with the provided URL', () => {
      const param = 'https://example.com';
      const result = Url.create(param);

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.value).toBe(param);
    });
  });

  describe('when created from invalid value', () => {
    it('should return Left for undefined', () => {
      const result = Url.create(undefined);

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ValidationError);
      expect((result.value as ValidationError).code).toBe(Url.ERROR_CODE);
      expect((result.value as ValidationError).message).toBe('The value must be a valid URL.');
    });

    it('should return Left for empty string', () => {
      const result = Url.create('');

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Url.ERROR_CODE);
    });

    it('should return Left for non-URL string', () => {
      const result = Url.create('#');

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Url.ERROR_CODE);
    });
  });

  describe('when compared', () => {
    it('should be equal when two URLs have the same value', () => {
      const param = 'https://example.com';
      const r1 = Url.create(param);
      const r2 = Url.create(param);

      expect(r1.isRight() && r2.isRight()).toBe(true);
      if (!r1.isRight() || !r2.isRight()) return;
      expect(r1.value.equals(r2.value)).toBe(true);
      expect(r1.value.diff(r2.value)).toBe(false);
    });
  });
});
