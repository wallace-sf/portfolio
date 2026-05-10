import { PrismaClient } from '@prisma/client';
import {
  IProfessionalValueRepository,
  ProfessionalValue,
} from '@repo/core/portfolio';
import { Id } from '@repo/core/shared';

import { InfrastructureError } from '../../errors/InfrastructureError';
import { ProfessionalValueMapper } from './ProfessionalValueMapper';

export class PrismaProfessionalValueRepository
  implements IProfessionalValueRepository
{
  constructor(private readonly db: PrismaClient) {}

  async findAll(): Promise<ProfessionalValue[]> {
    const rows = await this.db.professionalValue.findMany({
      orderBy: { order: 'asc' },
    });
    return rows.map(ProfessionalValueMapper.toDomain);
  }

  async findById(id: Id): Promise<ProfessionalValue | null> {
    const row = await this.db.professionalValue.findUnique({
      where: { id: id.value },
    });
    return row ? ProfessionalValueMapper.toDomain(row) : null;
  }

  async save(value: ProfessionalValue): Promise<void> {
    const existing = await this.db.professionalValue.findUnique({
      where: { id: value.id.value },
      select: { order: true },
    });
    const order = existing?.order ?? 0;
    const data = ProfessionalValueMapper.toPrisma(value, order);

    await this.db.professionalValue.upsert({
      where: { id: data.id as string },
      create: data,
      update: data,
    });
  }

  async delete(id: Id): Promise<void> {
    const existing = await this.db.professionalValue.findUnique({
      where: { id: id.value },
      select: { id: true },
    });

    if (!existing) {
      throw new InfrastructureError(`ProfessionalValue not found: ${id.value}`);
    }

    await this.db.professionalValue.delete({ where: { id: id.value } });
  }
}
