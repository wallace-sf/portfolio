import { Tag, ValidationError } from '~/index';

describe('Tag', () => {
  describe('when created from valid value', () => {
    it('should return Right for a valid kebab-case tag', () => {
      const result = Tag.create('nextjs');

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.value).toBe('nextjs');
    });

    it('should return Right for a tag with multiple hyphenated words', () => {
      const result = Tag.create('clean-architecture');

      expect(result.isRight()).toBe(true);
    });

    it('should return Right for a minimum 2-character tag', () => {
      const result = Tag.create('ai');

      expect(result.isRight()).toBe(true);
    });

    it('should return Right for a maximum 50-character tag', () => {
      const result = Tag.create('a'.repeat(50));

      expect(result.isRight()).toBe(true);
    });
  });

  describe('when created from invalid value', () => {
    it('should return Left for undefined', () => {
      const result = Tag.create(undefined);

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ValidationError);
      expect((result.value as ValidationError).code).toBe(Tag.ERROR_CODE);
    });

    it('should return Left for empty string', () => {
      const result = Tag.create('');

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Tag.ERROR_CODE);
    });

    it('should return Left when shorter than 2 characters', () => {
      const result = Tag.create('a');

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Tag.ERROR_CODE);
    });

    it('should return Left when longer than 50 characters', () => {
      const result = Tag.create('a'.repeat(51));

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Tag.ERROR_CODE);
    });

    it('should return Left for a tag with uppercase letters', () => {
      const result = Tag.create('NextJS');

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Tag.ERROR_CODE);
    });

    it('should return Left for a tag with spaces', () => {
      const result = Tag.create('next js');

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Tag.ERROR_CODE);
    });

    it('should return Left for a tag with special characters', () => {
      const result = Tag.create('next_js!');

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Tag.ERROR_CODE);
    });
  });

  describe('when compared', () => {
    it('should be equal when two tags have the same value', () => {
      const r1 = Tag.create('nextjs');
      const r2 = Tag.create('nextjs');

      expect(r1.isRight() && r2.isRight()).toBe(true);
      if (!r1.isRight() || !r2.isRight()) return;
      expect(r1.value.equals(r2.value)).toBe(true);
    });

    it('should not be equal when two tags have different values', () => {
      const r1 = Tag.create('nextjs');
      const r2 = Tag.create('react');

      expect(r1.isRight() && r2.isRight()).toBe(true);
      if (!r1.isRight() || !r2.isRight()) return;
      expect(r1.value.equals(r2.value)).toBe(false);
    });
  });
});
