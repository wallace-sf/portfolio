import { GetProfile } from '@repo/application/portfolio';
import { type Locale } from '@repo/core/shared';
import { TextRich } from '@repo/ui/View';
import { getTranslations } from 'next-intl/server';

import { getServerContainer } from '~/lib/server/container';

export async function BioSection({ locale }: { locale: Locale }) {
  const [t, profileResult] = await Promise.all([
    getTranslations({ locale, namespace: 'About' }),
    new GetProfile(getServerContainer().profileRepository).execute({ locale }),
  ]);

  const bio = profileResult.isRight() ? profileResult.value.bio : null;

  if (!bio) return null;

  return (
    <section className="mt-10 flex flex-col gap-y-4 xl:mt-16 2xl:mt-20">
      <h2 className="text-left text-[32px] font-bold text-content-primary">
        {t('bio_title')}
      </h2>
      <TextRich content={bio} className="text-base text-content-disabled" />
    </section>
  );
}
