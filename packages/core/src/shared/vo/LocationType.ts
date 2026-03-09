import { Validator } from '@repo/utils';

import { ValueObject } from '../base/ValueObject';
import { left, right, Either } from '../either';
import { ValidationError } from '../errors';

export type LocationTypeValue = Readonly<typeof LocationType.LOCATIONS>[number];

export class LocationType extends ValueObject<LocationTypeValue> {
  static readonly ERROR_CODE = 'INVALID_LOCATION_TYPE';
  static readonly LOCATIONS = ['ON-SITE', 'HYBRID', 'REMOTE'] as const;

  private constructor(value: LocationTypeValue) {
    super({ value });
  }

  static create(
    value: LocationTypeValue,
  ): Either<ValidationError, LocationType> {
    const { error, isValid } = Validator.new(value)
      .in(
        [...LocationType.LOCATIONS],
        'The value must be a valid location type.',
      )
      .validate();

    if (!isValid && error)
      return left(
        new ValidationError({ code: LocationType.ERROR_CODE, message: error }),
      );

    return right(new LocationType(value));
  }

  /** @deprecated Use LocationType.create() instead */
  static new(value: LocationTypeValue): LocationType {
    const result = LocationType.create(value);
    if (result.isLeft()) throw result.value;
    return result.value;
  }
}
