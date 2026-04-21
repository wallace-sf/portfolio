import {
  DomainError,
  Either,
  ValidationError,
  left,
  right,
} from '@repo/core/shared';
import { Validator } from '@repo/utils/validator';

import { IContactMessageDTO } from '~/contact/dtos/ContactMessageDTO';
import { IEmailService } from '~/contact/ports/IEmailService';

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
    const nameResult = Validator.of(input.name?.trim() ?? '')
      .notEmpty('Name is required.')
      .validate();
    if (!nameResult.isValid && nameResult.error)
      return left(
        new ValidationError({
          code: 'INVALID_NAME',
          message: nameResult.error,
        }),
      );

    const emailResult = Validator.of(input.email?.trim() ?? '')
      .notEmpty('Email is required.')
      .email('Valid email is required.')
      .validate();
    if (!emailResult.isValid && emailResult.error)
      return left(
        new ValidationError({
          code: 'INVALID_EMAIL',
          message: emailResult.error,
        }),
      );

    const messageResult = Validator.of(input.message?.trim() ?? '')
      .notEmpty('Message is required.')
      .validate();
    if (!messageResult.isValid && messageResult.error)
      return left(
        new ValidationError({
          code: 'INVALID_MESSAGE',
          message: messageResult.error,
        }),
      );

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
