import { IUserProps, IUserRepository, Role, User } from '@repo/core/identity';
import { DomainError, Either, Email, Id, left, right } from '@repo/core/shared';

import { UseCase } from '~/shared/UseCase';

export interface EnsureAppUserForAuthSessionInput {
  /** IdP stable subject (e.g. Supabase `sub` claim from JWT) */
  authSubject: string;
  /** User email from IdP session */
  email: string;
  /** Optional display name; defaults to email username if not provided */
  defaultName?: string;
}

export class EnsureAppUserForAuthSession extends UseCase<
  EnsureAppUserForAuthSessionInput,
  string,
  DomainError
> {
  constructor(private readonly userRepository: IUserRepository) {
    super();
  }

  async execute(
    input: EnsureAppUserForAuthSessionInput,
  ): Promise<Either<DomainError, string>> {
    try {
      const authSubjectResult = Id.create(input.authSubject);
      if (authSubjectResult.isLeft())
        return left(
          new DomainError('INVALID_AUTH_SUBJECT', {
            message: authSubjectResult.value.message,
          }),
        );

      const emailResult = Email.create(input.email);
      if (emailResult.isLeft())
        return left(
          new DomainError('INVALID_EMAIL', {
            message: emailResult.value.message,
          }),
        );

      const authSubject = authSubjectResult.value;
      const email = emailResult.value;

      // Branch 1: user already linked to this authSubject
      const bySubject =
        await this.userRepository.findByAuthSubject(authSubject);
      if (bySubject) return right(bySubject.id.value);

      // Branch 2 & 3: check by email
      const byEmail = await this.userRepository.findByEmail(email);
      if (byEmail) {
        if (byEmail.authSubject === null) {
          // Branch 2: email exists, no authSubject yet → link
          await this.userRepository.linkAuthSubject(byEmail.id, authSubject);
          return right(byEmail.id.value);
        }
        // Branch 3: email exists, already linked to a different authSubject → conflict
        return left(
          new DomainError('AUTH_SUBJECT_CONFLICT', {
            message: `User with email ${input.email} is already linked to a different auth provider account.`,
          }),
        );
      }

      // Branch 4: no user found → create new VISITOR
      const name = input.defaultName ?? email.localPart;
      const props: IUserProps = {
        name,
        email: input.email,
        role: Role.VISITOR,
        authSubject: input.authSubject,
      };

      const userResult = User.create(props);
      if (userResult.isLeft())
        return left(
          new DomainError('USER_CREATION_FAILED', {
            message: userResult.value.message,
          }),
        );

      await this.userRepository.save(userResult.value);
      return right(userResult.value.id.value);
    } catch {
      return left(
        new DomainError('ENSURE_USER_FAILED', {
          message: 'Failed to ensure application user for auth session',
        }),
      );
    }
  }
}
