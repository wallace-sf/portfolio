import { faker } from '@faker-js/faker';

import { LocationType, LocationTypeValue } from '../../../src';

export class LocationTypeData {
  static valid(): LocationTypeValue {
    return LocationType.LOCATIONS[
      faker.number.int({ min: 0, max: LocationType.LOCATIONS.length - 1 })
    ] as LocationTypeValue;
  }
}
