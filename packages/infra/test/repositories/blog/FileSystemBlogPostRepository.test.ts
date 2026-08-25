import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { Slug } from '@repo/core/shared';

import { InfrastructureError } from '../../../src/errors/InfrastructureError';
import { FileSystemBlogPostRepository } from '../../../src/repositories/blog/FileSystemBlogPostRepository';

const FIXTURES_DIR = path.join(__dirname, '../../fixtures');

function unwrapSlug(raw: string): Slug {
  const result = Slug.create(raw);
  if (result.isLeft()) throw result.value;
  return result.value;
}

describe('FileSystemBlogPostRepository', () => {
  describe('findAll', () => {
    it('should return all posts sorted by publishedAt desc when the content directory has valid posts', async () => {
      const repo = new FileSystemBlogPostRepository(
        path.join(FIXTURES_DIR, 'posts'),
      );

      const posts = await repo.findAll();

      expect(posts.map((p) => p.slug.value)).toEqual([
        'test-post',
        'older-post',
      ]);
      expect(posts[0]?.title.get('en-US')).toBe('Test Post');
      expect(posts[0]?.tags.map((t) => t.value)).toEqual([
        'nextjs',
        'architecture',
      ]);
    });
  });

  describe('findBySlug', () => {
    it('should return the matching post when the slug exists', async () => {
      const repo = new FileSystemBlogPostRepository(
        path.join(FIXTURES_DIR, 'posts'),
      );

      const post = await repo.findBySlug(unwrapSlug('test-post'));

      expect(post).not.toBeNull();
      expect(post?.title.get('pt-BR')).toBe('Post de Teste');
      expect(post?.description.get('es')).toBe(
        'Una publicación de prueba usada como fixture.',
      );
      expect(post?.content.get('en-US')).toContain('This is the English body.');
    });

    it('should return null when the slug does not exist', async () => {
      const repo = new FileSystemBlogPostRepository(
        path.join(FIXTURES_DIR, 'posts'),
      );

      const post = await repo.findBySlug(unwrapSlug('non-existent-post'));

      expect(post).toBeNull();
    });

    it('should throw InfrastructureError when a locale file is missing', async () => {
      const repo = new FileSystemBlogPostRepository(
        path.join(FIXTURES_DIR, 'posts-missing-locale'),
      );

      await expect(
        repo.findBySlug(unwrapSlug('missing-locale-post')),
      ).rejects.toThrow(InfrastructureError);
    });

    it('should throw InfrastructureError when meta.json is malformed', async () => {
      const repo = new FileSystemBlogPostRepository(
        path.join(FIXTURES_DIR, 'posts-malformed-meta'),
      );

      await expect(
        repo.findBySlug(unwrapSlug('malformed-meta-post')),
      ).rejects.toThrow(InfrastructureError);
    });

    it('should throw InfrastructureError when frontmatter is malformed', async () => {
      const repo = new FileSystemBlogPostRepository(
        path.join(FIXTURES_DIR, 'posts-malformed-frontmatter'),
      );

      await expect(
        repo.findBySlug(unwrapSlug('malformed-frontmatter-post')),
      ).rejects.toThrow(InfrastructureError);
    });
  });
});
