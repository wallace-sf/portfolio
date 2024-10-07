import { faker } from '@faker-js/faker';

import {
  Experience,
  IExperienceProps,
  EmploymentTypeValue,
  LocationTypeValue,
  ISkillProps,
} from '../../src';
import { Data } from './bases';
import { EntityBuilder } from './EntityBuilder';
import { SkillBuilder } from './SkillBuilder';

export class ExperienceBuilder extends EntityBuilder<IExperienceProps> {
  private constructor(props: IExperienceProps) {
    super(props);
  }

  static build(): ExperienceBuilder {
    return new ExperienceBuilder({
      location: faker.location.city(),
      employment_type: Data.employment.valid(),
      position: faker.person.jobTitle(),
      location_type: Data.location.valid(),
      company: faker.company.name(),
      start_at: new Date().toISOString(),
      end_at: new Date().toISOString(),
      skills: SkillBuilder.listToProps(faker.number.int({ min: 0, max: 10 })),
    });
  }

  static list(count: number): Experience[] {
    return [...Array(count)].map(() => ExperienceBuilder.build().now());
  }

  public now(): Experience {
    return new Experience(this._props as IExperienceProps);
  }

  public withLocation(location: string): ExperienceBuilder {
    this._props.location = location;

    return this;
  }

  public withEmploymentType(
    employmentType: EmploymentTypeValue,
  ): ExperienceBuilder {
    this._props.employment_type = employmentType;

    return this;
  }

  public withPosition(position: string): ExperienceBuilder {
    this._props.position = position;

    return this;
  }

  public withLocationType(locationType: LocationTypeValue): ExperienceBuilder {
    this._props.location_type = locationType;

    return this;
  }

  public withCompany(company: string): ExperienceBuilder {
    this._props.company = company;

    return this;
  }

  public withStartAt(startAt: string): ExperienceBuilder {
    this._props.start_at = startAt;

    return this;
  }

  public withEndAt(endAt: string): ExperienceBuilder {
    this._props.end_at = endAt;

    return this;
  }

  public withSkills(skills: ISkillProps[]): ExperienceBuilder {
    this._props.skills = skills;

    return this;
  }

  public withoutLocation(): ExperienceBuilder {
    this._props.location = undefined;

    return this;
  }

  public withoutEmploymentType(): ExperienceBuilder {
    this._props.employment_type = undefined;

    return this;
  }

  public withoutPosition(): ExperienceBuilder {
    this._props.position = undefined;

    return this;
  }

  public withoutLocationType(): ExperienceBuilder {
    this._props.location_type = undefined;

    return this;
  }

  public withoutCompany(): ExperienceBuilder {
    this._props.company = undefined;

    return this;
  }

  public withoutStartAt(): ExperienceBuilder {
    this._props.start_at = undefined;

    return this;
  }

  public withoutEndAt(): ExperienceBuilder {
    this._props.end_at = undefined;

    return this;
  }

  public withoutSkills(): ExperienceBuilder {
    this._props.skills = undefined;

    return this;
  }
}
