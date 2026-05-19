import {
  IProjectRepository,
  ISkillRepository,
  Project,
} from '@repo/core/portfolio';
import { DomainError, Either, Locale, left, right } from '@repo/core/shared';

import { UseCase } from '../../shared/UseCase';
import { ProjectSummaryDTO, SkillSummary } from '../dtos/ProjectSummaryDTO';

export type GetPublishedProjectsInput = {
  locale: Locale;
};

export class GetPublishedProjects extends UseCase<
  GetPublishedProjectsInput,
  ProjectSummaryDTO[]
> {
  constructor(
    private readonly projectRepository: IProjectRepository,
    private readonly skillRepository: ISkillRepository,
  ) {
    super();
  }

  async execute(
    input: GetPublishedProjectsInput,
  ): Promise<Either<DomainError, ProjectSummaryDTO[]>> {
    try {
      const projects = await this.projectRepository.findPublished();
      const sorted = [...projects].sort(
        (a, b) => b.period.startAt.ms - a.period.startAt.ms,
      );
      const allIds = [
        ...new Set(sorted.flatMap((p) => p.skills.map((s) => s.value))),
      ];
      const skillNames = await this.skillRepository.findNamesByIds(
        allIds,
        input.locale,
      );
      return right(sorted.map((p) => this.toDTO(p, input.locale, skillNames)));
    } catch {
      return left(
        new DomainError('FETCH_FAILED', {
          message: 'Failed to fetch published projects',
        }),
      );
    }
  }

  private toDTO(
    project: Project,
    locale: Locale,
    skillNames: Map<string, SkillSummary>,
  ): ProjectSummaryDTO {
    return {
      id: project.id.value,
      slug: project.slug.value,
      title: project.title.get(locale),
      caption: project.caption.get(locale),
      coverImage: {
        url: project.coverImage.url.value,
        alt: project.coverImage.alt.get(locale),
      },
      theme: project.theme?.get(locale),
      skills: project.skills.map(
        (id) => skillNames.get(id.value) ?? { name: id.value, icon: '' },
      ),
      publishedAt: project.period.startAt.value,
    };
  }
}
