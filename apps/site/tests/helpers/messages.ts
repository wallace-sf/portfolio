import enUS from '~/../messages/en-US.json';
import es from '~/../messages/es.json';
import ptBR from '~/../messages/pt-BR.json';

/** The real message catalogues, by locale, for server mocks and client providers. */
export const CATALOGUES = { 'en-US': enUS, 'pt-BR': ptBR, es } as const;

export type CatalogueLocale = keyof typeof CATALOGUES;
