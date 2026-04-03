import { Prisma, User as PrismaUser } from '@prisma/client';

import { IUserProps, Role, User } from '@repo/core/identity';

import { InfrastructureError } from '../../errors/InfrastructureError';

type UserScalarData = Omit<Prisma.UserUncheckedCreateInput, never>;

export class UserMapper {
  static toDomain(raw: PrismaUser): User {
    const props: IUserProps = {
      id: raw.id,
      name: raw.name,
      email: raw.email,
      role: raw.role as Role,
      created_at: raw.createdAt.toISOString(),
      updated_at: raw.updatedAt.toISOString(),
    };

    const result = User.create(props);
    if (result.isLeft()) {
      throw new InfrastructureError(
        `Failed to map user ${raw.id} to domain: ${result.value.message}`,
        result.value,
      );
    }

    return result.value;
  }

  static toPrisma(user: User): UserScalarData {
    return {
      id: user.id.value,
      name: user.name.value,
      email: user.email.value,
      role: user.role,
      createdAt: new Date(user.created_at.value),
      updatedAt: new Date(user.updated_at.value),
    };
  }
}
