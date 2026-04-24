import { Text, ValidationError } from '~/index';

describe('Text', () => {
  describe('when created from valid value', () => {
    it('should return Right with the provided text', () => {
      const value = 'Lorem ipsum odor amet.';
      const result = Text.create(value);

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.value).toBe(value);
    });

    it('should return Right when using custom min/max config', () => {
      const value = 'Lorem ipsum odor amet.';
      const result = Text.create(value, { min: 3, max: 22 });

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.value).toBe(value);
    });
  });

  describe('when created from invalid value', () => {
    it('should return Left for empty string (default config)', () => {
      const result = Text.create('');

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ValidationError);
      expect((result.value as ValidationError).code).toBe(Text.ERROR_CODE);
      expect((result.value as ValidationError).message).toBe(
        'The value must be between 3 and 50 characters.',
      );
    });

    it('should return Left for undefined (default config)', () => {
      const result = Text.create(undefined);

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Text.ERROR_CODE);
    });

    it('should return Left with custom config message when exceeding max', () => {
      const result = Text.create('This string is too long.', {
        min: 3,
        max: 20,
      });

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).message).toBe(
        'The value must be between 3 and 20 characters.',
      );
    });
  });

  describe('when compared', () => {
    it('should be equal when two texts have the same value', () => {
      const value = 'Lorem ipsum odor amet.';
      const r1 = Text.create(value);
      const r2 = Text.create(value);

      expect(r1.isRight() && r2.isRight()).toBe(true);
      if (!r1.isRight() || !r2.isRight()) return;
      expect(r1.value.equals(r2.value)).toBe(true);
      expect(r1.value.diff(r2.value)).toBe(false);
    });
  });
});
