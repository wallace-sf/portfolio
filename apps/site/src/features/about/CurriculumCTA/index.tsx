import { type Locale } from '@repo/core/shared';
import { Icon } from '@repo/ui/Imagery';
import classNames from 'classnames';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

import illustrationSrc from '~assets/images/curriculum-cta-illustration.png';

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
        'flex flex-row items-center gap-14 bg-surface rounded-xl p-8',
        className,
      )}
    >
      <div className="relative w-[320px] h-[317px] shrink-0">
        <Image
          src={illustrationSrc}
          alt={t('illustration_alt')}
          fill
          className="object-contain"
        />
      </div>

      <div className="flex flex-col gap-y-8 w-[511px]">
        <p className="text-2xl font-normal text-content-primary">
          {t('description')}
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-x-2 w-[292px] h-12 justify-center bg-brand-primary rounded-xl px-6 text-base font-bold text-white"
        >
          {t('button')}
          <Icon icon="material-symbols:open-in-new" className="text-2xl" />
        </a>
      </div>
    </section>
  );
}
