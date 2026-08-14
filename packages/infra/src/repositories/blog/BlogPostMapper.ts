import { BlogPost, IBlogPostProps } from '@repo/core/blog';
import { ILocalizedTextInput, Locale } from '@repo/core/shared';

import { InfrastructureError } from '../../errors/InfrastructureError';
import { MetaJson } from './schemas';

export interface IParsedLocaleFile {
  title: string;
  description: string;
  content: string;
}

export type ParsedLocaleFiles = Record<Locale, IParsedLocaleFile>;

function toLocalizedInput(
  locales: ParsedLocaleFiles,
  field: keyof IParsedLocaleFile,
): ILocalizedTextInput {
  return {
    'en-US': locales['en-US'][field],
    'pt-BR': locales['pt-BR'][field],
    es: locales.es[field],
  };
}

export class BlogPostMapper {
  static toDomain(meta: MetaJson, locales: ParsedLocaleFiles): BlogPost {
    const props: IBlogPostProps = {
      slug: meta.slug,
      title: toLocalizedInput(locales, 'title'),
      description: toLocalizedInput(locales, 'description'),
      content: toLocalizedInput(locales, 'content'),
      tags: meta.tags,
      publishedAt: meta.publishedAt,
      coverImage: meta.coverImage,
    };

    const result = BlogPost.create(props);
    if (result.isLeft()) {
      throw new InfrastructureError(
        `Failed to map blog post ${meta.slug} to domain: ${result.value.message}`,
        result.value,
      );
    }

    return result.value;
  }
}
