import { describe, expect, it } from 'vitest';

import { rankPosts } from '~features/blog/search/rankPosts';
import type { SearchablePost } from '~features/blog/search/types';

const post = (
  slug: string,
  fields: Partial<Omit<SearchablePost, 'slug'>> = {},
): SearchablePost => ({
  slug,
  title: `Title ${slug}`,
  description: `Description ${slug}`,
  tags: [],
  ...fields,
});

const slugs = (posts: SearchablePost[]) => posts.map((p) => p.slug);

describe('rankPosts', () => {
  it('should rank title over tags over description over body when each post matches in one field', () => {
    const posts = [
      post('in-body'),
      post('in-description', { description: 'About the Validator chain' }),
      post('in-tags', { tags: ['validator'] }),
      post('in-title', { title: 'One Validator, one left' }),
    ];
    const bodies = { 'in-body': 'Chain every rule on the validator.' };

    expect(slugs(rankPosts(posts, bodies, ['validator']))).toEqual([
      'in-title',
      'in-tags',
      'in-description',
      'in-body',
    ]);
  });

  it('should require every term when the query has several terms', () => {
    const posts = [
      post('both', { title: 'Either and Validator' }),
      post('only-either', { title: 'Either' }),
    ];

    expect(slugs(rankPosts(posts, {}, ['either', 'validator']))).toEqual([
      'both',
    ]);
  });

  it('should let each term match a different field when the query has several terms', () => {
    const posts = [post('split', { title: 'Either', tags: ['ddd'] })];

    expect(slugs(rankPosts(posts, {}, ['either', 'ddd']))).toEqual(['split']);
  });

  it('should keep the input order when posts tie on rank', () => {
    const posts = [
      post('newer', { title: 'Either one' }),
      post('older', { title: 'Either two' }),
    ];

    expect(slugs(rankPosts(posts, {}, ['either']))).toEqual(['newer', 'older']);
  });

  it('should match accents in posts when the terms are folded', () => {
    const posts = [post('pt', { title: 'Validação de domínio' })];

    expect(slugs(rankPosts(posts, {}, ['validacao', 'dominio']))).toEqual([
      'pt',
    ]);
  });

  it('should match card fields only when bodies are not loaded yet', () => {
    const posts = [post('body-only'), post('titled', { title: 'Either' })];

    expect(slugs(rankPosts(posts, {}, ['either']))).toEqual(['titled']);
  });

  it('should return no posts when there are no terms', () => {
    expect(rankPosts([post('any')], {}, [])).toEqual([]);
  });
});
