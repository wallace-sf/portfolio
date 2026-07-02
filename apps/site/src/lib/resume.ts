import { type Locale } from '@repo/core/shared';

import { env } from '~/config/env';

export function getResumeUrl(locale: Locale): string {
  return env.resumeUrlByLocale[locale];
}
