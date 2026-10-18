import { BlogPostBuilder } from '@repo/core/testing';
import { describe, expect, it, vi } from 'vitest';

import { GetBlogSearchIndex } from '~/blog/use-cases/GetBlogSearchIndex';

import { makeBlogPostRepository } from './helpers/makeBlogPostRepository';

describe('GetBlogSearchIndex', () => {
  describe('execute()', () => {
    it('should return the plain-text body in the requested locale when a post is published', async () => {
      const post = BlogPostBuilder.published('either')
        .withContent({
          'en-US': '## Why\n\nReturn **one** `left`.',
          'pt-BR': '## Por quê\n\nRetorne **um** `left`.',
          es: '## Por qué\n\nDevuelve **un** `left`.',
        })
        .now();
      const repo = makeBlogPostRepository({
        findAll: vi.fn().mockResolvedValue([post]),
      });

      const result = await new GetBlogSearchIndex(repo).execute({
        locale: 'pt-BR',
      });

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value).toEqual([
        { slug: 'either', text: 'Por quê Retorne um left.' },
      ]);
    });

    it('should list published posts only, newest first, when the repository mixes statuses and dates', async () => {
      const repo = makeBlogPostRepository({
        findAll: vi
          .fn()
          .mockResolvedValue([
            BlogPostBuilder.published(
              'older',
              '2026-01-01T00:00:00.000Z',
            ).now(),
            BlogPostBuilder.draft('draft').withTags([]).now(),
            BlogPostBuilder.published(
              'newer',
              '2026-06-01T00:00:00.000Z',
            ).now(),
            BlogPostBuilder.archived('archived').now(),
          ]),
      });

      const result = await new GetBlogSearchIndex(repo).execute({
        locale: 'en-US',
      });

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.map((entry) => entry.slug)).toEqual([
        'newer',
        'older',
      ]);
    });

    it('should return an empty list when there are no published posts', async () => {
      const repo = makeBlogPostRepository({
        findAll: vi.fn().mockResolvedValue([]),
      });

      const result = await new GetBlogSearchIndex(repo).execute({
        locale: 'en-US',
      });

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value).toEqual([]);
    });

    it('should return FETCH_FAILED when the repository throws', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      const repo = makeBlogPostRepository({
        findAll: vi.fn().mockRejectedValue(new Error('db down')),
      });

      const result = await new GetBlogSearchIndex(repo).execute({
        locale: 'en-US',
      });

      expect(result.isLeft()).toBe(true);
      if (!result.isLeft()) return;
      expect(result.value.code).toBe('FETCH_FAILED');
    });
  });
});
