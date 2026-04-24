import {
  collect,
  DateRange,
  Either,
  AggregateRoot,
  Id,
  IEntityProps,
  ILocalizedTextInput,
  Image,
  LocalizedText,
  ValidationError,
  left,
  right,
  validateEnum,
} from '../../../../shared';
import { EmploymentType } from './EmploymentType';
import { LocationType } from './LocationType';

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
  employment_type: EmploymentType;
  location_type: LocationType;
  skills: string[];
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
  public readonly skills: Id[];
  public readonly period: DateRange;

  private constructor(
    props: IExperienceProps,
    employment_type: EmploymentType,
    location_type: LocationType,
    company: LocalizedText,
    position: LocalizedText,
    location: LocalizedText,
    description: LocalizedText,
    logo: Image,
    skills: Id[],
    period: DateRange,
  ) {
    super(props);
    this.employment_type = employment_type;
    this.location_type = location_type;
    this.company = company;
    this.position = position;
    this.location = location;
    this.description = description;
    this.logo = logo;
    this.skills = skills;
    this.period = period;
  }

  static create(props: IExperienceProps): Either<ValidationError, Experience> {
    const result = collect([
      validateEnum(
        props.employment_type,
        Object.values(EmploymentType),
        Experience.ERROR_CODE,
        'Invalid employment type.',
      ),
      validateEnum(
        props.location_type,
        Object.values(LocationType),
        Experience.ERROR_CODE,
        'Invalid location type.',
      ),
      LocalizedText.create(props.company ?? { 'en-US': '' }),
      LocalizedText.create(props.position ?? { 'en-US': '' }),
      LocalizedText.create(props.location ?? { 'en-US': '' }),
      LocalizedText.create(props.description ?? { 'en-US': '' }),
      Image.create(props.logo?.url, props.logo?.alt),
      DateRange.create(props.start_at, props.end_at),
    ]);
    if (result.isLeft()) return left(result.value);

    const [
      employment_type,
      location_type,
      company,
      position,
      location,
      description,
      logo,
      period,
    ] = result.value;

    const skills: Id[] = [];
    for (const skillId of props.skills ?? []) {
      const idResult = Id.create(skillId);
      if (idResult.isLeft()) return left(idResult.value);
      skills.push(idResult.value);
    }

    return right(
      new Experience(
        props,
        employment_type,
        location_type,
        company,
        position,
        location,
        description,
        logo,
        skills,
        period,
      ),
    );
  }
}
