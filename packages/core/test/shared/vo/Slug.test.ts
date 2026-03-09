import { Slug, ValidationError } from '../../../src';

describe('Slug', () => {
  describe('when created from valid value', () => {
    it('should return Right for a valid kebab-case slug', () => {
      const result = Slug.create('my-project');

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.value).toBe('my-project');
    });

    it('should return Right for a slug with numbers', () => {
      const result = Slug.create('project-2024');

      expect(result.isRight()).toBe(true);
    });

    it('should return Right for a minimum 3-character slug', () => {
      const result = Slug.create('abc');

      expect(result.isRight()).toBe(true);
    });

    it('should normalize uppercase to lowercase', () => {
      const result = Slug.create('My-Project');

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.value).toBe('my-project');
    });

    it('should trim whitespace before validating', () => {
      const result = Slug.create('  my-project  ');

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.value).toBe('my-project');
    });
  });

  describe('when created from invalid value', () => {
    it('should return Left for undefined', () => {
      const result = Slug.create(undefined);

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ValidationError);
      expect((result.value as ValidationError).code).toBe(Slug.ERROR_CODE);
    });

    it('should return Left for empty string', () => {
      const result = Slug.create('');

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Slug.ERROR_CODE);
    });

    it('should return Left when shorter than 3 characters', () => {
      const result = Slug.create('ab');

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Slug.ERROR_CODE);
      expect((result.value as ValidationError).message).toContain(
        'at least 3 characters',
      );
    });

    it('should return Left for slug with spaces', () => {
      const result = Slug.create('my project');

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Slug.ERROR_CODE);
    });

    it('should return Left for slug with special characters', () => {
      const result = Slug.create('my_project!');

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Slug.ERROR_CODE);
    });

    it('should return Left for slug starting with a hyphen', () => {
      const result = Slug.create('-my-project');

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Slug.ERROR_CODE);
    });

    it('should return Left for slug ending with a hyphen', () => {
      const result = Slug.create('my-project-');

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Slug.ERROR_CODE);
    });
  });

  describe('toPath()', () => {
    it('should return the slug prefixed with a forward slash', () => {
      const result = Slug.create('my-project');

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.toPath()).toBe('/my-project');
    });
  });

  describe('when compared', () => {
    it('should be equal when two slugs have the same value', () => {
      const r1 = Slug.create('my-project');
      const r2 = Slug.create('my-project');

      expect(r1.isRight() && r2.isRight()).toBe(true);
      if (!r1.isRight() || !r2.isRight()) return;
      expect(r1.value.equals(r2.value)).toBe(true);
      expect(r1.value.diff(r2.value)).toBe(false);
    });

    it('should not be equal when two slugs have different values', () => {
      const r1 = Slug.create('my-project');
      const r2 = Slug.create('other-project');

      expect(r1.isRight() && r2.isRight()).toBe(true);
      if (!r1.isRight() || !r2.isRight()) return;
      expect(r1.value.equals(r2.value)).toBe(false);
    });
  });
});
