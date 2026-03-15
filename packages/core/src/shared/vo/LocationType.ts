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
    if (!(LocationType.LOCATIONS as readonly string[]).includes(value))
      return left(
        new ValidationError({
          code: LocationType.ERROR_CODE,
          message: 'The value must be a valid location type.',
        }),
      );

    return right(new LocationType(value));
  }
}
