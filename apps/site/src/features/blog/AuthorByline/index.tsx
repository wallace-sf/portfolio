import type { BlogPostAuthorDTO } from '@repo/application/blog';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

export interface IAuthorBylineProps {
  author: BlogPostAuthorDTO;
  locale: string;
}

/** The "About the author" block at the end of a post. */
export async function AuthorByline({ author, locale }: IAuthorBylineProps) {
  const t = await getTranslations({ locale, namespace: 'Blog' });
  const { name, avatarUrl, url, bio } = author;

  return (
    <section
      aria-label={t('aboutAuthor')}
      className="flex items-start gap-4 rounded-card bg-surface p-5 shadow-drop-sm"
    >
      <Image
        src={avatarUrl}
        alt=""
        width={40}
        height={40}
        className="size-10 shrink-0 rounded-full"
      />

      <div className="flex flex-col gap-1">
        <p className="text-body-xs text-content-muted">{t('aboutAuthor')}</p>
        <p className="text-body-base font-semibold text-content-primary">
          {url ? (
            <a href={url} rel="author noopener" className="hover:underline">
              {name}
            </a>
          ) : (
            name
          )}
        </p>
        {bio && <p className="text-body-sm text-content-secondary">{bio}</p>}
      </div>
    </section>
  );
}
