import { DEFAULT_LOCALE } from '@repo/core/shared';

export const LANGUAGES_OPTIONS = [
  {
    option: DEFAULT_LOCALE,
    labelKey: 'enUS' as const,
    icon: 'twemoji:flag-united-states',
  },
  { option: 'pt-BR', labelKey: 'ptBR' as const, icon: 'twemoji:flag-brazil' },
  { option: 'es', labelKey: 'es' as const, icon: 'twemoji:flag-spain' },
];
