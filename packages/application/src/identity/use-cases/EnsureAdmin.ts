import { DomainError, Either, Id, NotFoundError, left, right } from '@repo/core/shared';
import { IUserRepository } from '@repo/core/identity';
import { UnauthorizedError } from '@repo/core/identity';

import { UseCase } from '../../shared/UseCase';

export interface EnsureAdminInput {
  userId: string;
}

export class EnsureAdmin extends UseCase<
  EnsureAdminInput,
  void,
  UnauthorizedError | NotFoundError | DomainError
> {
  constructor(private readonly userRepository: IUserRepository) {
    super();
  }

  async execute(
    input: EnsureAdminInput,
  ): Promise<Either<UnauthorizedError | NotFoundError | DomainError, void>> {
    try {
      const idResult = Id.create(input.userId);
      if (idResult.isLeft())
        return left(
          new DomainError('INVALID_INPUT', { message: idResult.value.message }),
        );

      const user = await this.userRepository.findById(idResult.value);
      if (!user) return left(new NotFoundError({ userId: input.userId }));

      if (!user.isAdmin())
        return left(
          new UnauthorizedError({
            message: 'User does not have admin privileges',
          }),
        );

      return right(undefined);
    } catch {
      return left(
        new DomainError('FETCH_FAILED', {
          message: 'Failed to verify admin status',
        }),
      );
    }
  }
}
