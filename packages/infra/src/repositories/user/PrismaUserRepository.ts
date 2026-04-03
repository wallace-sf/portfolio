import { PrismaClient } from '@prisma/client';

import { IUserRepository, User } from '@repo/core/identity';
import { Email, Id } from '@repo/core/shared';

import { UserMapper } from './UserMapper';

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly db: PrismaClient) {}

  async findById(id: Id): Promise<User | null> {
    const row = await this.db.user.findUnique({ where: { id: id.value } });
    return row ? UserMapper.toDomain(row) : null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const row = await this.db.user.findUnique({
      where: { email: email.value },
    });
    return row ? UserMapper.toDomain(row) : null;
  }

  async save(user: User): Promise<void> {
    const { id, ...rest } = UserMapper.toPrisma(user);
    await this.db.user.upsert({
      where: { id },
      create: { id, ...rest },
      update: rest,
    });
  }
}
