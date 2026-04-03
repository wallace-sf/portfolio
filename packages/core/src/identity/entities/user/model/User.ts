import { Validator } from '@repo/utils/validator';

import { AggregateRoot, IEntityProps } from '../../../../shared/base';
import { collect, Either, left, right } from '../../../../shared/either';
import { ValidationError } from '../../../../shared/errors';
import { Email } from '../../../../shared/vo/Email';
import { Name } from '../../../../shared/vo/Name';
import { Role } from './Role';

export interface IUserProps extends IEntityProps {
  name: string;
  email: string;
  role: Role;
}

export class User extends AggregateRoot<User, IUserProps> {
  static readonly ERROR_CODE = 'INVALID_USER';

  public readonly name: Name;
  public readonly email: Email;
  public readonly role: Role;

  private constructor(props: IUserProps, name: Name, email: Email) {
    super(props);
    this.name = name;
    this.email = email;
    this.role = props.role;
  }

  static create(props: IUserProps): Either<ValidationError, User> {
    {
      const { error, isValid } = Validator.of(props.role)
        .in(
          Object.values(Role),
          `Role must be one of: ${Object.values(Role).join(', ')}.`,
        )
        .validate();
      if (!isValid && error)
        return left(
          new ValidationError({ code: User.ERROR_CODE, message: error }),
        );
    }

    const fieldsResult = collect([
      Name.create(props.name),
      Email.create(props.email),
    ]);
    if (fieldsResult.isLeft()) return left(fieldsResult.value);

    const [name, email] = fieldsResult.value;

    return right(new User(props, name, email));
  }

  public isAdmin(): boolean {
    return this.role === Role.ADMIN;
  }

  public isVisitor(): boolean {
    return this.role === Role.VISITOR;
  }
}
