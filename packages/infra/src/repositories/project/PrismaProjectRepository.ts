import { PrismaClient } from "@prisma/client";
import {
  IProjectRepository,
  Project,
  ProjectStatus,
} from "@repo/core/portfolio";
import { Id, Slug } from "@repo/core/shared";

import { InfrastructureError } from "~/errors/InfrastructureError";
import { ProjectMapper } from "~/repositories/project/ProjectMapper";

export class PrismaProjectRepository implements IProjectRepository {
  constructor(private readonly db: PrismaClient) {}

  async findAll(): Promise<Project[]> {
    const rows = await this.db.project.findMany({
      where: { deletedAt: null },
      orderBy: { periodStart: "desc" },
    });
    return rows.map(ProjectMapper.toDomain);
  }

  async findPublished(): Promise<Project[]> {
    const rows = await this.db.project.findMany({
      where: { status: ProjectStatus.PUBLISHED, deletedAt: null },
      orderBy: { periodStart: "desc" },
    });
    return rows.map(ProjectMapper.toDomain);
  }

  async findFeatured(): Promise<Project[]> {
    const rows = await this.db.project.findMany({
      where: {
        featured: true,
        status: ProjectStatus.PUBLISHED,
        deletedAt: null,
      },
      orderBy: { periodStart: "desc" },
    });
    return rows.map(ProjectMapper.toDomain);
  }

  async findById(id: Id): Promise<Project | null> {
    const row = await this.db.project.findFirst({
      where: { id: id.value, deletedAt: null },
    });
    return row ? ProjectMapper.toDomain(row) : null;
  }

  async findBySlug(slug: Slug): Promise<Project | null> {
    const row = await this.db.project.findFirst({
      where: { slug: slug.value, deletedAt: null },
    });
    return row ? ProjectMapper.toDomain(row) : null;
  }

  async findRelated(id: Id, limit = 3): Promise<Project[]> {
    const current = await this.db.project.findUnique({
      where: { id: id.value },
      select: { relatedProjectSlugs: true },
    });

    if (!current || current.relatedProjectSlugs.length === 0) return [];

    const rows = await this.db.project.findMany({
      where: {
        slug: { in: current.relatedProjectSlugs },
        id: { not: id.value },
        status: ProjectStatus.PUBLISHED,
        deletedAt: null,
      },
      take: limit,
    });

    return rows.map(ProjectMapper.toDomain);
  }

  async save(project: Project): Promise<void> {
    const data = ProjectMapper.toPrisma(project);

    await this.db.project.upsert({
      where: { id: data.id as string },
      create: data,
      update: data,
    });
  }

  async delete(id: Id): Promise<void> {
    const existing = await this.db.project.findUnique({
      where: { id: id.value },
      select: { id: true },
    });

    if (!existing) {
      throw new InfrastructureError(`Project not found: ${id.value}`);
    }

    await this.db.project.update({
      where: { id: id.value },
      data: { deletedAt: new Date() },
    });
  }
}
