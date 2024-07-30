interface IValueObjectProps<TValue> {
  value: TValue;
  isNew: boolean;
}

export abstract class ValueObject<TValueObject, TValue> {
  protected readonly _props: Readonly<IValueObjectProps<TValue>>;

  protected constructor(props: IValueObjectProps<TValue>) {
    this._props = Object.freeze(props);
  }

  public equals(vo: ValueObject<TValueObject, TValue>): boolean {
    return vo != null && this.value === vo.value;
  }

  public diff(vo: ValueObject<TValueObject, TValue>): boolean {
    return !this.equals(vo);
  }

  public get value(): TValue {
    return this._props.value;
  }

  public get isNew(): boolean {
    return this._props.isNew;
  }
}
