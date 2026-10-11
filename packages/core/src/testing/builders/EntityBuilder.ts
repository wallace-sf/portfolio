import { IEntityProps } from '../../index';

export abstract class EntityBuilder<TProps extends IEntityProps> {
  protected readonly _props: Partial<TProps>;

  constructor(props: Partial<TProps>) {
    this._props = props;
  }

  public withId(id: string): this {
    this._props.id = id;

    return this;
  }

  public withCreatedAt(createdAt: string): this {
    this._props.created_at = createdAt;

    return this;
  }

  public withUpdatedAt(updatedAt: string): this {
    this._props.updated_at = updatedAt;

    return this;
  }

  public withDeletedAt(deletedAt: string): this {
    this._props.deleted_at = deletedAt;

    return this;
  }

  public withoutId(): this {
    this._props.id = undefined;

    return this;
  }

  public withoutCreatedAt(): this {
    this._props.created_at = undefined;

    return this;
  }

  public withoutUpdatedAt(): this {
    this._props.updated_at = undefined;

    return this;
  }

  public withoutDeletedAt(): this {
    this._props.deleted_at = undefined;

    return this;
  }

  public toProps(): TProps {
    return this._props as TProps;
  }
}
