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

export type DeleteProjectInput = {
  userId: string;
  projectId: string;
};

export class DeleteProject extends UseCase<
  DeleteProjectInput,
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
    input: DeleteProjectInput,
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

    try {
      await this.projectRepository.delete(idResult.value);
      return right(undefined);
    } catch {
      return left(
        new DomainError('DELETE_FAILED', {
          message: 'Failed to delete project',
        }),
      );
    }
  }
}
