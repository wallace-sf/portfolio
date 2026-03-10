import {
  Either,
  Entity,
  IEntityProps,
  left,
  right,
  Text,
  ValidationError,
} from '../../../../shared';
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

  private constructor(
    props: IProjectProps,
    title: Text,
    caption: Text,
    content: Text,
    skills: Skill[],
  ) {
    super(props);
    this.title = title;
    this.caption = caption;
    this.content = content;
    this.skills = skills;
  }

  static create(props: IProjectProps): Either<ValidationError, Project> {
    const titleResult = Text.create(props.title, { min: 3, max: 60 });
    if (titleResult.isLeft()) return left(titleResult.value);

    const captionResult = Text.create(props.caption, { min: 3, max: 200 });
    if (captionResult.isLeft()) return left(captionResult.value);

    const contentResult = Text.create(props.content, { min: 3, max: 12500 });
    if (contentResult.isLeft()) return left(contentResult.value);

    const skillsResult = SkillFactory.bulk(props.skills);
    if (skillsResult.isLeft()) return left(skillsResult.value);

    return right(
      new Project(
        props,
        titleResult.value,
        captionResult.value,
        contentResult.value,
        skillsResult.value,
      ),
    );
  }
}
