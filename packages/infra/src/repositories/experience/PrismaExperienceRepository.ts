import { PrismaClient } from "@prisma/client";
import { IExperienceRepository, Experience } from "@repo/core/portfolio";
import { Id } from "@repo/core/shared";

import { InfrastructureError } from "~/errors/InfrastructureError";
import { ExperienceMapper } from "~/repositories/experience/ExperienceMapper";

export class PrismaExperienceRepository implements IExperienceRepository {
  constructor(private readonly db: PrismaClient) {}

  async findAll(): Promise<Experience[]> {
    const rows = await this.db.experience.findMany({
      orderBy: { startAt: "desc" },
    });
    return rows.map(ExperienceMapper.toDomain);
  }

  async findById(id: Id): Promise<Experience | null> {
    const row = await this.db.experience.findUnique({
      where: { id: id.value },
    });
    return row ? ExperienceMapper.toDomain(row) : null;
  }

  async save(experience: Experience): Promise<void> {
    const data = ExperienceMapper.toPrisma(experience);

    await this.db.experience.upsert({
      where: { id: data.id as string },
      create: data,
      update: data,
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
