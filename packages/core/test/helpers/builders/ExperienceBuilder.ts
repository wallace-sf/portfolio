import {
  Experience,
  IExperienceProps,
  EmploymentType,
  ILocalizedTextInput,
  LocationType,
} from '../../../src';
import { Data } from '../generators';
import { EntityBuilder } from './EntityBuilder';

export class ExperienceBuilder extends EntityBuilder<IExperienceProps> {
  private constructor(props: IExperienceProps) {
    super(props);
  }

  static build(): ExperienceBuilder {
    return new ExperienceBuilder({
      company: { 'en-US': 'Portfolio Inc', 'pt-BR': 'Portfolio Inc' },
      position: { 'en-US': 'Software Engineer', 'pt-BR': 'Software Engineer' },
      location: { 'en-US': 'São Paulo, Brazil', 'pt-BR': 'São Paulo, Brazil' },
      description: { 'en-US': Data.text.description(), 'pt-BR': Data.text.description() },
      logo: { url: Data.image.url(), alt: Data.image.alt() },
      employment_type: Data.employment.valid(),
      location_type: Data.location.valid(),
      start_at: '2022-01-01T00:00:00.000Z',
      end_at: '2022-01-02T00:00:00.000Z',
      skills: [
        'a0000000-0000-4000-8000-000000000001',
        'a0000000-0000-4000-8000-000000000002',
      ],
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

  public withEmploymentType(employmentType: EmploymentType): ExperienceBuilder {
    this._props.employment_type = employmentType;
    return this;
  }

  public withLocationType(locationType: LocationType): ExperienceBuilder {
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

  public withSkills(skills: string[]): ExperienceBuilder {
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
