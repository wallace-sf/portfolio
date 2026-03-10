import {
  DateRange,
  Either,
  EmploymentType,
  EmploymentTypeValue,
  Entity,
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

export class Experience extends Entity<Experience, IExperienceProps> {
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
    const companyResult = LocalizedText.create(
      props.company ?? { 'pt-BR': '' },
    );
    if (companyResult.isLeft()) return left(companyResult.value);

    const positionResult = LocalizedText.create(
      props.position ?? { 'pt-BR': '' },
    );
    if (positionResult.isLeft()) return left(positionResult.value);

    const locationResult = LocalizedText.create(
      props.location ?? { 'pt-BR': '' },
    );
    if (locationResult.isLeft()) return left(locationResult.value);

    const descriptionResult = LocalizedText.create(
      props.description ?? { 'pt-BR': '' },
    );
    if (descriptionResult.isLeft()) return left(descriptionResult.value);

    const logoResult = Image.create(props.logo?.url, props.logo?.alt);
    if (logoResult.isLeft()) return left(logoResult.value);

    const employmentResult = EmploymentType.create(props.employment_type);
    if (employmentResult.isLeft()) return left(employmentResult.value);

    const locationTypeResult = LocationType.create(props.location_type);
    if (locationTypeResult.isLeft()) return left(locationTypeResult.value);

    const periodResult = DateRange.create(props.start_at, props.end_at);
    if (periodResult.isLeft()) return left(periodResult.value);

    const skills: ExperienceSkill[] = [];
    for (const skillProps of props.skills ?? []) {
      const skillResult = ExperienceSkill.create(skillProps);
      if (skillResult.isLeft()) return left(skillResult.value);
      skills.push(skillResult.value);
    }

    return right(
      new Experience(
        props,
        companyResult.value,
        positionResult.value,
        locationResult.value,
        descriptionResult.value,
        logoResult.value,
        employmentResult.value,
        locationTypeResult.value,
        skills,
        periodResult.value,
      ),
    );
  }
}
