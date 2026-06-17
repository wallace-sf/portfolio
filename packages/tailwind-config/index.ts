import defaultTheme from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';

export default plugin(() => {}, {
  darkMode: 'selector',
  theme: {
    extend: {
      aspectRatio: {
        '319/180': '319 / 180',
        '465/244': '465 / 244',
        '7/5': '7 / 5',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'blue-dark': '#323dcd',
        'blue-light': '#a1a8ff',
        'dark-1000': '#d9d9d9',
        'dark-200': '#282828',
        'dark-300': '#323232',
        'dark-400': '#3e3e3e',
        'dark-500': '#494949',
        'dark-600': '#555555',
        'dark-700': '#8d8d8d',
        'dark-800': '#a4a4a4',
        'dark-900': '#bababa',
        accent: '#8efb9d',
        dark: '#1C1C1C',
        error: 'rgb(var(--tw-error) / <alpha-value>)',
        primary: '#4452ff',
        success: 'rgb(var(--tw-success) / <alpha-value>)',
        // Semantic layer — use these in components instead of primitive dark-* tokens.
        // Values are CSS variable references so dark/light mode switching works without
        // changing component classes. CSS vars are defined in globals.css.
        surface: {
          DEFAULT: 'rgb(var(--tw-surface) / <alpha-value>)',
          sunken: 'rgb(var(--tw-surface-sunken) / <alpha-value>)',
          base: 'rgb(var(--tw-surface-base) / <alpha-value>)',
          raised: 'rgb(var(--tw-surface-raised) / <alpha-value>)',
          overlay: 'rgb(var(--tw-surface-overlay) / <alpha-value>)',
          interactive: 'rgb(var(--tw-surface-interactive) / <alpha-value>)',
          selected: 'rgb(var(--tw-surface-selected) / <alpha-value>)',
        },
        content: {
          primary: 'rgb(var(--tw-content-primary) / <alpha-value>)',
          secondary: 'rgb(var(--tw-content-secondary) / <alpha-value>)',
          muted: 'rgb(var(--tw-content-muted) / <alpha-value>)',
          disabled: 'rgb(var(--tw-content-disabled) / <alpha-value>)',
        },
        border: {
          default: 'rgb(var(--tw-border-default) / <alpha-value>)',
          subtle: 'rgb(var(--tw-border-subtle) / <alpha-value>)',
          muted: 'rgb(var(--tw-border-muted) / <alpha-value>)',
        },
        brand: {
          primary: 'rgb(var(--tw-brand-primary) / <alpha-value>)',
          accent: 'rgb(var(--tw-brand-accent) / <alpha-value>)',
          'primary-hover': 'rgb(var(--tw-brand-primary-hover) / <alpha-value>)',
          'primary-active':
            'rgb(var(--tw-brand-primary-active) / <alpha-value>)',
        },
      },
      container: {
        center: true,
      },
      boxShadow: {
        1: '0px 1px 3px 0px rgba(166, 175, 195, 0.40)',
        2: '0px 5px 12px 0px rgba(0, 0, 0, 0.10)',
        3: '0px 4px 12px 0px rgba(13, 10, 44, 0.06)',
        4: '0px 10px 30px 0px rgba(85, 106, 235, 0.12), 0px 4px 10px 0px rgba(85, 106, 235, 0.04), 0px -18px 38px 0px rgba(85, 106, 235, 0.04)',
        5: '0px 13px 40px 0px rgba(13, 10, 44, 0.12), 0px -8px 18px 0px rgba(13, 10, 44, 0.04)',
        6: '0px 12px 34px 0px rgba(13, 10, 44, 0.08), 0px 34px 26px 0px rgba(13, 10, 44, 0.05)',
      },
      borderRadius: {
        3.75: '0.9375rem',
        2.5: '0.625rem',
        4.5: '1.125rem',
        5: '1.25rem',
        badge: '0.9375rem',
        card: '1.25rem',
      },
      spacing: {
        '2.5': '0.625rem',
        15: '3.75rem',
        24.5: '6.125rem',
        45: '11.25rem',
        49: '12.25rem',
        50: '12.5rem',
        61: '15.25rem',
        84.75: '21.1875rem',
        85.75: '21.4375rem',
        100: '25rem',
        106: '26.5rem',
        110.25: '27.5625rem',
        116.25: '29.0625rem',
        237.5: '59.375rem',
        278.5: '69.625rem',
      },
      zIndex: {
        999999: '999999',
        99999: '99999',
        9999: '9999',
        999: '999',
        99: '99',
        9: '9',
        1: '1',
      },
    },
  },
});
