import { ISkillProps, Skill } from '../model';

export class SkillFactory {
  public static bulk(props: ISkillProps[]): Skill[] {
    return props.map((p) => new Skill(p));
  }
}
