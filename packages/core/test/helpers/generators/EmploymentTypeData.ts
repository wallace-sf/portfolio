import { EmploymentType } from '~/index';

export class EmploymentTypeData {
  static valid(): EmploymentType {
    return EmploymentType.FULL_TIME;
  }
}
