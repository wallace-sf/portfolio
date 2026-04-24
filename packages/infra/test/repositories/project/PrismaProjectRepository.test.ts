import { PrismaClient } from '@prisma/client';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { ProjectStatus } from '@repo/core/portfolio';
import { Id, Slug } from '@repo/core/shared';

import { InfrastructureError } from '../../../src/errors/InfrastructureError';
import { ProjectMapper } from '../../../src/repositories/project/ProjectMapper';
import { PrismaProjectRepository } from '../../../src/repositories/project/PrismaProjectRepository';
import { buildPrismaProject } from '../../factories/prisma-project.factory';

// Use DIRECT_URL to bypass PgBouncer — prepared statements don't work with the pooler
const db = new PrismaClient({
  datasourceUrl: process.env.DIRECT_URL,
});
const repo = new PrismaProjectRepository(db);

const TEST_SLUG_PREFIX = 'test-';

async function seedProject(overrides?: Partial<ReturnType<typeof buildPrismaProject>>) {
  const raw = buildPrismaProject({
    slug: `${TEST_SLUG_PREFIX}${crypto.randomUUID()}`,
    ...overrides,
  });

  await db.project.create({
    data: {
      id: raw.id,
      slug: raw.slug,
      coverImageUrl: raw.coverImageUrl,
      coverImageAlt: raw.coverImageAlt,
      title: raw.title,
      caption: raw.caption,
      content: raw.content,
      theme: raw.theme ?? undefined,
      summary: raw.summary ?? undefined,
      objectives: raw.objectives ?? undefined,
      role: raw.role ?? undefined,
      periodStart: raw.periodStart,
      periodEnd: raw.periodEnd,
      featured: raw.featured,
      status: raw.status,
      relatedProjectSlugs: raw.relatedProjectSlugs,
      skillIds: raw.skillIds,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
    },
  });

  return raw;
}

beforeAll(async () => {
  await db.$connect();
});

afterAll(async () => {
  await db.project.deleteMany({ where: { slug: { startsWith: TEST_SLUG_PREFIX } } });
  await db.$disconnect();
});

afterEach(async () => {
  await db.project.deleteMany({ where: { slug: { startsWith: TEST_SLUG_PREFIX } } });
});

describe('PrismaProjectRepository', () => {
  describe('findAll', () => {
    it('should return all non-deleted projects', async () => {
      await seedProject({ status: 'DRAFT' });
      await seedProject({ status: 'PUBLISHED' });
      await seedProject({ deletedAt: new Date() });

      const projects = await repo.findAll();
      const slugs = projects.map((p) => p.slug.value);
      const testSlugs = slugs.filter((s) => s.startsWith(TEST_SLUG_PREFIX));

      expect(testSlugs).toHaveLength(2);
    });

    it('should not include soft-deleted projects', async () => {
      const deleted = await seedProject({ deletedAt: new Date() });

      const projects = await repo.findAll();
      const found = projects.find((p) => p.slug.value === deleted.slug);

      expect(found).toBeUndefined();
    });
  });

  describe('findPublished', () => {
    it('should return only published projects', async () => {
      const published = await seedProject({ status: 'PUBLISHED' });
      await seedProject({ status: 'DRAFT' });

      const projects = await repo.findPublished();
      const testProjects = projects.filter((p) => p.slug.value.startsWith(TEST_SLUG_PREFIX));

      expect(testProjects).toHaveLength(1);
      expect(testProjects[0]!.slug.value).toBe(published.slug);
      expect(testProjects[0]!.status).toBe(ProjectStatus.PUBLISHED);
    });
  });

  describe('findFeatured', () => {
    it('should return only featured published projects', async () => {
      const featured = await seedProject({ status: 'PUBLISHED', featured: true });
      await seedProject({ status: 'PUBLISHED', featured: false });
      await seedProject({ status: 'DRAFT', featured: true });

      const projects = await repo.findFeatured();
      const testProjects = projects.filter((p) => p.slug.value.startsWith(TEST_SLUG_PREFIX));

      expect(testProjects).toHaveLength(1);
      expect(testProjects[0]!.slug.value).toBe(featured.slug);
      expect(testProjects[0]!.featured).toBe(true);
    });
  });

  describe('findById', () => {
    it('should return the project when found', async () => {
      const seeded = await seedProject();

      const idResult = Id.create(seeded.id);
      if (idResult.isLeft()) throw idResult.value;

      const project = await repo.findById(idResult.value);

      expect(project).not.toBeNull();
      expect(project!.id.value).toBe(seeded.id);
    });

    it('should return null when not found', async () => {
      const idResult = Id.create(crypto.randomUUID());
      if (idResult.isLeft()) throw idResult.value;

      const project = await repo.findById(idResult.value);

      expect(project).toBeNull();
    });
  });

  describe('findBySlug', () => {
    it('should return the project when found', async () => {
      const seeded = await seedProject();

      const slugResult = Slug.create(seeded.slug);
      if (slugResult.isLeft()) throw slugResult.value;

      const project = await repo.findBySlug(slugResult.value);

      expect(project).not.toBeNull();
      expect(project!.slug.value).toBe(seeded.slug);
    });

    it('should return null when slug does not exist', async () => {
      const slugResult = Slug.create('test-nonexistent-slug');
      if (slugResult.isLeft()) throw slugResult.value;

      const project = await repo.findBySlug(slugResult.value);

      expect(project).toBeNull();
    });
  });

  describe('findRelated', () => {
    it('should return related published projects by slug', async () => {
      const related = await seedProject({ status: 'PUBLISHED' });
      const main = await seedProject({ relatedProjectSlugs: [related.slug] });

      const idResult = Id.create(main.id);
      if (idResult.isLeft()) throw idResult.value;

      const projects = await repo.findRelated(idResult.value);

      expect(projects).toHaveLength(1);
      expect(projects[0]!.slug.value).toBe(related.slug);
    });

    it('should return empty array when project has no related slugs', async () => {
      const seeded = await seedProject({ relatedProjectSlugs: [] });

      const idResult = Id.create(seeded.id);
      if (idResult.isLeft()) throw idResult.value;

      const projects = await repo.findRelated(idResult.value);

      expect(projects).toHaveLength(0);
    });
  });

  describe('save', () => {
    it('should persist a new project and retrieve it', async () => {
      const raw = buildPrismaProject({
        slug: `${TEST_SLUG_PREFIX}${crypto.randomUUID()}`,
        skillIds: [crypto.randomUUID(), crypto.randomUUID()],
      });
      const project = ProjectMapper.toDomain(raw);

      await repo.save(project);

      const slugResult = Slug.create(raw.slug);
      if (slugResult.isLeft()) throw slugResult.value;
      const found = await repo.findBySlug(slugResult.value);

      expect(found).not.toBeNull();
      expect(found!.slug.value).toBe(raw.slug);
      expect(found!.skills).toHaveLength(2);
    });

    it('should update an existing project on upsert', async () => {
      const seeded = await seedProject({ status: 'DRAFT' });

      const slugResult = Slug.create(seeded.slug);
      if (slugResult.isLeft()) throw slugResult.value;

      const updatedRaw = buildPrismaProject({ ...seeded, status: 'PUBLISHED' });
      const updatedProject = ProjectMapper.toDomain(updatedRaw);

      await repo.save(updatedProject);

      const found = await repo.findBySlug(slugResult.value);
      expect(found!.status).toBe(ProjectStatus.PUBLISHED);
    });
  });

  describe('delete', () => {
    it('should soft-delete a project', async () => {
      const seeded = await seedProject();

      const idResult = Id.create(seeded.id);
      if (idResult.isLeft()) throw idResult.value;

      await repo.delete(idResult.value);

      const project = await repo.findById(idResult.value);
      expect(project).toBeNull();
    });

    it('should throw InfrastructureError when project does not exist', async () => {
      const idResult = Id.create(crypto.randomUUID());
      if (idResult.isLeft()) throw idResult.value;

      await expect(repo.delete(idResult.value)).rejects.toThrow(InfrastructureError);
    });
  });
});
