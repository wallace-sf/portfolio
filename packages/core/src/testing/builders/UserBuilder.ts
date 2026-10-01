import { IUserProps, Role, User } from '../../index';
import { unwrap } from '../unwrap';
import { EntityBuilder } from './EntityBuilder';

export class UserBuilder extends EntityBuilder<IUserProps> {
  private constructor(props: IUserProps) {
    super(props);
  }

  static build(): UserBuilder {
    return new UserBuilder({
      name: 'Admin User',
      email: 'admin@example.com',
      role: Role.ADMIN,
      authSubject: 'b0000000-0000-4000-8000-000000000001',
    });
  }

  public now(): User {
    return unwrap(User.create(this._props as IUserProps));
  }

  public withName(name: string): UserBuilder {
    this._props.name = name;
    return this;
  }

  public withEmail(email: string): UserBuilder {
    this._props.email = email;
    return this;
  }

  public withRole(role: Role): UserBuilder {
    this._props.role = role;
    return this;
  }

  public withAuthSubject(authSubject: string | null): UserBuilder {
    this._props.authSubject = authSubject;
    return this;
  }
}
