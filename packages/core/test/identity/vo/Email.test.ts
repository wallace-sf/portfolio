import { Email, ValidationError } from '~/index';

describe('Email', () => {
  describe('when created from valid value', () => {
    it('should return Right with normalized email', () => {
      const result = Email.create('User@Example.COM');

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.value).toBe('user@example.com');
    });

    it('should handle complex valid emails', () => {
      const result = Email.create('test.user+tag@sub.example.co.uk');

      expect(result.isRight()).toBe(true);
    });
  });

  describe('when created from invalid value', () => {
    it('should return Left for undefined', () => {
      const result = Email.create(undefined);

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Email.ERROR_CODE);
    });

    it('should return Left for empty string', () => {
      const result = Email.create('');

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Email.ERROR_CODE);
    });

    it('should return Left for invalid format (no @)', () => {
      const result = Email.create('invalid-email');

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).message).toContain(
        'valid format',
      );
    });

    it('should return Left for invalid format (no domain)', () => {
      const result = Email.create('user@');

      expect(result.isLeft()).toBe(true);
    });

    it('should return Left for value exceeding 254 characters', () => {
      const longEmail = 'a'.repeat(250) + '@example.com';
      const result = Email.create(longEmail);

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).message).toContain('between');
    });
  });

  describe('getters', () => {
    it('should return correct domain', () => {
      const result = Email.create('user@example.com');

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.domain).toBe('example.com');
    });

    it('should return correct local part', () => {
      const result = Email.create('user@example.com');

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.localPart).toBe('user');
    });
  });

  describe('when compared', () => {
    it('should be equal when two emails have same value', () => {
      const r1 = Email.create('test@example.com');
      const r2 = Email.create('TEST@Example.COM');

      expect(r1.isRight() && r2.isRight()).toBe(true);
      if (!r1.isRight() || !r2.isRight()) return;
      expect(r1.value.equals(r2.value)).toBe(true);
    });
  });
});
