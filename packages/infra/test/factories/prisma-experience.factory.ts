import { EmploymentType, LocationType, Prisma } from '@prisma/client';

export type PrismaExperience = {
  id: string;
  company: Prisma.JsonValue;
  position: Prisma.JsonValue;
  location: Prisma.JsonValue;
  description: Prisma.JsonValue;
  logoUrl: string;
  logoAlt: Prisma.JsonValue;
  employmentType: EmploymentType;
  locationType: LocationType;
  skillIds: string[];
  startAt: Date;
  endAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export function buildPrismaExperience(
  overrides?: Partial<PrismaExperience>,
): PrismaExperience {
  const id = overrides?.id ?? crypto.randomUUID();

  return {
    id,
    company: { 'en-US': 'Test Company', 'pt-BR': 'Empresa Teste' },
    position: { 'en-US': 'Developer', 'pt-BR': 'Desenvolvedor' },
    location: { 'en-US': 'São Paulo, Brazil', 'pt-BR': 'São Paulo, SP' },
    description: { 'en-US': 'Experience description.', 'pt-BR': 'Descrição da experiência.' },
    logoUrl: 'https://example.com/logo.png',
    logoAlt: { 'en-US': 'Company logo', 'pt-BR': 'Logo da empresa' },
    employmentType: 'FULL_TIME',
    locationType: 'REMOTE',
    skillIds: [crypto.randomUUID()],
    startAt: new Date('2023-01-01T00:00:00.000Z'),
    endAt: null,
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
    updatedAt: new Date('2023-01-01T00:00:00.000Z'),
    ...overrides,
  };
}
