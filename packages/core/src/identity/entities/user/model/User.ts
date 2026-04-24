import { AggregateRoot, IEntityProps } from '../../../../shared/base';
import { collect, Either, left, right } from '../../../../shared/either';
import { ValidationError } from '../../../../shared/errors';
import { validateEnum } from '../../../../shared/validateEnum';
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
    role: Role,
    name: Name,
    email: Email,
    authSubject: Id | null,
  ) {
    super(props);
    this.role = role;
    this.name = name;
    this.email = email;
    this.authSubject = authSubject;
  }

  static create(props: IUserProps): Either<ValidationError, User> {
    const result = collect([
      validateEnum(
        props.role,
        Object.values(Role),
        User.ERROR_CODE,
        `Role must be one of: ${Object.values(Role).join(', ')}.`,
      ),
      Name.create(props.name),
      Email.create(props.email),
      User._createAuthSubject(props.authSubject),
    ]);
    if (result.isLeft()) return left(result.value);

    const [role, name, email, authSubject] = result.value;
    return right(new User(props, role, name, email, authSubject));
  }

  private static _createAuthSubject(
    value: string | null | undefined,
  ): Either<ValidationError, Id | null> {
    if (value == null) return right(null);
    const result = Id.create(value);
    if (result.isLeft())
      return left(
        new ValidationError({
          code: User.ERROR_CODE,
          message: result.value.message,
        }),
      );
    return result;
  }

  public isAdmin(): boolean {
    return this.role === Role.ADMIN;
  }

  public isVisitor(): boolean {
    return this.role === Role.VISITOR;
  }
}
