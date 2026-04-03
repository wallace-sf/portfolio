import { Either } from '../../../../shared/either';
import { NotFoundError, ValidationError } from '../../../../shared/errors';
import { Email } from '../../../../shared/vo/Email';
import { Id } from '../../../../shared/vo/Id';
import { User } from '../model/User';

export interface IUserRepository {
  findById(id: Id): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  findByAuthSubject(authSubject: string): Promise<User | null>;
  linkAuthSubject(
    userId: Id,
    authSubject: string,
  ): Promise<Either<NotFoundError | ValidationError, void>>;
}
