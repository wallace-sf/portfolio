import { Prisma } from '@prisma/client';
import { describe, expect, it } from 'vitest';

import { ProjectStatus } from '@repo/core/portfolio';
import { Id } from '@repo/core/shared';

import { InfrastructureError } from '../../../src/errors/InfrastructureError';
import { ProjectMapper } from '../../../src/repositories/project/ProjectMapper';
import { buildPrismaProject } from '../../factories/prisma-project.factory';

describe('ProjectMapper', () => {
  describe('toDomain', () => {
    it('should map a minimal prisma row to a domain Project', () => {
      const raw = buildPrismaProject();

      const project = ProjectMapper.toDomain(raw);

      expect(project.id.value).toBe(raw.id);
      expect(project.slug.value).toBe(raw.slug);
      expect(project.coverImage.url.value).toBe(raw.coverImageUrl);
      expect(project.title.value).toEqual(raw.title);
      expect(project.caption.value).toEqual(raw.caption);
      expect(project.content.value).toBe(raw.content);
      expect(project.featured).toBe(raw.featured);
      expect(project.status).toBe(ProjectStatus.DRAFT);
      expect(project.relatedProjects).toHaveLength(0);
      expect(project.skills).toHaveLength(1);
    });

    it('should map optional fields when present', () => {
      const raw = buildPrismaProject({
        theme: { 'en-US': 'dark', 'pt-BR': 'escuro' },
        summary: { 'en-US': 'Summary', 'pt-BR': 'Resumo' },
        objectives: { 'en-US': 'Objectives', 'pt-BR': 'Objetivos' },
        role: { 'en-US': 'Developer', 'pt-BR': 'Desenvolvedor' },
        periodEnd: new Date('2024-12-31T00:00:00.000Z'),
        relatedProjectSlugs: ['other-project'],
      });

      const project = ProjectMapper.toDomain(raw);

      expect(project.theme?.get('en-US')).toBe('dark');
      expect(project.summary?.get('en-US')).toBe('Summary');
      expect(project.objectives?.get('en-US')).toBe('Objectives');
      expect(project.role?.get('en-US')).toBe('Developer');
      expect(project.period.endAt?.value).toBe('2024-12-31T00:00:00.000Z');
      expect(project.relatedProjects).toHaveLength(1);
      expect(project.relatedProjects[0]!.value).toBe('other-project');
    });

    it('should map multiple skill IDs to Id VOs', () => {
      const skillId1 = crypto.randomUUID();
      const skillId2 = crypto.randomUUID();
      const raw = buildPrismaProject({ skillIds: [skillId1, skillId2] });

      const project = ProjectMapper.toDomain(raw);

      expect(project.skills).toHaveLength(2);
      expect(project.skills[0]).toBeInstanceOf(Id);
      expect(project.skills[0]!.value).toBe(skillId1);
      expect(project.skills[1]!.value).toBe(skillId2);
    });

    it('should map a PUBLISHED project status', () => {
      const raw = buildPrismaProject({ status: 'PUBLISHED' });

      const project = ProjectMapper.toDomain(raw);

      expect(project.status).toBe(ProjectStatus.PUBLISHED);
    });

    it('should set theme, summary, objectives, role to undefined when null in DB', () => {
      const raw = buildPrismaProject({
        theme: null,
        summary: null,
        objectives: null,
        role: null,
      });

      const project = ProjectMapper.toDomain(raw);

      expect(project.theme).toBeUndefined();
      expect(project.summary).toBeUndefined();
      expect(project.objectives).toBeUndefined();
      expect(project.role).toBeUndefined();
    });

    it('should throw InfrastructureError when raw data produces an invalid domain object', () => {
      const raw = buildPrismaProject({ slug: '' });

      expect(() => ProjectMapper.toDomain(raw)).toThrow(InfrastructureError);
    });
  });

  describe('toPrisma', () => {
    it('should map a domain Project to prisma scalar data', () => {
      const raw = buildPrismaProject({
        id: crypto.randomUUID(),
        status: 'PUBLISHED',
        featured: true,
      });
      const project = ProjectMapper.toDomain(raw);

      const data = ProjectMapper.toPrisma(project);

      expect(data.id).toBe(raw.id);
      expect(data.slug).toBe(raw.slug);
      expect(data.coverImageUrl).toBe(raw.coverImageUrl);
      expect(data.featured).toBe(true);
      expect(data.status).toBe('PUBLISHED');
    });

    it('should set optional json fields to Prisma.JsonNull when absent', () => {
      const raw = buildPrismaProject({
        theme: null,
        summary: null,
        objectives: null,
        role: null,
      });
      const project = ProjectMapper.toDomain(raw);

      const data = ProjectMapper.toPrisma(project);

      expect(data.theme).toBe(Prisma.JsonNull);
      expect(data.summary).toBe(Prisma.JsonNull);
      expect(data.objectives).toBe(Prisma.JsonNull);
      expect(data.role).toBe(Prisma.JsonNull);
    });

    it('should include optional json fields when present', () => {
      const raw = buildPrismaProject({
        theme: { 'en-US': 'dark' },
        summary: { 'en-US': 'Summary' },
      });
      const project = ProjectMapper.toDomain(raw);

      const data = ProjectMapper.toPrisma(project);

      expect(data.theme).toEqual({ 'en-US': 'dark' });
      expect(data.summary).toEqual({ 'en-US': 'Summary' });
    });

    it('should set periodEnd to null when project has no end date', () => {
      const raw = buildPrismaProject({ periodEnd: null });
      const project = ProjectMapper.toDomain(raw);

      const data = ProjectMapper.toPrisma(project);

      expect(data.periodEnd).toBeNull();
    });

    it('should include periodEnd when project has an end date', () => {
      const end = new Date('2024-12-31T00:00:00.000Z');
      const raw = buildPrismaProject({ periodEnd: end });
      const project = ProjectMapper.toDomain(raw);

      const data = ProjectMapper.toPrisma(project);

      expect(data.periodEnd).toEqual(end);
    });

    it('should map relatedProjectSlugs as string array', () => {
      const raw = buildPrismaProject({ relatedProjectSlugs: ['project-a', 'project-b'] });
      const project = ProjectMapper.toDomain(raw);

      const data = ProjectMapper.toPrisma(project);

      expect(data.relatedProjectSlugs).toEqual(['project-a', 'project-b']);
    });

    it('should round-trip skillIds correctly', () => {
      const skillId1 = crypto.randomUUID();
      const skillId2 = crypto.randomUUID();
      const raw = buildPrismaProject({ skillIds: [skillId1, skillId2] });
      const project = ProjectMapper.toDomain(raw);

      const data = ProjectMapper.toPrisma(project);

      expect(data.skillIds).toEqual([skillId1, skillId2]);
    });
  });
});
