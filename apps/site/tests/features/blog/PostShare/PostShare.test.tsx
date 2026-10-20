/**
 * @vitest-environment jsdom
 */
import { screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { PostShare } from '~features/blog/PostShare';

import { renderServerComponent } from '../../../helpers/renderServerComponent';

vi.mock(
  'next-intl/server',
  async () => (await import('../../../helpers/intlServerMock')).intlServerMock,
);

vi.mock('~features/shared/ShareButton', () => ({
  ShareButton: ({ path, label }: { path: string; label: string }) => (
    <button aria-label={label} data-path={path} />
  ),
}));

vi.mock('@repo/ui/Imagery', () => ({
  Icon: () => <span />,
}));

const PATH = '/blog/2026/10/studio-mir';

describe('PostShare', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://example.dev');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('should link to the LinkedIn share dialog with the encoded post url when rendered', async () => {
    await renderServerComponent(PostShare({ path: PATH, locale: 'pt-BR' }));

    const link = screen.getByRole('link', {
      name: 'Compartilhar no LinkedIn',
    });
    expect(link).toHaveAttribute(
      'href',
      'https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fexample.dev%2Fpt-BR%2Fblog%2F2026%2F10%2Fstudio-mir',
    );
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should offer copying the post path when rendered', async () => {
    await renderServerComponent(PostShare({ path: PATH, locale: 'en-US' }));

    expect(
      screen.getByRole('button', { name: 'Copy post link' }),
    ).toHaveAttribute('data-path', PATH);
    expect(screen.getByRole('group', { name: 'Share' })).toBeInTheDocument();
  });
});
