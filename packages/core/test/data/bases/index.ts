import { EmploymentTypeData } from './EmploymentTypeData';
import { FluencyData } from './FluencyData';
import { ImageData } from './ImageData';
import { LocationTypeData } from './LocationTypeData';
import { TextData } from './NameData';
import { SkillTypeData } from './SkillTypeData';
import { SlugData } from './SlugData';

export class Data {
  static employment = EmploymentTypeData;
  static fluency = FluencyData;
  static image = ImageData;
  static location = LocationTypeData;
  static skill = SkillTypeData;
  static slug = SlugData;
  static text = TextData;
}
