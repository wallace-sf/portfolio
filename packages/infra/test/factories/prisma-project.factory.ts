import { Prisma, ProjectStatus, SkillType } from '@prisma/client';

type PrismaSkillOnProject = {
  projectId: string;
  skillId: string;
  skill: {
    id: string;
    description: Prisma.JsonValue;
    icon: string;
    type: SkillType;
    createdAt: Date;
    updatedAt: Date;
  };
};

export type PrismaProjectWithSkills = {
  id: string;
  slug: string;
  coverImageUrl: string;
  coverImageAlt: Prisma.JsonValue;
  title: Prisma.JsonValue;
  caption: Prisma.JsonValue;
  content: string;
  theme: Prisma.JsonValue | null;
  summary: Prisma.JsonValue | null;
  objectives: Prisma.JsonValue | null;
  role: Prisma.JsonValue | null;
  periodStart: Date;
  periodEnd: Date | null;
  featured: boolean;
  status: ProjectStatus;
  relatedProjectSlugs: string[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  skills: PrismaSkillOnProject[];
};

export function buildPrismaSkill(overrides?: Partial<PrismaSkillOnProject['skill']>): PrismaSkillOnProject['skill'] {
  const id = overrides?.id ?? crypto.randomUUID();
  return {
    id,
    description: 'TypeScript development',
    icon: 'code',
    type: 'TECHNOLOGY',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    ...overrides,
  };
}

export function buildPrismaProject(overrides?: Partial<PrismaProjectWithSkills>): PrismaProjectWithSkills {
  const id = overrides?.id ?? crypto.randomUUID();
  const skill = buildPrismaSkill();

  return {
    id,
    slug: 'my-test-project',
    coverImageUrl: 'https://example.com/cover.jpg',
    coverImageAlt: { 'pt-BR': 'Capa do projeto' },
    title: { 'pt-BR': 'Meu Projeto' },
    caption: { 'pt-BR': 'Uma breve descrição' },
    content: 'Conteúdo detalhado do projeto.',
    theme: null,
    summary: null,
    objectives: null,
    role: null,
    periodStart: new Date('2024-01-01T00:00:00.000Z'),
    periodEnd: null,
    featured: false,
    status: 'DRAFT',
    relatedProjectSlugs: [],
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    deletedAt: null,
    skills: [{ projectId: id, skillId: skill.id, skill }],
    ...overrides,
  };
}
