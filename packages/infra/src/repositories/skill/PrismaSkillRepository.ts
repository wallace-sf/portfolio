import { PrismaClient } from '@prisma/client';
import { ISkillRepository } from '@repo/core/portfolio';
import { Locale } from '@repo/core/shared';

export class PrismaSkillRepository implements ISkillRepository {
  constructor(private readonly db: PrismaClient) {}

  async findNamesByIds(
    ids: string[],
    locale: Locale,
  ): Promise<Map<string, string>> {
    if (ids.length === 0) return new Map();
    const rows = await this.db.skill.findMany({ where: { id: { in: ids } } });
    return new Map(
      rows.map((row) => {
        const desc = row.description as Record<string, string>;
        return [row.id, desc[locale] ?? desc['en-US'] ?? row.id];
      }),
    );
  }
}
