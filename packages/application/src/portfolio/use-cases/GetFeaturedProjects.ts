import { DomainError, Either, Locale, left, right } from '@repo/core/shared';
import { IProjectRepository, Project } from '@repo/core/portfolio';

import { UseCase } from '../../shared/UseCase';
import { ProjectSummaryDTO } from '../dtos/ProjectSummaryDTO';

export interface GetFeaturedProjectsInput {
  locale: Locale;
}

export class GetFeaturedProjects extends UseCase<GetFeaturedProjectsInput, ProjectSummaryDTO[]> {
  constructor(private readonly projectRepository: IProjectRepository) {
    super();
  }

  async execute(
    input: GetFeaturedProjectsInput,
  ): Promise<Either<DomainError, ProjectSummaryDTO[]>> {
    try {
      const projects = await this.projectRepository.findFeatured();
      return right(projects.map((p) => this.toDTO(p, input.locale)));
    } catch {
      return left(
        new DomainError('FETCH_FAILED', {
          message: 'Failed to fetch featured projects',
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
      skills: project.skills.map((s) => s.description.value),
      publishedAt: project.period.startAt.value,
    };
  }
}
