import { Experience, IExperienceRepository } from '@repo/core/portfolio';
import { DomainError, Either, Locale, left, right } from '@repo/core/shared';

import { UseCase } from '../../shared/UseCase';
import { ExperienceDTO } from '../dtos/ExperienceDTO';

export type GetExperiencesInput = {
  locale: Locale;
};

export class GetExperiences extends UseCase<
  GetExperiencesInput,
  ExperienceDTO[]
> {
  constructor(private readonly experienceRepository: IExperienceRepository) {
    super();
  }

  async execute(
    input: GetExperiencesInput,
  ): Promise<Either<DomainError, ExperienceDTO[]>> {
    try {
      const experiences = await this.experienceRepository.findAll();
      const sorted = [...experiences].sort(
        (a, b) => b.period.startAt.ms - a.period.startAt.ms,
      );
      return right(sorted.map((e) => this.toDTO(e, input.locale)));
    } catch {
      return left(
        new DomainError('FETCH_FAILED', {
          message: 'Failed to fetch experiences',
        }),
      );
    }
  }

  private toDTO(experience: Experience, locale: Locale): ExperienceDTO {
    return {
      id: experience.id.value,
      company: experience.company.get(locale),
      position: experience.position.get(locale),
      location: experience.location.get(locale),
      description: experience.description.get(locale),
      logo: {
        url: experience.logo.url.value,
        alt: experience.logo.alt.get(locale),
      },
      employmentType: experience.employment_type,
      locationType: experience.location_type,
      startAt: experience.period.startAt.value,
      endAt: experience.period.endAt?.value,
      skills: experience.skills.map((id) => id.value),
    };
  }
}
