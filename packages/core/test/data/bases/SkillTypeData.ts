import { faker } from '@faker-js/faker';

import { SkillType, SkillTypeValue } from '../../../src';

export class SkillTypeData {
  static valid(): SkillTypeValue {
    return SkillType.SKILLS[
      faker.number.int({ min: 0, max: SkillType.SKILLS.length - 1 })
    ] as SkillTypeValue;
  }
}
