import { EmploymentType, EmploymentTypeValue } from '../../../src';

export class EmploymentTypeData {
  static valid(): EmploymentTypeValue {
    return EmploymentType.EMPLOYMENTS[0] as EmploymentTypeValue;
  }
}
