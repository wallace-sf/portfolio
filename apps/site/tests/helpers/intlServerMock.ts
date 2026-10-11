import { createTranslator } from 'next-intl';
import { vi } from 'vitest';

import enUS from '~/../messages/en-US.json';
import es from '~/../messages/es.json';
import ptBR from '~/../messages/pt-BR.json';

const CATALOGUES = { 'en-US': enUS, 'pt-BR': ptBR, es } as const;

type CatalogueLocale = keyof typeof CATALOGUES;

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
