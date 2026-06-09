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

export const THEME_OPTIONS = [
  { option: 'light' as const, icon: 'material-symbols:light-mode-rounded' },
  { option: 'dark' as const, icon: 'material-symbols:dark-mode-rounded' },
  { option: 'system' as const, icon: 'material-symbols:routine-rounded' },
];
