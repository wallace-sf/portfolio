import { v4 as uuid, validate } from 'uuid';

import { ValueObject } from '../base';

interface IdProps {
  value: string;
  isNew: boolean;
}

export class Id extends ValueObject<IdProps> {
  static readonly ERROR_INVALID_ID = 'ERROR_INVALID_ID';

  private constructor(value?: string) {
    super({ value: value ?? uuid(), isNew: value == null });
    this._validate(this._props.value);
  }

  static new(value?: string): Id {
    return new Id(value);
  }

  static isValid(value = ''): boolean {
    return validate(value);
  }

  private _validate(value?: string): void {
    const isValid = Id.isValid(value);

    if (!isValid) throw new Error(Id.ERROR_INVALID_ID);
  }

  get value(): string {
    return this._props.value;
  }

  get isNew(): boolean {
    return this._props.isNew;
  }
}
