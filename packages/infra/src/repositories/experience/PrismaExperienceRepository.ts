import { PrismaClient } from '@prisma/client';

import { IExperienceRepository, Experience } from '@repo/core/portfolio';
import { Id } from '@repo/core/shared';

import { InfrastructureError } from '../../errors/InfrastructureError';
import { ExperienceMapper } from './ExperienceMapper';

const INCLUDE = {
  skills: { include: { skill: true } },
} as const;

export class PrismaExperienceRepository implements IExperienceRepository {
  constructor(private readonly db: PrismaClient) {}

  async findAll(): Promise<Experience[]> {
    const rows = await this.db.experience.findMany({
      include: INCLUDE,
      orderBy: { startAt: 'desc' },
    });
    return rows.map(ExperienceMapper.toDomain);
  }

  async findById(id: Id): Promise<Experience | null> {
    const row = await this.db.experience.findUnique({
      where: { id: id.value },
      include: INCLUDE,
    });
    return row ? ExperienceMapper.toDomain(row) : null;
  }

  async save(experience: Experience): Promise<void> {
    const data = ExperienceMapper.toPrisma(experience);
    const { id, ...rest } = data;

    const skillsCreate = experience.skills.map((es) => ({
      skillId: es.skill.id.value,
      workDescription: es.workDescription.value,
    }));

    await this.db.experience.upsert({
      where: { id },
      create: { ...rest, id, skills: { create: skillsCreate } },
      update: {
        ...rest,
        skills: { deleteMany: {}, create: skillsCreate },
      },
    });
  }

  async delete(id: Id): Promise<void> {
    const existing = await this.db.experience.findUnique({
      where: { id: id.value },
      select: { id: true },
    });

    if (!existing) {
      throw new InfrastructureError(`Experience not found: ${id.value}`);
    }

    await this.db.experience.delete({ where: { id: id.value } });
  }
}
