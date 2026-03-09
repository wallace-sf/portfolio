interface IValueObjectProps<TValue> {
  value: TValue;
}

export abstract class ValueObject<TValue, TConfig = Record<string, never>> {
  protected readonly _props: Readonly<IValueObjectProps<TValue>>;
  protected readonly _config: Readonly<Partial<TConfig>>;

  protected constructor(
    props: IValueObjectProps<TValue>,
    config: Partial<TConfig> = {},
  ) {
    this._props = Object.freeze(props);
    this._config = Object.freeze(config);
  }

  public equals(vo: ValueObject<TValue, TConfig>): boolean {
    if (vo == null) return false;
    if (typeof this.value !== 'object' || this.value === null) {
      return this.value === vo.value;
    }
    return JSON.stringify(this.value) === JSON.stringify(vo.value);
  }

  public diff(vo: ValueObject<TValue, TConfig>): boolean {
    return !this.equals(vo);
  }

  public get value(): TValue {
    return this._props.value;
  }
}
