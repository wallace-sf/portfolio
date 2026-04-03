import { Email } from '../../../../shared/vo/Email';
import { Id } from '../../../../shared/vo/Id';
import { User } from '../model/User';

export interface IUserRepository {
  findById(id: Id): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
}
