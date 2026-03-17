import { Either, DomainError } from "@repo/core/shared";

import { IContactMessageDTO } from "../dtos/ContactMessageDTO";

export interface IEmailService {
  send(message: IContactMessageDTO): Promise<Either<DomainError, void>>;
}
