import { studioMirExperienciaDigital } from './studio-mir-experiencia-digital';

import type { BlogPostSeed, BlogPostSeedAuthor } from './types';

export type { BlogPostSeed, BlogPostSeedAuthor } from './types';

export const BLOG_POST_AUTHOR: BlogPostSeedAuthor = {
  name: 'Wallace Ferreira',
  avatarUrl: 'https://github.com/wallace-sf.png',
  url: 'https://wallace-ferreira.dev',
};

export const blogPosts: readonly BlogPostSeed[] = [studioMirExperienciaDigital];
