import { DomainError, Either, Locale, left, right } from '@repo/core/shared';
import { IProjectRepository, Project } from '@repo/core/portfolio';

import { UseCase } from '../../shared/UseCase';
import { ProjectSummaryDTO } from '../dtos/ProjectSummaryDTO';

export interface GetPublishedProjectsInput {
  locale: Locale;
}

export class GetPublishedProjects extends UseCase<GetPublishedProjectsInput, ProjectSummaryDTO[]> {
  constructor(private readonly projectRepository: IProjectRepository) {
    super();
  }

  async execute(
    input: GetPublishedProjectsInput,
  ): Promise<Either<DomainError, ProjectSummaryDTO[]>> {
    try {
      const projects = await this.projectRepository.findPublished();
      const sorted = [...projects].sort((a, b) => b.period.startAt.ms - a.period.startAt.ms);
      return right(sorted.map((p) => this.toDTO(p, input.locale)));
    } catch {
      return left(
        new DomainError('FETCH_FAILED', {
          message: 'Failed to fetch published projects',
        }),
      );
    }
  }

  private toDTO(project: Project, locale: Locale): ProjectSummaryDTO {
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
      skills: project.skills.map((id) => id.value),
      publishedAt: project.period.startAt.value,
    };
  }
}
