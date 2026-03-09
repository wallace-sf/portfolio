import { Id, ValidationError } from '../../src';

describe('Id', () => {
  describe('when created from valid value', () => {
    it('should return Right with the provided UUID', () => {
      const param = '2faa7a77-4c9b-445f-92e3-21f24e6b3ea9';
      const result = Id.create(param);

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.value).toBe(param);
    });
  });

  describe('when created from invalid value', () => {
    it('should return Left with ValidationError for empty string', () => {
      const result = Id.create('');

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ValidationError);
      expect((result.value as ValidationError).code).toBe(Id.ERROR_CODE);
      expect((result.value as ValidationError).message).toBe('The value must be a valid UUID.');
    });

    it('should return Left with ValidationError for non-UUID string', () => {
      const result = Id.create('not-a-uuid');

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Id.ERROR_CODE);
    });
  });

  describe('when generated', () => {
    it('should generate a valid 36-character UUID', () => {
      const id = Id.generate();

      expect(id.value).toHaveLength(36);
      expect(Id.create(id.value).isRight()).toBe(true);
    });

    it('should generate unique values each time', () => {
      const id1 = Id.generate();
      const id2 = Id.generate();

      expect(id1.value).not.toBe(id2.value);
    });
  });

  describe('when compared', () => {
    it('should be equal when two ids have the same value', () => {
      const param = '2faa7a77-4c9b-445f-92e3-21f24e6b3ea9';
      const r1 = Id.create(param);
      const r2 = Id.create(param);

      expect(r1.isRight() && r2.isRight()).toBe(true);
      if (!r1.isRight() || !r2.isRight()) return;
      expect(r1.value.equals(r2.value)).toBe(true);
      expect(r1.value.diff(r2.value)).toBe(false);
    });
  });
});
