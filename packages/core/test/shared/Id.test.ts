import { ValidationError } from '@repo/utils';

import { Id } from '../../src';

describe('Id', () => {
  describe('when is new', () => {
    it('should be valid when param is valid', () => {
      const param = '2faa7a77-4c9b-445f-92e3-21f24e6b3ea9';
      const id = Id.new(param);

      expect(id.value).toBe(param);
      expect(id.isNew).toBe(false);
    });

    it('should be invalid when param is invalid', () => {
      expect(() => Id.new('')).toThrow(
        new ValidationError(Id.ERROR_CODE, 'O id deve ser um UUID.'),
      );
    });

    it('should be valid when id does not have param', () => {
      const id = Id.new();

      expect(id.isNew).toBe(true);
      expect(id.value).toHaveLength(36);
    });
  });

  describe('when is compared', () => {
    it('should be valid when two ids are equal', () => {
      const param = '2faa7a77-4c9b-445f-92e3-21f24e6b3ea9';

      const id1 = Id.new(param);
      const id2 = Id.new(id1.value);

      expect(id1.equals(id2)).toBe(true);
      expect(id1.diff(id2)).toBe(false);
    });
  });
});
