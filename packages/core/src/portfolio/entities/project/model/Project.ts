import {
  collect,
  DateRange,
  Either,
  Entity,
  IEntityProps,
  ILocalizedTextInput,
  Image,
  LocalizedText,
  Slug,
  Text,
  ValidationError,
  left,
  right,
} from '../../../../shared';
import { ISkillProps, Skill, SkillFactory } from '../../skill';
import { ProjectStatus } from './ProjectStatus';

export interface IProjectCoverImage {
  url: string;
  alt: ILocalizedTextInput;
}

export interface IProjectPeriod {
  start: string;
  end?: string;
}

export interface IProjectProps extends IEntityProps {
  slug: string;
  coverImage: IProjectCoverImage;
  title: ILocalizedTextInput;
  caption: ILocalizedTextInput;
  content: string;
  skills: ISkillProps[];
  theme?: ILocalizedTextInput;
  summary?: ILocalizedTextInput;
  objectives?: ILocalizedTextInput;
  role?: ILocalizedTextInput;
  team?: string;
  period: IProjectPeriod;
  featured: boolean;
  status: ProjectStatus;
  relatedProjects?: string[];
}

export class Project extends Entity<Project, IProjectProps> {
  public readonly slug: Slug;
  public readonly coverImage: Image;
  public readonly title: LocalizedText;
  public readonly caption: LocalizedText;
  public readonly content: Text;
  public readonly skills: Skill[];
  public readonly theme: LocalizedText | undefined;
  public readonly summary: LocalizedText | undefined;
  public readonly objectives: LocalizedText | undefined;
  public readonly role: LocalizedText | undefined;
  public readonly team: string | undefined;
  public readonly period: DateRange;
  public readonly featured: boolean;
  public readonly status: ProjectStatus;
  public readonly relatedProjects: Slug[];

  private constructor(
    props: IProjectProps,
    slug: Slug,
    coverImage: Image,
    title: LocalizedText,
    caption: LocalizedText,
    content: Text,
    skills: Skill[],
    theme: LocalizedText | undefined,
    summary: LocalizedText | undefined,
    objectives: LocalizedText | undefined,
    role: LocalizedText | undefined,
    period: DateRange,
    relatedProjects: Slug[],
  ) {
    super(props);
    this.slug = slug;
    this.coverImage = coverImage;
    this.title = title;
    this.caption = caption;
    this.content = content;
    this.skills = skills;
    this.theme = theme;
    this.summary = summary;
    this.objectives = objectives;
    this.role = role;
    this.team = props.team;
    this.period = period;
    this.featured = props.featured;
    this.status = props.status;
    this.relatedProjects = relatedProjects;
  }

  static create(props: IProjectProps): Either<ValidationError, Project> {
    const requiredResult = collect([
      Slug.create(props.slug),
      Image.create(props.coverImage?.url, props.coverImage?.alt),
      LocalizedText.create(props.title ?? { 'pt-BR': '' }),
      LocalizedText.create(props.caption ?? { 'pt-BR': '' }),
      Text.create(props.content, { min: 3, max: 500000 }),
      SkillFactory.bulk(props.skills),
      DateRange.create(props.period?.start, props.period?.end),
    ]);
    if (requiredResult.isLeft()) return left(requiredResult.value);

    const [slug, coverImage, title, caption, content, skills, period] =
      requiredResult.value;

    let theme: LocalizedText | undefined;
    if (props.theme) {
      const r = LocalizedText.create(props.theme);
      if (r.isLeft()) return left(r.value);
      theme = r.value;
    }

    let summary: LocalizedText | undefined;
    if (props.summary) {
      const r = LocalizedText.create(props.summary);
      if (r.isLeft()) return left(r.value);
      summary = r.value;
    }

    let objectives: LocalizedText | undefined;
    if (props.objectives) {
      const r = LocalizedText.create(props.objectives);
      if (r.isLeft()) return left(r.value);
      objectives = r.value;
    }

    let role: LocalizedText | undefined;
    if (props.role) {
      const r = LocalizedText.create(props.role);
      if (r.isLeft()) return left(r.value);
      role = r.value;
    }

    const relatedProjects: Slug[] = [];
    for (const rawSlug of props.relatedProjects ?? []) {
      const r = Slug.create(rawSlug);
      if (r.isLeft()) return left(r.value);
      relatedProjects.push(r.value);
    }

    return right(
      new Project(
        props,
        slug,
        coverImage,
        title,
        caption,
        content,
        skills,
        theme,
        summary,
        objectives,
        role,
        period,
        relatedProjects,
      ),
    );
  }
}
