import {
  collect,
  DateRange,
  Either,
  EmploymentType,
  EmploymentTypeValue,
  AggregateRoot,
  IEntityProps,
  ILocalizedTextInput,
  Image,
  LocalizedText,
  LocationType,
  LocationTypeValue,
  ValidationError,
  left,
  right,
} from '../../../../shared';
import { ExperienceSkill, IExperienceSkillProps } from './ExperienceSkill';

export interface IExperienceLogo {
  url: string;
  alt: ILocalizedTextInput;
}

export interface IExperienceProps extends IEntityProps {
  company: ILocalizedTextInput;
  position: ILocalizedTextInput;
  location: ILocalizedTextInput;
  description: ILocalizedTextInput;
  logo: IExperienceLogo;
  employment_type: EmploymentTypeValue;
  location_type: LocationTypeValue;
  skills: IExperienceSkillProps[];
  start_at: string;
  end_at?: string;
}

export class Experience extends AggregateRoot<Experience, IExperienceProps> {
  static readonly ERROR_CODE = 'INVALID_EXPERIENCE';

  public readonly company: LocalizedText;
  public readonly position: LocalizedText;
  public readonly location: LocalizedText;
  public readonly description: LocalizedText;
  public readonly logo: Image;
  public readonly employment_type: EmploymentType;
  public readonly location_type: LocationType;
  public readonly skills: ExperienceSkill[];
  public readonly period: DateRange;

  private constructor(
    props: IExperienceProps,
    company: LocalizedText,
    position: LocalizedText,
    location: LocalizedText,
    description: LocalizedText,
    logo: Image,
    employment_type: EmploymentType,
    location_type: LocationType,
    skills: ExperienceSkill[],
    period: DateRange,
  ) {
    super(props);
    this.company = company;
    this.position = position;
    this.location = location;
    this.description = description;
    this.logo = logo;
    this.employment_type = employment_type;
    this.location_type = location_type;
    this.skills = skills;
    this.period = period;
  }

  static create(props: IExperienceProps): Either<ValidationError, Experience> {
    const result = collect([
      LocalizedText.create(props.company ?? { 'pt-BR': '' }),
      LocalizedText.create(props.position ?? { 'pt-BR': '' }),
      LocalizedText.create(props.location ?? { 'pt-BR': '' }),
      LocalizedText.create(props.description ?? { 'pt-BR': '' }),
      Image.create(props.logo?.url, props.logo?.alt),
      EmploymentType.create(props.employment_type),
      LocationType.create(props.location_type),
      DateRange.create(props.start_at, props.end_at),
    ]);
    if (result.isLeft()) return left(result.value);

    const [
      company,
      position,
      location,
      description,
      logo,
      employment_type,
      location_type,
      period,
    ] = result.value;

    const skills: ExperienceSkill[] = [];
    for (const skillProps of props.skills ?? []) {
      const skillResult = ExperienceSkill.create(skillProps);
      if (skillResult.isLeft()) return left(skillResult.value);
      skills.push(skillResult.value);
    }

    return right(
      new Experience(
        props,
        company,
        position,
        location,
        description,
        logo,
        employment_type,
        location_type,
        skills,
        period,
      ),
    );
  }
}
