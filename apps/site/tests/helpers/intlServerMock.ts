import { createTranslator } from 'next-intl';
import { vi } from 'vitest';

import { type CatalogueLocale, CATALOGUES } from './messages';

/**
 * A `next-intl/server` stand-in backed by the real message catalogues, so page
 * tests exercise the actual strings — ICU plurals and arguments included —
 * instead of a hand-written key map. Use as:
 *
 *   vi.mock('next-intl/server', async () =>
 *     (await import('<path>/helpers/intlServerMock')).intlServerMock);
 */
export const intlServerMock = {
  setRequestLocale: vi.fn(),
  getTranslations: async ({
    locale,
    namespace,
  }: {
    locale: string;
    namespace?: string;
  }) =>
    createTranslator({
      locale,
      messages: CATALOGUES[locale as CatalogueLocale],
      namespace: namespace as never,
    }),
};
