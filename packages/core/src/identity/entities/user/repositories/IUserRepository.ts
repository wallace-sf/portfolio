import { User } from '~/identity/entities/user/model/User';
import { Email } from '~/shared/vo/Email';
import { Id } from '~/shared/vo/Id';

export interface IUserRepository {
  findById(id: Id): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  findByAuthSubject(authSubject: Id): Promise<User | null>;
  linkAuthSubject(userId: Id, authSubject: Id): Promise<void>;
  save(user: User): Promise<void>;
}
