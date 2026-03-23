import { Prisma } from '@prisma/client';

import {
  IExperienceProps,
  Experience,
  IExperienceSkillProps,
} from '@repo/core/portfolio';
import { ILocalizedTextInput, LocationTypeValue } from '@repo/core/shared';

import { InfrastructureError } from '../../errors/InfrastructureError';

type PrismaExperienceWithSkills = Prisma.ExperienceGetPayload<{
  include: { skills: { include: { skill: true } } };
}>;

type ExperienceScalarData = Omit<Prisma.ExperienceUncheckedCreateInput, 'skills'>;

const LOCATION_TYPE_MAP: Record<string, LocationTypeValue> = {
  ONSITE: 'ON-SITE',
  HYBRID: 'HYBRID',
  REMOTE: 'REMOTE',
};

const LOCATION_TYPE_REVERSE_MAP: Record<LocationTypeValue, string> = {
  'ON-SITE': 'ONSITE',
  HYBRID: 'HYBRID',
  REMOTE: 'REMOTE',
};

export class ExperienceMapper {
  static toDomain(raw: PrismaExperienceWithSkills): Experience {
    const asLocalized = (v: unknown) => v as ILocalizedTextInput;

    const locationType = LOCATION_TYPE_MAP[raw.locationType];
    if (!locationType) {
      throw new InfrastructureError(
        `Unknown locationType value: ${raw.locationType}`,
      );
    }

    const skillProps: IExperienceSkillProps[] = raw.skills.map((es) => ({
      skill: {
        id: es.skill.id,
        description: es.skill.description as string,
        icon: es.skill.icon,
        type: es.skill.type,
        created_at: es.skill.createdAt.toISOString(),
        updated_at: es.skill.updatedAt.toISOString(),
      },
      workDescription: asLocalized(es.workDescription),
    }));

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
      employment_type: raw.employmentType,
      location_type: locationType,
      skills: skillProps,
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
      employmentType: experience.employment_type.value,
      locationType: LOCATION_TYPE_REVERSE_MAP[experience.location_type.value] as never,
      startAt: new Date(experience.period.startAt.value),
      endAt: experience.period.endAt
        ? new Date(experience.period.endAt.value)
        : null,
      createdAt: new Date(experience.created_at.value),
      updatedAt: new Date(experience.updated_at.value),
    };
  }
}
