import { Either, right } from '~/shared/either';
import { ValidationError } from '~/shared/errors';
import { DateTime } from '~/shared/vo/DateTime';
import { Id } from '~/shared/vo/Id';

export interface IEntityProps {
  created_at?: string;
  deleted_at?: string | null;
  id?: string;
  updated_at?: string;
}

export abstract class Entity<TEntity, TProps extends IEntityProps> {
  public readonly created_at: DateTime;
  public readonly deleted_at: DateTime | null;
  public readonly id: Id;
  public readonly props: TProps;
  public readonly updated_at: DateTime;

  constructor(props: TProps) {
    const idResult: Either<ValidationError, Id> =
      props.id != null ? Id.create(props.id) : right(Id.generate());
    if (idResult.isLeft()) throw idResult.value;
    this.id = idResult.value;

    const createdAtResult: Either<ValidationError, DateTime> =
      props.created_at != null
        ? DateTime.create(props.created_at)
        : right(DateTime.now());
    if (createdAtResult.isLeft()) throw createdAtResult.value;
    this.created_at = createdAtResult.value;

    const updatedAtResult: Either<ValidationError, DateTime> =
      props.updated_at != null
        ? DateTime.create(props.updated_at)
        : right(DateTime.now());
    if (updatedAtResult.isLeft()) throw updatedAtResult.value;
    this.updated_at = updatedAtResult.value;

    if (props.deleted_at != null) {
      const deletedAtResult = DateTime.create(props.deleted_at);
      if (deletedAtResult.isLeft()) throw deletedAtResult.value;
      this.deleted_at = deletedAtResult.value;
    } else {
      this.deleted_at = null;
    }

    this.props = Object.freeze({ ...props, id: this.id.value }) as TProps;
  }

  public equals(entity: Entity<TEntity, TProps>): boolean {
    return this.id.equals(entity.id);
  }

  public diff(entity: Entity<TEntity, TProps>): boolean {
    return this.id.diff(entity.id);
  }

  public clone(props: TProps): TEntity {
    const entity = this.constructor as new (props: TProps) => TEntity;

    return new entity({ ...this.props, ...props });
  }
}
