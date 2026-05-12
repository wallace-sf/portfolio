import { UnauthorizedError } from '@repo/core/identity';
import {
  IProjectProps,
  IProjectRepository,
  Project,
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

export type SaveProjectInput = {
  userId: string;
  projectProps: IProjectProps;
};

export class SaveProject extends UseCase<
  SaveProjectInput,
  void,
  ValidationError | UnauthorizedError | NotFoundError | DomainError
> {
  constructor(
    private readonly projectRepository: IProjectRepository,
    private readonly ensureAdmin: EnsureAdmin,
  ) {
    super();
  }

  async execute(
    input: SaveProjectInput,
  ): Promise<
    Either<
      ValidationError | UnauthorizedError | NotFoundError | DomainError,
      void
    >
  > {
    const adminCheck = await this.ensureAdmin.execute({ userId: input.userId });
    if (adminCheck.isLeft()) return left(adminCheck.value);

    const projectResult = Project.create(input.projectProps);
    if (projectResult.isLeft()) return left(projectResult.value);

    try {
      await this.projectRepository.save(projectResult.value);
      return right(undefined);
    } catch {
      return left(
        new DomainError('SAVE_FAILED', { message: 'Failed to save project' }),
      );
    }
  }
}
