import { describe, expect, it, vi } from 'vitest';

import { DomainError, ValidationError } from '@repo/core/shared';

import { IEmailService } from '~/contact/ports/IEmailService';
import { SendContactMessage } from '~/contact/use-cases/SendContactMessage';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeEmailService(overrides: Partial<IEmailService> = {}): IEmailService {
  return {
    send: vi.fn().mockResolvedValue({ isLeft: () => false, isRight: () => true }),
    ...overrides,
  };
}

const VALID_INPUT = {
  name: 'Wallace Ferreira',
  email: 'wallace@example.com',
  message: 'Hello, I would like to get in touch.',
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('SendContactMessage', () => {
  describe('execute()', () => {
    it('should return Right(void) and call emailService.send() on valid input', async () => {
      const send = vi.fn().mockResolvedValue({ isLeft: () => false, isRight: () => true, value: undefined });
      const useCase = new SendContactMessage(makeEmailService({ send }));

      const result = await useCase.execute(VALID_INPUT);

      expect(result.isRight()).toBe(true);
      expect(send).toHaveBeenCalledOnce();
    });

    it('should pass trimmed values to emailService.send()', async () => {
      const send = vi.fn().mockResolvedValue({ isLeft: () => false, isRight: () => true, value: undefined });
      const useCase = new SendContactMessage(makeEmailService({ send }));

      await useCase.execute({
        name: '  Wallace  ',
        email: '  wallace@example.com  ',
        message: '  Hello!  ',
      });

      expect(send).toHaveBeenCalledWith({
        name: 'Wallace',
        email: 'wallace@example.com',
        message: 'Hello!',
      });
    });

    // -----------------------------------------------------------------------
    // Name validation
    // -----------------------------------------------------------------------

    it('should return Left(ValidationError) when name is empty', async () => {
      const useCase = new SendContactMessage(makeEmailService());

      const result = await useCase.execute({ ...VALID_INPUT, name: '' });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ValidationError);
      expect((result.value as ValidationError).code).toBe('INVALID_NAME');
    });

    it('should return Left(ValidationError) when name is whitespace-only', async () => {
      const useCase = new SendContactMessage(makeEmailService());

      const result = await useCase.execute({ ...VALID_INPUT, name: '   ' });

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe('INVALID_NAME');
    });

    // -----------------------------------------------------------------------
    // Email validation
    // -----------------------------------------------------------------------

    it('should return Left(ValidationError) when email is empty', async () => {
      const useCase = new SendContactMessage(makeEmailService());

      const result = await useCase.execute({ ...VALID_INPUT, email: '' });

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe('INVALID_EMAIL');
    });

    it('should return Left(ValidationError) when email has no @ symbol', async () => {
      const useCase = new SendContactMessage(makeEmailService());

      const result = await useCase.execute({ ...VALID_INPUT, email: 'invalidemail.com' });

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe('INVALID_EMAIL');
    });

    it('should return Left(ValidationError) when email has no domain', async () => {
      const useCase = new SendContactMessage(makeEmailService());

      const result = await useCase.execute({ ...VALID_INPUT, email: 'user@' });

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe('INVALID_EMAIL');
    });

    it('should return Left(ValidationError) when email starts with @', async () => {
      const useCase = new SendContactMessage(makeEmailService());

      const result = await useCase.execute({ ...VALID_INPUT, email: '@example.com' });

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe('INVALID_EMAIL');
    });

    it('should return Left(ValidationError) when email has no TLD', async () => {
      const useCase = new SendContactMessage(makeEmailService());

      const result = await useCase.execute({ ...VALID_INPUT, email: 'user@domain' });

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe('INVALID_EMAIL');
    });

    // -----------------------------------------------------------------------
    // Message validation
    // -----------------------------------------------------------------------

    it('should return Left(ValidationError) when message is empty', async () => {
      const useCase = new SendContactMessage(makeEmailService());

      const result = await useCase.execute({ ...VALID_INPUT, message: '' });

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe('INVALID_MESSAGE');
    });

    it('should return Left(ValidationError) when message is whitespace-only', async () => {
      const useCase = new SendContactMessage(makeEmailService());

      const result = await useCase.execute({ ...VALID_INPUT, message: '   \t\n   ' });

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe('INVALID_MESSAGE');
    });

    // -----------------------------------------------------------------------
    // Validation order and short-circuit
    // -----------------------------------------------------------------------

    it('should return name error first when both name and email are invalid', async () => {
      const useCase = new SendContactMessage(makeEmailService());

      const result = await useCase.execute({ name: '', email: 'invalid', message: '' });

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe('INVALID_NAME');
    });

    it('should NOT call emailService.send() when validation fails', async () => {
      const send = vi.fn();
      const useCase = new SendContactMessage(makeEmailService({ send }));

      await useCase.execute({ ...VALID_INPUT, name: '' });

      expect(send).not.toHaveBeenCalled();
    });

    // -----------------------------------------------------------------------
    // Email service error propagation
    // -----------------------------------------------------------------------

    it('should propagate DomainError from emailService.send()', async () => {
      const domainError = new DomainError('SMTP_FAILED', { message: 'SMTP connection failed' });
      const send = vi.fn().mockResolvedValue({
        isLeft: () => true,
        isRight: () => false,
        value: domainError,
      });
      const useCase = new SendContactMessage(makeEmailService({ send }));

      const result = await useCase.execute(VALID_INPUT);

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBe(domainError);
    });
  });
});
