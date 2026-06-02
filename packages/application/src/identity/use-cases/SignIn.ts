import { IUserRepository } from '@repo/core/identity';
import { DomainError, Either, left, right } from '@repo/core/shared';

import { UseCase } from '../../shared/UseCase';
import { AuthSession } from '../dtos/AuthSession';
import { IAuthenticationGateway } from '../ports/IAuthenticationGateway';
import { EnsureAppUserForAuthSession } from './EnsureAppUserForAuthSession';

export type SignInInput = {
  email: string;
  password: string;
};

export class SignIn extends UseCase<SignInInput, AuthSession, DomainError> {
  constructor(
    private readonly authGateway: IAuthenticationGateway,
    private readonly userRepository: IUserRepository,
  ) {
    super();
  }

  async execute(input: SignInInput): Promise<Either<DomainError, AuthSession>> {
    const sessionResult = await this.authGateway.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    if (sessionResult.isLeft()) return sessionResult;

    const session = sessionResult.value;

    const principalResult =
      await this.authGateway.getPrincipalFromSession(session);

    if (principalResult.isLeft()) return left(principalResult.value);

    const principal = principalResult.value;

    const ensureResult = await new EnsureAppUserForAuthSession(
      this.userRepository,
    ).execute({
      authSubject: principal.id,
      email: principal.email,
    });

    if (ensureResult.isLeft()) return left(ensureResult.value);

    return right(session);
  }
}
