import { ValidationError } from '@repo/utils';

import { Url } from '../../src';

describe('Url', () => {
  describe('when is new', () => {
    it('should be valid when param is valid', () => {
      const param = 'https://example.com';
      const url = Url.new(param);

      expect(url.value).toBe(param);
      expect(url.isNew).toBe(false);
    });

    it('should be invalid when param is invalid', () => {
      expect(() => Url.new()).toThrow(
        new ValidationError(Url.ERROR_CODE, 'O valor deve ser uma URL válida.'),
      );
      expect(() => Url.new('')).toThrow(
        new ValidationError(Url.ERROR_CODE, 'O valor deve ser uma URL válida.'),
      );
      expect(() => Url.new('#')).toThrow(
        new ValidationError(Url.ERROR_CODE, 'O valor deve ser uma URL válida.'),
      );
    });
  });

  describe('when is compared', () => {
    it('should be valid when two urls are equal', () => {
      const param = 'https://example.com';

      const url1 = Url.new(param);
      const url2 = Url.new(url1.value);

      expect(url1.equals(url2)).toBe(true);
      expect(url1.diff(url2)).toBe(false);
    });
  });
});
