import { LocationType, LocationTypeValue } from '../../../src';

export class LocationTypeData {
  static valid(): LocationTypeValue {
    return LocationType.LOCATIONS[0] as LocationTypeValue;
  }
}
