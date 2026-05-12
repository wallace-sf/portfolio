import { UnauthorizedError } from '@repo/core/identity';
import { IProjectRepository } from '@repo/core/portfolio';
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

export type PublishProjectInput = {
  userId: string;
  projectId: string;
};

export class PublishProject extends UseCase<
  PublishProjectInput,
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
    input: PublishProjectInput,
  ): Promise<
    Either<
      ValidationError | UnauthorizedError | NotFoundError | DomainError,
      void
    >
  > {
    const adminCheck = await this.ensureAdmin.execute({ userId: input.userId });
    if (adminCheck.isLeft()) return left(adminCheck.value);

    const idResult = Id.create(input.projectId);
    if (idResult.isLeft())
      return left(
        new ValidationError({
          code: 'INVALID_PROJECT_ID',
          message: idResult.value.message,
        }),
      );

    let project;
    try {
      project = await this.projectRepository.findById(idResult.value);
    } catch {
      return left(
        new DomainError('FETCH_FAILED', { message: 'Failed to fetch project' }),
      );
    }

    if (!project)
      return left(new NotFoundError({ projectId: input.projectId }));

    const publishResult = project.publish();
    if (publishResult.isLeft()) return left(publishResult.value);

    try {
      await this.projectRepository.save(project);
      return right(undefined);
    } catch {
      return left(
        new DomainError('SAVE_FAILED', { message: 'Failed to save project' }),
      );
    }
  }
}
