import { Prisma, ProjectStatus } from '@prisma/client';

export type PrismaProject = {
  id: string;
  slug: string;
  coverImageUrl: string;
  coverImageAlt: Prisma.JsonValue;
  thumbnailImageUrl: string;
  thumbnailImageAlt: Prisma.JsonValue;
  title: Prisma.JsonValue;
  caption: Prisma.JsonValue;
  content: Prisma.JsonValue;
  theme: Prisma.JsonValue | null;
  summary: Prisma.JsonValue | null;
  objectives: Prisma.JsonValue | null;
  role: Prisma.JsonValue | null;
  periodStart: Date;
  periodEnd: Date | null;
  featured: boolean;
  status: ProjectStatus;
  relatedProjectSlugs: string[];
  skillIds: string[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export function buildPrismaProject(overrides?: Partial<PrismaProject>): PrismaProject {
  const id = overrides?.id ?? crypto.randomUUID();

  return {
    id,
    slug: 'my-test-project',
    coverImageUrl: 'https://example.com/cover.jpg',
    coverImageAlt: { 'en-US': 'Project cover', 'pt-BR': 'Capa do projeto' },
    thumbnailImageUrl: 'https://example.com/thumbnail.webp',
    thumbnailImageAlt: { 'en-US': 'Project thumbnail', 'pt-BR': 'Thumbnail do projeto' },
    title: { 'en-US': 'My Project', 'pt-BR': 'Meu Projeto' },
    caption: { 'en-US': 'A brief description', 'pt-BR': 'Uma breve descrição' },
    content: { 'en-US': 'Detailed project content.', 'pt-BR': 'Conteúdo detalhado do projeto.' },
    theme: null,
    summary: null,
    objectives: null,
    role: null,
    periodStart: new Date('2024-01-01T00:00:00.000Z'),
    periodEnd: null,
    featured: false,
    status: 'DRAFT',
    relatedProjectSlugs: [],
    skillIds: [crypto.randomUUID()],
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    deletedAt: null,
    ...overrides,
  };
}
