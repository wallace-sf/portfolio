import { Prisma } from '@prisma/client';

import { IProjectProps, Project, ProjectStatus } from '@repo/core/portfolio';
import { ILocalizedTextInput } from '@repo/core/shared';

import { InfrastructureError } from '../../errors/InfrastructureError';

type PrismaProject = Prisma.ProjectGetPayload<Record<string, never>>;

type ProjectScalarData = Prisma.ProjectUncheckedCreateInput;

export class ProjectMapper {
  static toDomain(raw: PrismaProject): Project {
    const asLocalized = (v: unknown) => v as ILocalizedTextInput;

    const props: IProjectProps = {
      id: raw.id,
      slug: raw.slug,
      coverImage: {
        url: raw.coverImageUrl,
        alt: asLocalized(raw.coverImageAlt),
      },
      title: asLocalized(raw.title),
      caption: asLocalized(raw.caption),
      content: raw.content,
      theme: raw.theme ? asLocalized(raw.theme) : undefined,
      summary: raw.summary ? asLocalized(raw.summary) : undefined,
      objectives: raw.objectives ? asLocalized(raw.objectives) : undefined,
      role: raw.role ? asLocalized(raw.role) : undefined,
      period: {
        start: raw.periodStart.toISOString(),
        end: raw.periodEnd?.toISOString(),
      },
      featured: raw.featured,
      status: raw.status as ProjectStatus,
      relatedProjects: raw.relatedProjectSlugs,
      skills: raw.skillIds,
      created_at: raw.createdAt.toISOString(),
      updated_at: raw.updatedAt.toISOString(),
      deleted_at: raw.deletedAt?.toISOString() ?? null,
    };

    const result = Project.create(props);
    if (result.isLeft()) {
      throw new InfrastructureError(
        `Failed to map project ${raw.id} to domain: ${result.value.message}`,
        result.value,
      );
    }

    return result.value;
  }

  static toPrisma(project: Project): ProjectScalarData {
    return {
      id: project.id.value,
      slug: project.slug.value,
      coverImageUrl: project.coverImage.url.value,
      coverImageAlt: project.coverImage.alt.value,
      title: project.title.value,
      caption: project.caption.value,
      content: project.content.value,
      theme: project.theme?.value ?? Prisma.JsonNull,
      summary: project.summary?.value ?? Prisma.JsonNull,
      objectives: project.objectives?.value ?? Prisma.JsonNull,
      role: project.role?.value ?? Prisma.JsonNull,
      periodStart: new Date(project.period.startAt.value),
      periodEnd: project.period.endAt
        ? new Date(project.period.endAt.value)
        : null,
      featured: project.featured,
      status: project.status,
      relatedProjectSlugs: project.relatedProjects.map((s) => s.value),
      skillIds: project.skills.map((id) => id.value),
      createdAt: new Date(project.created_at.value),
      updatedAt: new Date(project.updated_at.value),
      deletedAt: project.deleted_at
        ? new Date(project.deleted_at.value)
        : null,
    };
  }
}
