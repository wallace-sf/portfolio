import { type Locale } from '@repo/core/shared';
import { ButtonLink } from '@repo/ui/Control/Button/Link';
import { Icon } from '@repo/ui/Imagery';
import classNames from 'classnames';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

import illustrationSrc from '~assets/images/curriculum-cta-illustration.webp';

interface ICurriculumCTAProps {
  locale: Locale;
  resumeUrl?: string;
  className?: string;
}

export async function CurriculumCTA({
  locale,
  resumeUrl,
  className,
}: ICurriculumCTAProps) {
  const t = await getTranslations({ locale, namespace: 'CurriculumCTA' });
  const url = resumeUrl ?? process.env.NEXT_PUBLIC_RESUME_URL ?? '#';

  return (
    <section
      className={classNames(
        'flex flex-col lg:flex-row items-center gap-6 lg:gap-14 bg-surface rounded-xl p-6 lg:p-8 shadow-drop-sm',
        className,
      )}
    >
      <div className="relative w-full h-[220px] lg:w-[320px] lg:h-[317px] shrink-0">
        <Image
          src={illustrationSrc}
          alt={t('illustration_alt')}
          fill
          className="object-contain"
        />
      </div>

      <div className="flex flex-col gap-y-8 w-full lg:w-auto">
        <p className="text-2xl font-normal text-content-primary">
          {t('description')}
        </p>
        <ButtonLink
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-x-2 w-full lg:w-[292px] justify-center"
        >
          {t('button')}
          <Icon icon="material-symbols:open-in-new" className="text-2xl" />
        </ButtonLink>
      </div>
    </section>
  );
}
