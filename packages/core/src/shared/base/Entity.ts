import { DateTime } from '../vo/DateTime';
import { Id } from '../vo/Id';
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
    this.created_at = DateTime.new(props.created_at);
    this.deleted_at = props.deleted_at ? DateTime.new(props.deleted_at) : null;
    this.id = Id.new(props.id);
    this.updated_at = DateTime.new(props.updated_at);
    this.props = props;
    this.props.id = this.id.value;
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
