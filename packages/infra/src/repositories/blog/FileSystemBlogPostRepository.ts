import { IBlogPostRepository } from '@repo/application/blog';
import { BlogPost } from '@repo/core/blog';
import { Locale, LOCALES, Slug } from '@repo/core/shared';
import matter from 'gray-matter';
import { promises as fs } from 'node:fs';
import path from 'node:path';

import { InfrastructureError } from '../../errors/InfrastructureError';
import { BlogPostMapper, ParsedLocaleFiles } from './BlogPostMapper';
import { MdxFrontmatterSchema, MetaJsonSchema } from './schemas';

const META_FILENAME = 'meta.json';

export class FileSystemBlogPostRepository implements IBlogPostRepository {
  constructor(private readonly contentDir: string) {}

  /**
   * Reads every post directory. A single malformed post (bad `meta.json`,
   * broken frontmatter, missing locale file) is skipped with a warning rather
   * than failing the whole read — one bad post must not take down the entire
   * blog listing or the site build.
   */
  async findAll(): Promise<BlogPost[]> {
    const entries = await fs.readdir(this.contentDir, { withFileTypes: true });
    const slugs = entries.filter((e) => e.isDirectory()).map((e) => e.name);

    const results = await Promise.allSettled(
      slugs.map((slug) => this.readPost(slug)),
    );

    const posts = results.flatMap((result, index) => {
      if (result.status === 'fulfilled') return [result.value];

      const reason =
        result.reason instanceof Error
          ? result.reason.message
          : String(result.reason);
      // eslint-disable-next-line no-console
      console.warn(
        `[blog] skipping malformed post "${slugs[index]}": ${reason}`,
      );
      return [];
    });

    return posts.sort((a, b) => BlogPost.compareByPublication(b, a));
  }

  async findBySlug(slug: Slug): Promise<BlogPost | null> {
    const postDir = path.join(this.contentDir, slug.value);

    try {
      await fs.access(postDir);
    } catch {
      return null;
    }

    return this.readPost(slug.value);
  }

  private async readPost(slug: string): Promise<BlogPost> {
    const postDir = path.join(this.contentDir, slug);

    const meta = await this.readMeta(postDir, slug);
    const locales = await this.readLocaleFiles(postDir, slug);

    return BlogPostMapper.toDomain(meta, locales);
  }

  private async readMeta(postDir: string, slug: string) {
    const metaPath = path.join(postDir, META_FILENAME);
    const raw = await this.readFile(metaPath, slug);

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      throw new InfrastructureError(
        `Malformed ${META_FILENAME} for blog post "${slug}": invalid JSON`,
        err,
      );
    }

    const result = MetaJsonSchema.safeParse(parsed);
    if (!result.success) {
      throw new InfrastructureError(
        `Malformed ${META_FILENAME} for blog post "${slug}": ${result.error.message}`,
        result.error,
      );
    }

    return result.data;
  }

  private async readLocaleFiles(
    postDir: string,
    slug: string,
  ): Promise<ParsedLocaleFiles> {
    const entries = await Promise.all(
      LOCALES.map(async (locale) => {
        const filePath = path.join(postDir, `${locale}.mdx`);
        const raw = await this.readFile(filePath, slug, locale);

        const { data, content } = matter(raw);

        const result = MdxFrontmatterSchema.safeParse(data);
        if (!result.success) {
          throw new InfrastructureError(
            `Malformed frontmatter in "${locale}.mdx" for blog post "${slug}": ${result.error.message}`,
            result.error,
          );
        }

        return [
          locale,
          {
            title: result.data.title,
            description: result.data.description,
            content,
          },
        ] as const;
      }),
    );

    return Object.fromEntries(entries) as ParsedLocaleFiles;
  }

  private async readFile(
    filePath: string,
    slug: string,
    locale?: Locale,
  ): Promise<string> {
    try {
      return await fs.readFile(filePath, 'utf-8');
    } catch {
      const target = locale ? `locale file "${locale}.mdx"` : META_FILENAME;
      throw new InfrastructureError(
        `Missing ${target} for blog post "${slug}" — full i18n (en-US, pt-BR, es) is required.`,
      );
    }
  }
}
