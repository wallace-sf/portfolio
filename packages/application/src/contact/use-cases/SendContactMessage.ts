import {
  DomainError,
  Either,
  ValidationError,
  left,
  right,
} from '@repo/core/shared';
import { Validator } from '@repo/utils/validator';

import { IContactMessageDTO } from '../dtos/ContactMessageDTO';
import { IEmailService } from '../ports/IEmailService';

export type SendContactMessageInput = {
  name: string;
  email: string;
  message: string;
};

export class SendContactMessage {
  constructor(private readonly emailService: IEmailService) {}

  async execute(
    input: SendContactMessageInput,
  ): Promise<Either<ValidationError | DomainError, void>> {
    const { isValid: nameValid } = Validator.of(input.name?.trim() ?? '')
      .notEmpty()
      .validate();
    if (!nameValid) return left(new ValidationError({ code: 'INVALID_NAME' }));

    const { isValid: emailValid } = Validator.of(input.email?.trim() ?? '')
      .notEmpty()
      .email()
      .validate();
    if (!emailValid)
      return left(new ValidationError({ code: 'INVALID_EMAIL' }));

    const { isValid: messageValid } = Validator.of(input.message?.trim() ?? '')
      .notEmpty()
      .validate();
    if (!messageValid)
      return left(new ValidationError({ code: 'INVALID_MESSAGE' }));

    const dto: IContactMessageDTO = {
      name: input.name.trim(),
      email: input.email.trim(),
      message: input.message.trim(),
    };

    const result = await this.emailService.send(dto);
    if (result.isLeft()) return left(result.value);

    return right(undefined);
  }
}
