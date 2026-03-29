import { Role } from '../entities/user/model/Role';
import { User } from '../entities/user/model/User';

export class AccessPolicy {
  static isAdmin(user: User): boolean {
    return user.role === Role.ADMIN;
  }

  static isVisitor(user: User): boolean {
    return user.role === Role.VISITOR;
  }

  static hasRole(user: User, role: Role): boolean {
    return user.role === role;
  }
}
