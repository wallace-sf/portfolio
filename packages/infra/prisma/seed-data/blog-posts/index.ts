import { oneValidatorOneLeft } from './one-validator-one-left';
import { serverComponentsAsCompositionRoot } from './server-components-as-composition-root';
import { theEitherPatternInTypescript } from './the-either-pattern-in-typescript';
import { valueObjectsVsPrimitives } from './value-objects-vs-primitives';

import type { BlogPostSeed, BlogPostSeedAuthor } from './types';

export type { BlogPostSeed, BlogPostSeedAuthor } from './types';

export const BLOG_POST_AUTHOR: BlogPostSeedAuthor = {
  name: 'Wallace Ferreira',
  avatarUrl: 'https://github.com/wallace-sf.png',
  url: 'https://wallace-ferreira.dev',
};

export const blogPosts: readonly BlogPostSeed[] = [
  oneValidatorOneLeft,
  serverComponentsAsCompositionRoot,
  theEitherPatternInTypescript,
  valueObjectsVsPrimitives,
];
