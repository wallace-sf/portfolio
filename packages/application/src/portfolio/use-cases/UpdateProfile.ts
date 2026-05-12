import { UnauthorizedError } from '@repo/core/identity';
import {
  IProfileProps,
  IProfileRepository,
  Profile,
} from '@repo/core/portfolio';
import {
  DomainError,
  Either,
  NotFoundError,
  ValidationError,
  left,
  right,
} from '@repo/core/shared';

import { EnsureAdmin } from '../../identity/use-cases/EnsureAdmin';
import { UseCase } from '../../shared/UseCase';

export type UpdateProfileInput = {
  userId: string;
  profileProps: IProfileProps;
};

export class UpdateProfile extends UseCase<
  UpdateProfileInput,
  void,
  ValidationError | UnauthorizedError | NotFoundError | DomainError
> {
  constructor(
    private readonly profileRepository: IProfileRepository,
    private readonly ensureAdmin: EnsureAdmin,
  ) {
    super();
  }

  async execute(
    input: UpdateProfileInput,
  ): Promise<
    Either<
      ValidationError | UnauthorizedError | NotFoundError | DomainError,
      void
    >
  > {
    const adminCheck = await this.ensureAdmin.execute({ userId: input.userId });
    if (adminCheck.isLeft()) return left(adminCheck.value);

    const profileResult = Profile.create(input.profileProps);
    if (profileResult.isLeft()) return left(profileResult.value);

    try {
      await this.profileRepository.save(profileResult.value);
      return right(undefined);
    } catch {
      return left(
        new DomainError('SAVE_FAILED', { message: 'Failed to save profile' }),
      );
    }
  }
}
