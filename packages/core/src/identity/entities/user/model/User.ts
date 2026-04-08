import { Validator } from '@repo/utils/validator';

import { AggregateRoot, IEntityProps } from '../../../../shared/base';
import { collect, Either, left, right } from '../../../../shared/either';
import { ValidationError } from '../../../../shared/errors';
import { Email } from '../../../../shared/vo/Email';
import { Id } from '../../../../shared/vo/Id';
import { Name } from '../../../../shared/vo/Name';
import { Role } from './Role';

export interface IUserProps extends IEntityProps {
  name: string;
  email: string;
  role: Role;
  /** IdP stable subject (e.g. Supabase `sub`); optional until first login links the account. */
  authSubject?: string | null;
}

export class User extends AggregateRoot<User, IUserProps> {
  static readonly ERROR_CODE = 'INVALID_USER';

  public readonly name: Name;
  public readonly email: Email;
  public readonly role: Role;
  public readonly authSubject: Id | null;

  private constructor(
    props: IUserProps,
    name: Name,
    email: Email,
    authSubject: Id | null,
  ) {
    super(props);
    this.name = name;
    this.email = email;
    this.role = props.role;
    this.authSubject = authSubject;
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

    let authSubject: Id | null = null;
    if (props.authSubject != null) {
      const subResult = Id.create(props.authSubject);
      if (subResult.isLeft())
        return left(
          new ValidationError({
            code: User.ERROR_CODE,
            message: subResult.value.message,
          }),
        );
      authSubject = subResult.value;
    }

    const fieldsResult = collect([
      Name.create(props.name),
      Email.create(props.email),
    ]);
    if (fieldsResult.isLeft()) return left(fieldsResult.value);

    const [name, email] = fieldsResult.value;

    return right(new User(props, name, email, authSubject));
  }

  public isAdmin(): boolean {
    return this.role === Role.ADMIN;
  }

  public isVisitor(): boolean {
    return this.role === Role.VISITOR;
  }
}
