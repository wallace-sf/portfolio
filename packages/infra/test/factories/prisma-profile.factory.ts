import { Prisma } from '@prisma/client';

type PrismaProfileStat = {
  id: string;
  profileId: string;
  label: Prisma.JsonValue;
  value: string;
  icon: string;
  order: number;
};

type PrismaProfileSocialNetwork = {
  id: string;
  profileId: string;
  name: string;
  url: string;
  icon: string;
};

export type PrismaProfileWithRelations = {
  id: string;
  name: string;
  headline: Prisma.JsonValue;
  bio: Prisma.JsonValue;
  photoUrl: string;
  photoAlt: Prisma.JsonValue;
  featuredProjectSlugs: string[];
  createdAt: Date;
  updatedAt: Date;
  stats: PrismaProfileStat[];
  socialNetworks: PrismaProfileSocialNetwork[];
};

export function buildPrismaProfile(
  overrides?: Partial<PrismaProfileWithRelations>,
): PrismaProfileWithRelations {
  const id = overrides?.id ?? crypto.randomUUID();

  return {
    id,
    name: 'Wallace Ferreira',
    headline: {
      'en-US': 'Full-Stack Developer',
      'pt-BR': 'Desenvolvedor Full-Stack',
    },
    bio: {
      'en-US': 'Passionate about technology and best practices.',
      'pt-BR': 'Apaixonado por tecnologia e boas práticas.',
    },
    photoUrl: 'https://example.com/photo.jpg',
    photoAlt: {
      'en-US': "Wallace's photo",
      'pt-BR': 'Foto de Wallace',
    },
    featuredProjectSlugs: ['project-a', 'project-b'],
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    stats: [
      {
        id: crypto.randomUUID(),
        profileId: id,
        label: { 'en-US': 'Projects', 'pt-BR': 'Projetos' },
        value: '10+',
        icon: 'folder',
        order: 0,
      },
      {
        id: crypto.randomUUID(),
        profileId: id,
        label: {
          'en-US': 'Years of experience',
          'pt-BR': 'Anos de experiência',
        },
        value: '5+',
        icon: 'clock',
        order: 1,
      },
    ],
    socialNetworks: [
      {
        id: crypto.randomUUID(),
        profileId: id,
        name: 'GitHub',
        url: 'https://github.com/wallace-sf',
        icon: 'github',
      },
    ],
    ...overrides,
  };
}
