import { SkillType, SkillTypeValue } from '../../../src';

export class SkillTypeData {
  static valid(): SkillTypeValue {
    return SkillType.SKILLS[0] as SkillTypeValue;
  }
}
