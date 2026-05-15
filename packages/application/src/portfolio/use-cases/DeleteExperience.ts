import { UnauthorizedError } from '@repo/core/identity';
import { IExperienceRepository } from '@repo/core/portfolio';
import {
  DomainError,
  Either,
  Id,
  NotFoundError,
  ValidationError,
  left,
  right,
} from '@repo/core/shared';

import { EnsureAdmin } from '../../identity/use-cases/EnsureAdmin';
import { UseCase } from '../../shared/UseCase';

export type DeleteExperienceInput = {
  userId: string;
  experienceId: string;
};

export class DeleteExperience extends UseCase<
  DeleteExperienceInput,
  void,
  ValidationError | UnauthorizedError | NotFoundError | DomainError
> {
  constructor(
    private readonly experienceRepository: IExperienceRepository,
    private readonly ensureAdmin: EnsureAdmin,
  ) {
    super();
  }

  async execute(
    input: DeleteExperienceInput,
  ): Promise<
    Either<
      ValidationError | UnauthorizedError | NotFoundError | DomainError,
      void
    >
  > {
    const adminCheck = await this.ensureAdmin.execute({ userId: input.userId });
    if (adminCheck.isLeft()) return left(adminCheck.value);

    const idResult = Id.create(input.experienceId);
    if (idResult.isLeft())
      return left(
        new ValidationError({
          code: 'INVALID_EXPERIENCE_ID',
          message: idResult.value.message,
        }),
      );

    try {
      await this.experienceRepository.delete(idResult.value);
      return right(undefined);
    } catch {
      return left(
        new DomainError('DELETE_FAILED', {
          message: 'Failed to delete experience',
        }),
      );
    }
  }
}
