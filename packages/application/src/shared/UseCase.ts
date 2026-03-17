import { DomainError, Either } from '@repo/core/shared';

export abstract class UseCase<TInput, TOutput, TError = DomainError> {
  abstract execute(input: TInput): Promise<Either<TError, TOutput>>;
}
