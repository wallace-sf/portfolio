import {
  IProjectRepository,
  ISkillRepository,
  Project,
} from '@repo/core/portfolio';
import {
  DomainError,
  Either,
  Locale,
  NotFoundError,
  Slug,
  ValidationError,
  left,
  right,
} from '@repo/core/shared';

import { UseCase } from '../../shared/UseCase';
import { ProjectDetailDTO } from '../dtos/ProjectDetailDTO';
import { ProjectSummaryDTO, SkillSummary } from '../dtos/ProjectSummaryDTO';

export type GetProjectBySlugInput = {
  slug: string;
  locale: Locale;
};

export class GetProjectBySlug extends UseCase<
  GetProjectBySlugInput,
  ProjectDetailDTO,
  NotFoundError | ValidationError | DomainError
> {
  constructor(
    private readonly projectRepository: IProjectRepository,
    private readonly skillRepository: ISkillRepository,
  ) {
    super();
  }

  async execute(
    input: GetProjectBySlugInput,
  ): Promise<
    Either<NotFoundError | ValidationError | DomainError, ProjectDetailDTO>
  > {
    const slugResult = Slug.create(input.slug);
    if (slugResult.isLeft()) return left(slugResult.value);

    let project: Project | null;
    try {
      project = await this.projectRepository.findBySlug(slugResult.value);
    } catch {
      return left(
        new DomainError('FETCH_FAILED', { message: 'Failed to fetch project' }),
      );
    }

    if (!project) {
      return left(new NotFoundError({ slug: input.slug }));
    }

    let relatedProjects: Project[];
    try {
      relatedProjects = await this.projectRepository.findRelated(project.id, 3);
    } catch {
      relatedProjects = [];
    }

    const allProjects = [project, ...relatedProjects];
    const allIds = [
      ...new Set(allProjects.flatMap((p) => p.skills.map((s) => s.value))),
    ];
    const skillNames = await this.skillRepository.findNamesByIds(
      allIds,
      input.locale,
    );

    const relatedDTOs = relatedProjects.map((p) =>
      this.toSummaryDTO(p, input.locale, skillNames),
    );
    return right(
      this.toDetailDTO(project, input.locale, relatedDTOs, skillNames),
    );
  }

  private toDetailDTO(
    project: Project,
    locale: Locale,
    relatedProjects: ProjectSummaryDTO[],
    skillNames: Map<string, SkillSummary>,
  ): ProjectDetailDTO {
    return {
      id: project.id.value,
      slug: project.slug.value,
      title: project.title.get(locale),
      caption: project.caption.get(locale),
      coverImage: {
        url: project.coverImage.url.value,
        alt: project.coverImage.alt.get(locale),
      },
      thumbnailImage: {
        url: project.thumbnailImage.url.value,
        alt: project.thumbnailImage.alt.get(locale),
      },
      theme: project.theme?.get(locale),
      skills: project.skills.map(
        (id) => skillNames.get(id.value) ?? { name: id.value, icon: '' },
      ),
      publishedAt: project.period.startAt.value,
      content: project.content.get(locale),
      summary: project.summary?.get(locale),
      objectives: project.objectives?.get(locale),
      role: project.role?.get(locale),
      period: {
        startAt: project.period.startAt.value,
        endAt: project.period.endAt?.value,
      },
      relatedProjects,
    };
  }

  private toSummaryDTO(
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
      thumbnailImage: {
        url: project.thumbnailImage.url.value,
        alt: project.thumbnailImage.alt.get(locale),
      },
      theme: project.theme?.get(locale),
      skills: project.skills.map(
        (id) => skillNames.get(id.value) ?? { name: id.value, icon: '' },
      ),
      publishedAt: project.period.startAt.value,
    };
  }
}
