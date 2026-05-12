import { UnauthorizedError } from '@repo/core/identity';
import {
  Experience,
  IExperienceProps,
  IExperienceRepository,
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

export type SaveExperienceInput = {
  userId: string;
  experienceProps: IExperienceProps;
};

export class SaveExperience extends UseCase<
  SaveExperienceInput,
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
    input: SaveExperienceInput,
  ): Promise<
    Either<
      ValidationError | UnauthorizedError | NotFoundError | DomainError,
      void
    >
  > {
    const adminCheck = await this.ensureAdmin.execute({ userId: input.userId });
    if (adminCheck.isLeft()) return left(adminCheck.value);

    const experienceResult = Experience.create(input.experienceProps);
    if (experienceResult.isLeft()) return left(experienceResult.value);

    try {
      await this.experienceRepository.save(experienceResult.value);
      return right(undefined);
    } catch {
      return left(
        new DomainError('SAVE_FAILED', {
          message: 'Failed to save experience',
        }),
      );
    }
  }
}
