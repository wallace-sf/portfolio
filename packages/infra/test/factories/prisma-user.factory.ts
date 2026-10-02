import { Prisma, Role, User as PrismaUser } from '@prisma/client';

export type PrismaUserData = Omit<PrismaUser, never>;

export function buildPrismaUser(
  overrides?: Partial<PrismaUserData>,
): PrismaUserData {
  const id = overrides?.id ?? crypto.randomUUID();

  return {
    id,
    name: 'Test User',
    email: `test-${id}@example.com`,
    role: Role.VISITOR,
    authSubject: null,
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    ...overrides,
  };
}

/** A factory row as a `create`/`createMany` input. */
export function buildPrismaUserCreateInput(
  overrides?: Partial<PrismaUserData>,
): Prisma.UserCreateManyInput & Pick<PrismaUserData, 'id' | 'email'> {
  return buildPrismaUser(overrides);
}
