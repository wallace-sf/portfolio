import { Prisma } from '@prisma/client';
import {
  IExperienceProps,
  Experience,
  EmploymentType,
  LocationType,
} from '@repo/core/portfolio';
import { ILocalizedTextInput } from '@repo/core/shared';

import { InfrastructureError } from '../../errors/InfrastructureError';

type PrismaExperience = Prisma.ExperienceGetPayload<Record<string, never>>;

type ExperienceScalarData = Prisma.ExperienceUncheckedCreateInput;

const LOCATION_TYPE_MAP: Record<string, LocationType> = {
  ONSITE: LocationType.ON_SITE,
  HYBRID: LocationType.HYBRID,
  REMOTE: LocationType.REMOTE,
};

const LOCATION_TYPE_REVERSE_MAP: Record<LocationType, string> = {
  [LocationType.ON_SITE]: 'ONSITE',
  [LocationType.HYBRID]: 'HYBRID',
  [LocationType.REMOTE]: 'REMOTE',
};

export class ExperienceMapper {
  static toDomain(raw: PrismaExperience): Experience {
    const asLocalized = (v: unknown) => v as ILocalizedTextInput;

    const locationType = LOCATION_TYPE_MAP[raw.locationType];
    if (!locationType) {
      throw new InfrastructureError(
        `Unknown locationType value: ${raw.locationType}`,
      );
    }

    const props: IExperienceProps = {
      id: raw.id,
      company: asLocalized(raw.company),
      position: asLocalized(raw.position),
      location: asLocalized(raw.location),
      description: asLocalized(raw.description),
      logo: {
        url: raw.logoUrl,
        alt: asLocalized(raw.logoAlt),
      },
      employment_type: raw.employmentType as EmploymentType,
      location_type: locationType,
      skills: raw.skillIds,
      start_at: raw.startAt.toISOString(),
      end_at: raw.endAt?.toISOString(),
      created_at: raw.createdAt.toISOString(),
      updated_at: raw.updatedAt.toISOString(),
    };

    const result = Experience.create(props);
    if (result.isLeft()) {
      throw new InfrastructureError(
        `Failed to map experience ${raw.id} to domain: ${result.value.message}`,
        result.value,
      );
    }

    return result.value;
  }

  static toPrisma(experience: Experience): ExperienceScalarData {
    return {
      id: experience.id.value,
      company: experience.company.value,
      position: experience.position.value,
      location: experience.location.value,
      description: experience.description.value,
      logoUrl: experience.logo.url.value,
      logoAlt: experience.logo.alt.value,
      employmentType: experience.employment_type,
      locationType: LOCATION_TYPE_REVERSE_MAP[
        experience.location_type
      ] as never,
      skillIds: experience.skills.map((id) => id.value),
      startAt: new Date(experience.period.startAt.value),
      endAt: experience.period.endAt
        ? new Date(experience.period.endAt.value)
        : null,
      createdAt: new Date(experience.created_at.value),
      updatedAt: new Date(experience.updated_at.value),
    };
  }
}
