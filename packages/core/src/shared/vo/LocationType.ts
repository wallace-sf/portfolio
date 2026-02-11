import { Validator } from '@repo/utils';

import { ValidationError } from '../errors';

import { ValueObject } from '../base/ValueObject';

export type LocationTypeValue = Readonly<typeof LocationType.LOCATIONS>[number];

export class LocationType extends ValueObject<LocationTypeValue> {
  static readonly ERROR_CODE = 'ERROR_INVALID_LOCATION_TYPE';
  static readonly LOCATIONS = ['ON-SITE', 'HYBRID', 'REMOTE'] as const;

  private constructor(value: LocationTypeValue) {
    super({ value, isNew: false });
    this._validate(value);
  }

  static new(value: LocationTypeValue): LocationType {
    return new LocationType(value);
  }

  private _validate(value: string): void {
    const { error, isValid } = Validator.new(value)
      .in(
        [...LocationType.LOCATIONS],
        'O valor deve ser um tipo localização válido.',
      )
      .validate();

    const ERROR_CODE = LocationType.ERROR_CODE;

    if (!isValid && error) throw new ValidationError({ code: ERROR_CODE, message: error });
  }
}
