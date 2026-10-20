import { describe, expect, it, vi } from 'vitest';

import { imageZoomLabels } from '~/i18n/imageZoomLabels';

vi.mock(
  'next-intl/server',
  async () => (await import('../helpers/intlServerMock')).intlServerMock,
);

describe('imageZoomLabels', () => {
  it.each([
    ['en-US', { zoom: 'Open larger view', close: 'Close' }],
    ['pt-BR', { zoom: 'Ampliar imagem', close: 'Fechar' }],
    ['es', { zoom: 'Ampliar imagen', close: 'Cerrar' }],
  ])(
    'should return the viewer labels in %s when asked for that locale',
    async (locale, expected) => {
      expect(await imageZoomLabels(locale)).toEqual(expected);
    },
  );
});
