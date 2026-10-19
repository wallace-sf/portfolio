import { enforcingDependencyRuleInMonorepo } from './enforcing-dependency-rule-in-monorepo';
import { oneValidatorOneLeft } from './one-validator-one-left';
import { sanitizedMarkdownPipeline } from './sanitized-markdown-pipeline';
import { serverComponentsAsCompositionRoot } from './server-components-as-composition-root';
import { staticBlogRoutesWithGenerateStaticParams } from './static-blog-routes-with-generate-static-params';
import { studioMirExperienciaDigital } from './studio-mir-experiencia-digital';
import { testingUseCasesWithInMemoryRepositories } from './testing-use-cases-with-in-memory-repositories';
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
  testingUseCasesWithInMemoryRepositories,
  staticBlogRoutesWithGenerateStaticParams,
  sanitizedMarkdownPipeline,
  enforcingDependencyRuleInMonorepo,
  studioMirExperienciaDigital,
];
