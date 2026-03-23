import { EmploymentType, LocationType, Prisma } from '@prisma/client';

type PrismaSkillOnExperience = {
  experienceId: string;
  skillId: string;
  workDescription: Prisma.JsonValue;
  skill: {
    id: string;
    description: Prisma.JsonValue;
    icon: string;
    type: import('@prisma/client').SkillType;
    createdAt: Date;
    updatedAt: Date;
  };
};

export type PrismaExperienceWithSkills = {
  id: string;
  company: Prisma.JsonValue;
  position: Prisma.JsonValue;
  location: Prisma.JsonValue;
  description: Prisma.JsonValue;
  logoUrl: string;
  logoAlt: Prisma.JsonValue;
  employmentType: EmploymentType;
  locationType: LocationType;
  startAt: Date;
  endAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  skills: PrismaSkillOnExperience[];
};

export function buildPrismaExperience(
  overrides?: Partial<PrismaExperienceWithSkills>,
): PrismaExperienceWithSkills {
  const id = overrides?.id ?? crypto.randomUUID();
  const skillId = crypto.randomUUID();

  return {
    id,
    company: { 'pt-BR': 'Empresa Teste' },
    position: { 'pt-BR': 'Desenvolvedor' },
    location: { 'pt-BR': 'São Paulo, SP' },
    description: { 'pt-BR': 'Descrição da experiência.' },
    logoUrl: 'https://example.com/logo.png',
    logoAlt: { 'pt-BR': 'Logo da empresa' },
    employmentType: 'FULL_TIME',
    locationType: 'REMOTE',
    startAt: new Date('2023-01-01T00:00:00.000Z'),
    endAt: null,
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
    updatedAt: new Date('2023-01-01T00:00:00.000Z'),
    skills: [
      {
        experienceId: id,
        skillId,
        workDescription: { 'pt-BR': 'Desenvolvimento de features' },
        skill: {
          id: skillId,
          description: 'TypeScript',
          icon: 'code',
          type: 'TECHNOLOGY',
          createdAt: new Date('2023-01-01T00:00:00.000Z'),
          updatedAt: new Date('2023-01-01T00:00:00.000Z'),
        },
      },
    ],
    ...overrides,
  };
}
