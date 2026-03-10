import {
  DateTime,
  Either,
  EmploymentType,
  EmploymentTypeValue,
  Entity,
  IEntityProps,
  left,
  LocationType,
  LocationTypeValue,
  right,
  Text,
  ValidationError,
} from '../../../../shared';
import { ISkillProps, Skill, SkillFactory } from '../../skill';

export interface IExperienceProps extends IEntityProps {
  company: string;
  employment_type: EmploymentTypeValue;
  end_at?: string;
  location: string;
  location_type: LocationTypeValue;
  position: string;
  skills: ISkillProps[];
  start_at: string;
}

export class Experience extends Entity<Experience, IExperienceProps> {
  static readonly ERROR_CODE = 'INVALID_EXPERIENCE';

  public readonly company: Text;
  public readonly employment_type: EmploymentType;
  public readonly end_at?: DateTime;
  public readonly location: Text;
  public readonly location_type: LocationType;
  public readonly position: Text;
  public readonly skills: Skill[];
  public readonly start_at: DateTime;

  private constructor(
    props: IExperienceProps,
    company: Text,
    employment_type: EmploymentType,
    location: Text,
    location_type: LocationType,
    position: Text,
    skills: Skill[],
    start_at: DateTime,
    end_at?: DateTime,
  ) {
    super(props);
    this.company = company;
    this.employment_type = employment_type;
    this.location = location;
    this.location_type = location_type;
    this.position = position;
    this.skills = skills;
    this.start_at = start_at;
    this.end_at = end_at;
  }

  static create(props: IExperienceProps): Either<ValidationError, Experience> {
    const companyResult = Text.create(props.company, { min: 3, max: 100 });
    if (companyResult.isLeft()) return left(companyResult.value);

    const employmentResult = EmploymentType.create(props.employment_type);
    if (employmentResult.isLeft()) return left(employmentResult.value);

    const locationResult = Text.create(props.location, { min: 3, max: 100 });
    if (locationResult.isLeft()) return left(locationResult.value);

    const locationTypeResult = LocationType.create(props.location_type);
    if (locationTypeResult.isLeft()) return left(locationTypeResult.value);

    const positionResult = Text.create(props.position, { min: 3, max: 100 });
    if (positionResult.isLeft()) return left(positionResult.value);

    const startResult = DateTime.create(props.start_at);
    if (startResult.isLeft()) return left(startResult.value);

    let endAt: DateTime | undefined;
    if (props.end_at !== undefined) {
      const endResult = DateTime.create(props.end_at);
      if (endResult.isLeft()) return left(endResult.value);
      endAt = endResult.value;

      if (startResult.value.ms > endAt.ms) {
        return left(
          new ValidationError({
            code: Experience.ERROR_CODE,
            message:
              'The start of the career must be less than or equal to the end of the career.',
          }),
        );
      }
    }

    const skillsResult = SkillFactory.bulk(props.skills);
    if (skillsResult.isLeft()) return left(skillsResult.value);

    return right(
      new Experience(
        props,
        companyResult.value,
        employmentResult.value,
        locationResult.value,
        locationTypeResult.value,
        positionResult.value,
        skillsResult.value,
        startResult.value,
        endAt,
      ),
    );
  }
}
