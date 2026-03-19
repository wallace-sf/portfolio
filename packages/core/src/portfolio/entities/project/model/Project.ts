import { Validator } from '@repo/utils/validator';

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
  static readonly ERROR_CODE = 'INVALID_PROJECT';

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
    {
      const { error, isValid } = Validator.of(props.status)
        .in(
          Object.values(ProjectStatus),
          `Status must be one of: ${Object.values(ProjectStatus).join(', ')}.`,
        )
        .validate();
      if (!isValid && error)
        return left(
          new ValidationError({ code: Project.ERROR_CODE, message: error }),
        );
    }

    const fieldsResult = collect([
      Slug.create(props.slug),
      Image.create(props.coverImage?.url, props.coverImage?.alt),
      LocalizedText.create(props.title ?? { 'pt-BR': '' }),
      LocalizedText.create(props.caption ?? { 'pt-BR': '' }),
      Text.create(props.content, { min: 3, max: 500000 }),
      SkillFactory.bulk(props.skills),
      DateRange.create(props.period?.start, props.period?.end),
      props.theme
        ? LocalizedText.create(props.theme)
        : right<ValidationError, LocalizedText | undefined>(undefined),
      props.summary
        ? LocalizedText.create(props.summary)
        : right<ValidationError, LocalizedText | undefined>(undefined),
      props.objectives
        ? LocalizedText.create(props.objectives)
        : right<ValidationError, LocalizedText | undefined>(undefined),
      props.role
        ? LocalizedText.create(props.role)
        : right<ValidationError, LocalizedText | undefined>(undefined),
    ]);
    if (fieldsResult.isLeft()) return left(fieldsResult.value);

    const [
      slug,
      coverImage,
      title,
      caption,
      content,
      skills,
      period,
      theme,
      summary,
      objectives,
      role,
    ] = fieldsResult.value;

    const relatedResult = collect(
      (props.relatedProjects ?? []).map((s) => Slug.create(s)),
    );
    if (relatedResult.isLeft()) return left(relatedResult.value);

    const relatedSlugs = relatedResult.value as Slug[];
    const ownSlugValue = slug.value;

    const { error: relatedError, isValid: relatedValid } = Validator.of(
      relatedSlugs,
    )
      .refine(
        (slugs) => !slugs.some((s) => s.value === ownSlugValue),
        'A project cannot reference itself as a related project.',
      )
      .refine((slugs) => {
        const values = slugs.map((s) => s.value);
        return new Set(values).size === values.length;
      }, 'Related projects must not contain duplicate slugs.')
      .validate();

    if (!relatedValid && relatedError)
      return left(
        new ValidationError({
          code: Project.ERROR_CODE,
          message: relatedError,
        }),
      );

    return right(
      new Project(
        props,
        slug,
        coverImage,
        title,
        caption,
        content,
        skills,
        theme as LocalizedText | undefined,
        summary as LocalizedText | undefined,
        objectives as LocalizedText | undefined,
        role as LocalizedText | undefined,
        period,
        relatedSlugs,
      ),
    );
  }
}
