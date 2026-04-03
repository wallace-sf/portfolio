import { PrismaClient } from '@prisma/client';

import { IUserRepository, User } from '@repo/core/identity';
import {
  Email,
  Id,
  left,
  NotFoundError,
  right,
  ValidationError,
} from '@repo/core/shared';

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

  async findByAuthSubject(authSubject: string): Promise<User | null> {
    const row = await this.db.user.findUnique({
      where: { authSubject },
    });
    return row ? UserMapper.toDomain(row) : null;
  }

  async linkAuthSubject(
    userId: Id,
    authSubject: string,
  ): ReturnType<IUserRepository['linkAuthSubject']> {
    const idResult = Id.create(authSubject);
    if (idResult.isLeft())
      return left(
        new ValidationError({
          code: User.ERROR_CODE,
          message: idResult.value.message,
        }),
      );

    const row = await this.db.user.findUnique({ where: { id: userId.value } });
    if (!row) return left(new NotFoundError({ entity: 'User', id: userId.value }));

    const other = await this.db.user.findFirst({
      where: { authSubject, NOT: { id: userId.value } },
    });
    if (other)
      return left(
        new ValidationError({
          code: User.ERROR_CODE,
          message: 'Auth subject is already linked to another user.',
        }),
      );

    await this.db.user.update({
      where: { id: userId.value },
      data: { authSubject },
    });

    return right(undefined);
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
