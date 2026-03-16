import { Either } from '@repo/core/shared';
import { DomainError } from '@repo/core/shared';
import { ContactMessageDTO } from '../dtos/ContactMessageDTO';

export interface IEmailService {
  send(message: ContactMessageDTO): Promise<Either<DomainError, void>>;
}
