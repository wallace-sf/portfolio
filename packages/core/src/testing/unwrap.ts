import { Either } from '../shared/either';

/**
 * Returns the success value of an `Either`, or throws its error. For test
 * setup only: an invalid fixture should fail the test loudly instead of being
 * propagated like a domain error.
 */
export function unwrap<L, R>(result: Either<L, R>): R {
  if (result.isLeft()) throw result.value;
  return result.value;
}
