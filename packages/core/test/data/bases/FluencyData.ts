import { faker } from '@faker-js/faker';

import { Fluency, FluencyValue } from '../../../src';

export class FluencyData {
  static valid(): FluencyValue {
    return Fluency.LEVELS[
      faker.number.int({ min: 0, max: Fluency.LEVELS.length - 1 })
    ] as FluencyValue;
  }
}
