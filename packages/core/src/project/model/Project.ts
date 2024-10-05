import { Entity, IEntityProps, Text } from '../../shared';
import { ISkillProps, Skill, SkillFactory } from '../../skill';

export interface IProjectProps extends IEntityProps {
  title: string;
  caption: string;
  content: string;
  skills: ISkillProps[];
}

export class Project extends Entity<Project, IProjectProps> {
  public readonly title: Text;
  public readonly caption: Text;
  public readonly content: Text;
  public readonly skills: Skill[];

  constructor(props: IProjectProps) {
    super(props);
    this.title = Text.new(props.title, { min: 3, max: 60 });
    this.caption = Text.new(props.caption, { min: 3, max: 200 });
    this.content = Text.new(props.content, { min: 3, max: 12500 });
    this.skills = SkillFactory.bulk(props.skills);
  }
}
