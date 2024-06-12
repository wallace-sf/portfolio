import _isEqual from 'lodash/isEqual';

export abstract class ValueObject<T extends object> {
  protected readonly _props;

  constructor(props: T) {
    this._props = Object.freeze(props);
  }

  public equals(vo: ValueObject<T>): boolean {
    return vo != null && _isEqual(this._props, vo._props);
  }

  public diff(vo: ValueObject<T>): boolean {
    return !this.equals(vo);
  }
}
