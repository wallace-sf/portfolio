// Pattern: Discriminated Union (Either / Result type)
export class Left<L, R> {
  readonly value: L;

  constructor(value: L) {
    this.value = value;
  }

  isLeft(): this is Left<L, R> {
    return true;
  }

  isRight(): this is Right<L, R> {
    return false;
  }
}

export class Right<L, R> {
  readonly value: R;

  constructor(value: R) {
    this.value = value;
  }

  isLeft(): this is Left<L, R> {
    return false;
  }

  isRight(): this is Right<L, R> {
    return true;
  }
}

export type Either<L, R> = Left<L, R> | Right<L, R>;

export const left = <L, R>(value: L): Either<L, R> => new Left(value);
export const right = <L, R>(value: R): Either<L, R> => new Right(value);

type UnwrapRights<T extends Either<unknown, unknown>[]> = {
  [K in keyof T]: T[K] extends Either<unknown, infer R> ? R : never;
};

type InferLeft<T extends Either<unknown, unknown>[]> =
  T[number] extends Either<infer L, unknown> ? L : never;

export function collect<T extends Either<unknown, unknown>[]>(
  eithers: [...T],
): Either<InferLeft<T>, UnwrapRights<T>> {
  const values: unknown[] = [];
  for (const either of eithers) {
    if (either.isLeft()) return left(either.value as InferLeft<T>);
    values.push((either as Right<unknown, unknown>).value);
  }
  return right(values as UnwrapRights<T>);
}
