import { faker } from '@faker-js/faker';

import { EmploymentType, EmploymentTypeValue } from '../../../src';

export class EmploymentTypeData {
  static valid(): EmploymentTypeValue {
    return EmploymentType.EMPLOYMENTS[
      faker.number.int({ min: 0, max: EmploymentType.EMPLOYMENTS.length - 1 })
    ] as EmploymentTypeValue;
  }
}
