import _isEqual from 'lodash/isEqual';

interface IValueObjectProps<TValue> {
  value: TValue;
  isNew: boolean;
}

export abstract class ValueObject<TValue> {
  protected readonly _props: Readonly<IValueObjectProps<TValue>>;

  protected constructor(props: IValueObjectProps<TValue>) {
    this._props = Object.freeze(props);
  }

  public equals(vo: ValueObject<TValue>): boolean {
    return vo != null && _isEqual(this._props, vo._props);
  }

  public diff(vo: ValueObject<TValue>): boolean {
    return !this.equals(vo);
  }

  public get value(): TValue {
    return this._props.value;
  }

  public get isNew(): boolean {
    return this._props.isNew;
  }
}
