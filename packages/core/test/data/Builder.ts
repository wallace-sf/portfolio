import { IEntityProps } from '../../src';

export abstract class Builder<TProps extends IEntityProps> {
  protected readonly _props: Partial<TProps>;

  constructor(props: Partial<TProps>) {
    this._props = props;
  }

  public withId(id: string): Builder<TProps> {
    this._props.id = id;

    return this;
  }

  public withoutId(): Builder<TProps> {
    this._props.id = undefined;

    return this;
  }
}
