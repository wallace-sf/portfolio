import { EmploymentType } from '../../../src';

export class EmploymentTypeData {
  static valid(): EmploymentType {
    return EmploymentType.FULL_TIME;
  }
}
