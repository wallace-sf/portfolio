import { useLocale } from 'next-intl';

import { redirect } from '~i18n/routing';

export default function CatchAllPage() {
  const locale = useLocale();

  redirect({ href: '/', locale: locale });
}
