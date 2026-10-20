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

vi.mock('~features/shared/NativeShareButton', () => ({
  NativeShareButton: ({ label }: { label: string }) => (
    <button aria-label={label} />
  ),
}));

vi.mock('@repo/ui/Imagery', () => ({
  Icon: () => <span />,
}));

const PATH = '/blog/2026/10/studio-mir';
const TITLE = 'Studio Mir';

describe('PostShare', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://example.dev');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('should open every network share link in a new tab with a localized name when rendered', async () => {
    await renderServerComponent(
      PostShare({ path: PATH, title: TITLE, locale: 'es' }),
    );

    const links = screen.getAllByRole('link');
    expect(links.map((link) => link.getAttribute('aria-label'))).toEqual([
      'Compartir en LinkedIn',
      'Compartir en X',
      'Compartir en Bluesky',
      'Compartir en WhatsApp',
      'Compartir en Reddit',
      'Compartir en Hacker News',
    ]);
    links.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('should link to the LinkedIn share dialog with the encoded post url when rendered', async () => {
    await renderServerComponent(
      PostShare({ path: PATH, title: TITLE, locale: 'pt-BR' }),
    );

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
    await renderServerComponent(
      PostShare({ path: PATH, title: TITLE, locale: 'en-US' }),
    );

    expect(
      screen.getByRole('button', { name: 'Copy post link' }),
    ).toHaveAttribute('data-path', PATH);
    expect(screen.getByRole('group', { name: 'Share' })).toBeInTheDocument();
  });

  it('should offer the native share sheet when rendered', async () => {
    await renderServerComponent(
      PostShare({ path: PATH, title: TITLE, locale: 'en-US' }),
    );

    expect(
      screen.getByRole('button', { name: 'More sharing options' }),
    ).toBeInTheDocument();
  });
});
