import type { BlogPostAuthorDTO } from '@repo/application/blog';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

import { env } from '~/config/env';

export interface IAuthorBylineProps {
  author: BlogPostAuthorDTO;
  locale: string;
}

const CONTACT_LINK =
  'text-brand-accent [.light_&]:text-brand-primary underline underline-offset-2';

type Channels = 'both' | 'linkedin' | 'email';

/** Which contact channels are configured, or `undefined` when none is. */
function contactChannels(
  linkedinUrl?: string,
  email?: string,
): Channels | undefined {
  if (linkedinUrl && email) return 'both';
  if (linkedinUrl) return 'linkedin';
  return email ? 'email' : undefined;
}

/** The "About the author" block at the end of a post, with a contact invite. */
export async function AuthorByline({ author, locale }: IAuthorBylineProps) {
  const t = await getTranslations({ locale, namespace: 'Blog' });
  const { name, avatarUrl, url, bio } = author;
  const { linkedinUrl, contactEmail } = env;
  const channels = contactChannels(linkedinUrl, contactEmail);

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
        {channels && (
          <p className="text-body-sm text-content-secondary">
            {t.rich('letsTalk', {
              channels,
              linkedin: (chunks) => (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={CONTACT_LINK}
                >
                  {chunks}
                </a>
              ),
              email: (chunks) => (
                <a href={`mailto:${contactEmail}`} className={CONTACT_LINK}>
                  {chunks}
                </a>
              ),
            })}
          </p>
        )}
      </div>
    </section>
  );
}
