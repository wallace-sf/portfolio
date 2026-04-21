import { Resend } from "resend";

import { IContactMessageDTO } from "@repo/application/contact";
import { DomainError, Either, left, right } from "@repo/core/shared";
import { IEmailService } from "@repo/application/contact";

export interface IResendEmailServiceConfig {
  recipientEmail: string;
  senderEmail: string;
}

function formatEmailHtml(name: string, email: string, message: string): string {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <tr>
        <td style="padding:24px;background:#f9f9f9;border-bottom:2px solid #e0e0e0;">
          <h2 style="margin:0;color:#111;">New contact message</h2>
        </td>
      </tr>
      <tr>
        <td style="padding:24px;">
          <p style="margin:0 0 8px;"><strong>Name:</strong> ${name}</p>
          <p style="margin:0 0 8px;"><strong>Email:</strong> ${email}</p>
          <p style="margin:0 0 8px;"><strong>Message:</strong></p>
          <p style="margin:0;white-space:pre-wrap;padding:12px;background:#f4f4f4;border-radius:4px;">${message}</p>
        </td>
      </tr>
    </table>
  `;
}

export class ResendEmailService implements IEmailService {
  constructor(
    private readonly client: Resend,
    private readonly config: IResendEmailServiceConfig,
  ) {}

  async send(message: IContactMessageDTO): Promise<Either<DomainError, void>> {
    try {
      const { error } = await this.client.emails.send({
        from: this.config.senderEmail,
        to: this.config.recipientEmail,
        replyTo: message.email,
        subject: `Contact from ${message.name}`,
        html: formatEmailHtml(message.name, message.email, message.message),
      });
      if (error) {
        return left(
          new DomainError("EMAIL_SEND_FAILED", { message: error.message }),
        );
      }
      return right(undefined);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      return left(
        new DomainError("EMAIL_SEND_FAILED", { message: errorMessage }),
      );
    }
  }
}
