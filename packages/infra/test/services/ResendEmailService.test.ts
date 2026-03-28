import { Resend } from 'resend';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { DomainError } from '@repo/core/shared';

import { ResendEmailService, IResendEmailServiceConfig } from '../../src/services/ResendEmailService';

const config: IResendEmailServiceConfig = {
  recipientEmail: 'owner@example.com',
  senderEmail: 'onboarding@resend.dev',
};

const validMessage = {
  name: 'John Doe',
  email: 'john@example.com',
  message: 'Hello, I would like to get in touch.',
};

function makeService(sendMock: ReturnType<typeof vi.fn>) {
  const client = { emails: { send: sendMock } } as unknown as Resend;
  return new ResendEmailService(client, config);
}

describe('ResendEmailService', () => {
  let sendMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    sendMock = vi.fn();
  });

  describe('send', () => {
    it('should return right when email sends successfully', async () => {
      sendMock.mockResolvedValueOnce({ data: { id: 'email-id-123' }, error: null });
      const service = makeService(sendMock);

      const result = await service.send(validMessage);

      expect(result.isRight()).toBe(true);
      expect(result.value).toBeUndefined();
    });

    it('should call resend with correct parameters', async () => {
      sendMock.mockResolvedValueOnce({ data: { id: 'email-id-123' }, error: null });
      const service = makeService(sendMock);

      await service.send(validMessage);

      expect(sendMock).toHaveBeenCalledOnce();
      expect(sendMock).toHaveBeenCalledWith({
        from: config.senderEmail,
        to: config.recipientEmail,
        replyTo: validMessage.email,
        subject: `Contact from ${validMessage.name}`,
        html: expect.stringContaining(validMessage.name),
      });
    });

    it('should include all message fields in the email html', async () => {
      sendMock.mockResolvedValueOnce({ data: { id: 'email-id-123' }, error: null });
      const service = makeService(sendMock);

      await service.send(validMessage);

      const [call] = sendMock.mock.calls;
      const html = call[0].html as string;
      expect(html).toContain(validMessage.name);
      expect(html).toContain(validMessage.email);
      expect(html).toContain(validMessage.message);
    });

    it('should return left with DomainError when Resend returns an error object', async () => {
      sendMock.mockResolvedValueOnce({ data: null, error: { message: 'You can only send testing emails to your own email address.' } });
      const service = makeService(sendMock);

      const result = await service.send(validMessage);

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(DomainError);
      expect((result.value as DomainError).code).toBe('EMAIL_SEND_FAILED');
      expect((result.value as DomainError).message).toContain('You can only send testing emails');
    });

    it('should return left with DomainError when Resend throws unexpectedly', async () => {
      sendMock.mockRejectedValueOnce(new Error('Network failure'));
      const service = makeService(sendMock);

      const result = await service.send(validMessage);

      expect(result.isLeft()).toBe(true);
      expect((result.value as DomainError).code).toBe('EMAIL_SEND_FAILED');
      expect((result.value as DomainError).message).toContain('Network failure');
    });

    it('should return left with DomainError for unknown thrown values', async () => {
      sendMock.mockRejectedValueOnce('unexpected string error');
      const service = makeService(sendMock);

      const result = await service.send(validMessage);

      expect(result.isLeft()).toBe(true);
      expect((result.value as DomainError).code).toBe('EMAIL_SEND_FAILED');
    });
  });
});
