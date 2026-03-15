import { EmploymentTypeData } from './EmploymentTypeData';
import { FluencyData } from './FluencyData';
import { ImageData } from './ImageData';
import { LocationTypeData } from './LocationTypeData';
import { SkillTypeData } from './SkillTypeData';
import { SlugData } from './SlugData';
import { TextData } from './TextData';

export { EmploymentTypeData };
export { FluencyData };
export { ImageData };
export { LocationTypeData };
export { SkillTypeData };
export { SlugData };
export { TextData };

export class Data {
  static employment = EmploymentTypeData;
  static fluency = FluencyData;
  static image = ImageData;
  static location = LocationTypeData;
  static skill = SkillTypeData;
  static slug = SlugData;
  static text = TextData;
}
