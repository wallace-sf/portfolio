import { EmploymentTypeData } from './EmploymentTypeData';
import { FluencyData } from './FluencyData';
import { LocationTypeData } from './LocationTypeData';
import { TextData } from './NameData';
import { SkillTypeData } from './SkillTypeData';

export class Data {
  static employment = EmploymentTypeData;
  static fluency = FluencyData;
  static location = LocationTypeData;
  static skill = SkillTypeData;
  static text = TextData;
}
