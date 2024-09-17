import { DateTime } from '../../src';

describe('DateTime', () => {
  describe('when is new', () => {
    it('should be valid when param is valid', () => {
      const param = '2020-01-01T00:00:00.000Z';
      const dateTime = DateTime.new(param);

      expect(dateTime.value).toBe(param);
      expect(dateTime.isNew).toBe(false);
    });

    it('should be invalid when param is invalid', () => {
      expect(() => DateTime.new('')).toThrow(new Error(DateTime.ERROR_CODE));
    });

    it('should be valid when it does not have param', () => {
      const dateTime = DateTime.new();

      expect(dateTime.isNew).toBe(true);
      expect(dateTime.value).toHaveLength(24);
    });
  });

  describe('when is compared', () => {
    it('should be valid when two dates are equal', () => {
      const param = '2020-01-01T00:00:00.000Z';

      const dateTime1 = DateTime.new(param);
      const dateTime2 = DateTime.new(dateTime1.value);

      expect(dateTime1.equals(dateTime2)).toBe(true);
      expect(dateTime1.diff(dateTime2)).toBe(false);
    });
  });

  describe('assert static method isValid', () => {
    it('should be valid when param is iso string', () => {
      const param = '2020-01-01T00:00:00.000Z';

      expect(DateTime.isValid(param)).toBe(true);
    });

    it('should be invalid when param is invalid', () => {
      expect(DateTime.isValid('#')).toBe(false);
    });

    it('should be invalid when param is empty', () => {
      expect(DateTime.isValid()).toBe(false);
    });
  });
});
