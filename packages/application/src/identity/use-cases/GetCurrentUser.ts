import { IUserRepository, User } from '@repo/core/identity';
import {
  DomainError,
  Either,
  Id,
  NotFoundError,
  left,
  right,
} from '@repo/core/shared';

import { UseCase } from '../../shared/UseCase';
import { UserDTO } from '../dtos/UserDTO';

export interface GetCurrentUserInput {
  userId: string;
}

export class GetCurrentUser extends UseCase<
  GetCurrentUserInput,
  UserDTO,
  NotFoundError | DomainError
> {
  constructor(private readonly userRepository: IUserRepository) {
    super();
  }

  async execute(
    input: GetCurrentUserInput,
  ): Promise<Either<NotFoundError | DomainError, UserDTO>> {
    try {
      const idResult = Id.create(input.userId);
      if (idResult.isLeft())
        return left(
          new DomainError('INVALID_INPUT', { message: idResult.value.message }),
        );

      const user = await this.userRepository.findById(idResult.value);
      if (!user) return left(new NotFoundError({ userId: input.userId }));

      return right(this.toDTO(user));
    } catch {
      return left(
        new DomainError('FETCH_FAILED', { message: 'Failed to fetch user' }),
      );
    }
  }

  private toDTO(user: User): UserDTO {
    return {
      id: user.id.value,
      name: user.name.value,
      email: user.email.value,
      role: user.role,
    };
  }
}
