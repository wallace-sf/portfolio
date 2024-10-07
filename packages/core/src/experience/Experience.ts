import { Validator, ValidationError } from '@repo/utils';

import {
  EmploymentType,
  EmploymentTypeValue,
  Entity,
  IEntityProps,
  LocationType,
  LocationTypeValue,
  Text,
  DateTime,
} from '../shared';
import { ISkillProps, Skill, SkillFactory } from '../skill';

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
  static readonly ERROR_CODE = 'ERROR_INVALID_EXPERIENCE';
  public readonly company: Text;
  public readonly employment_type: EmploymentType;
  public readonly end_at?: DateTime;
  public readonly location: Text;
  public readonly location_type: LocationType;
  public readonly position: Text;
  public readonly skills: Skill[];
  public readonly start_at: DateTime;

  constructor(props: IExperienceProps) {
    super(props);
    this.company = Text.new(props.company, { min: 3, max: 100 });
    this.skills = SkillFactory.bulk(props.skills);
    this.employment_type = EmploymentType.new(props.employment_type);
    this.end_at = props.end_at ? DateTime.new(props.end_at) : undefined;
    this.location = Text.new(props.location, { min: 3, max: 100 });
    this.location_type = LocationType.new(props.location_type);
    this.position = Text.new(props.position, { min: 3, max: 100 });
    this.start_at = DateTime.new(props.start_at);
    this._validate();
  }

  private _validate(): void {
    const { error, isValid } = Validator.combine(
      Validator.new(this.start_at.ms).lte(
        this.end_at?.value != null ? this.end_at.ms : this.start_at.ms,
        'O início da carreira deve ser menor ou igual ao final da carreira.',
      ),
    );

    const ERROR_CODE = Experience.ERROR_CODE;

    if (!isValid && error) throw new ValidationError(ERROR_CODE, error);
  }
}
