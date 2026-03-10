import {
  Experience,
  IExperienceProps,
  IExperienceSkillProps,
  EmploymentTypeValue,
  ILocalizedTextInput,
  LocationTypeValue,
} from '../../src';
import { Data } from './bases';
import { EntityBuilder } from './EntityBuilder';
import { SkillBuilder } from './SkillBuilder';

function experienceSkillListToProps(count: number): IExperienceSkillProps[] {
  return SkillBuilder.listToProps(count).map((skill) => ({
    skill,
    workDescription: { 'pt-BR': Data.text.description() },
  }));
}

export class ExperienceBuilder extends EntityBuilder<IExperienceProps> {
  private constructor(props: IExperienceProps) {
    super(props);
  }

  static build(): ExperienceBuilder {
    return new ExperienceBuilder({
      company: { 'pt-BR': 'Portfolio Inc' },
      position: { 'pt-BR': 'Software Engineer' },
      location: { 'pt-BR': 'São Paulo, Brazil' },
      description: { 'pt-BR': Data.text.description() },
      logo: { url: Data.image.url(), alt: Data.image.alt() },
      employment_type: Data.employment.valid(),
      location_type: Data.location.valid(),
      start_at: '2022-01-01T00:00:00.000Z',
      end_at: '2022-01-02T00:00:00.000Z',
      skills: experienceSkillListToProps(2),
    });
  }

  static list(count: number): Experience[] {
    return [...Array(count)].map(() => ExperienceBuilder.build().now());
  }

  public now(): Experience {
    const result = Experience.create(this._props as IExperienceProps);
    if (result.isLeft()) throw result.value;
    return result.value;
  }

  public withCompany(company: ILocalizedTextInput): ExperienceBuilder {
    this._props.company = company;
    return this;
  }

  public withPosition(position: ILocalizedTextInput): ExperienceBuilder {
    this._props.position = position;
    return this;
  }

  public withLocation(location: ILocalizedTextInput): ExperienceBuilder {
    this._props.location = location;
    return this;
  }

  public withDescription(description: ILocalizedTextInput): ExperienceBuilder {
    this._props.description = description;
    return this;
  }

  public withLogo(url: string, alt: ILocalizedTextInput): ExperienceBuilder {
    this._props.logo = { url, alt };
    return this;
  }

  public withEmploymentType(
    employmentType: EmploymentTypeValue,
  ): ExperienceBuilder {
    this._props.employment_type = employmentType;
    return this;
  }

  public withLocationType(locationType: LocationTypeValue): ExperienceBuilder {
    this._props.location_type = locationType;
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

  public withSkills(skills: IExperienceSkillProps[]): ExperienceBuilder {
    this._props.skills = skills;
    return this;
  }

  public withoutCompany(): ExperienceBuilder {
    this._props.company = undefined;
    return this;
  }

  public withoutPosition(): ExperienceBuilder {
    this._props.position = undefined;
    return this;
  }

  public withoutLocation(): ExperienceBuilder {
    this._props.location = undefined;
    return this;
  }

  public withoutDescription(): ExperienceBuilder {
    this._props.description = undefined;
    return this;
  }

  public withoutLogo(): ExperienceBuilder {
    this._props.logo = undefined;
    return this;
  }

  public withoutEmploymentType(): ExperienceBuilder {
    this._props.employment_type = undefined;
    return this;
  }

  public withoutLocationType(): ExperienceBuilder {
    this._props.location_type = undefined;
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
