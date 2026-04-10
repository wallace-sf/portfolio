import { PrismaClient } from '@prisma/client';

import { IProfileRepository, Profile } from '@repo/core/portfolio';

import { ProfileMapper } from '~/repositories/profile/ProfileMapper';

const INCLUDE = {
  stats: { orderBy: { order: 'asc' as const } },
  socialNetworks: true,
} as const;

export class PrismaProfileRepository implements IProfileRepository {
  constructor(private readonly db: PrismaClient) {}

  async find(): Promise<Profile | null> {
    const row = await this.db.profile.findFirst({ include: INCLUDE });
    return row ? ProfileMapper.toDomain(row) : null;
  }

  async save(profile: Profile): Promise<void> {
    const { stats, ...data } = ProfileMapper.toPrisma(profile);
    const { id, ...rest } = data;

    await this.db.profile.upsert({
      where: { id },
      create: {
        ...rest,
        id,
        stats: { create: stats },
      },
      update: {
        ...rest,
        stats: { deleteMany: {}, create: stats },
      },
    });
  }
}
