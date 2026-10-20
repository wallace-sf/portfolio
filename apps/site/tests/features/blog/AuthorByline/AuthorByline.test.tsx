/**
 * @vitest-environment jsdom
 */
import { screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthorByline } from '~features/blog/AuthorByline';

import { renderServerComponent } from '../../../helpers/renderServerComponent';

vi.mock(
  'next-intl/server',
  async () => (await import('../../../helpers/intlServerMock')).intlServerMock,
);

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

const AUTHOR = {
  name: 'Test Author',
  avatarUrl: 'https://example.com/avatar.png',
  url: 'https://example.com',
};

const LINKEDIN = 'https://www.linkedin.com/in/test-author';
const EMAIL = 'author@example.com';

describe('AuthorByline', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_LINKEDIN_URL', undefined);
    vi.stubEnv('NEXT_PUBLIC_CONTACT_EMAIL', undefined);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('should link the author name to their page when the author has a url', async () => {
    await renderServerComponent(
      AuthorByline({ author: AUTHOR, locale: 'en-US' }),
    );

    const link = screen.getByRole('link', { name: 'Test Author' });
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('rel', 'author noopener');
  });

  it('should show the name without a link when the author has no url', async () => {
    await renderServerComponent(
      AuthorByline({ author: { ...AUTHOR, url: undefined }, locale: 'en-US' }),
    );

    expect(screen.getByText('Test Author')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('should render the bio when the author has one', async () => {
    const bio = 'Writes about TypeScript and DDD.';

    await renderServerComponent(
      AuthorByline({ author: { ...AUTHOR, bio }, locale: 'pt-BR' }),
    );

    expect(screen.getByText(bio)).toBeInTheDocument();
    expect(
      screen.getByRole('region', { name: 'Sobre o autor' }),
    ).toBeInTheDocument();
  });

  it('should invite the reader to talk on LinkedIn or by email when both are configured', async () => {
    vi.stubEnv('NEXT_PUBLIC_LINKEDIN_URL', LINKEDIN);
    vi.stubEnv('NEXT_PUBLIC_CONTACT_EMAIL', EMAIL);

    await renderServerComponent(
      AuthorByline({ author: AUTHOR, locale: 'pt-BR' }),
    );

    const linkedin = screen.getByRole('link', { name: 'LinkedIn' });
    expect(linkedin).toHaveAttribute('href', LINKEDIN);
    expect(linkedin).toHaveAttribute('target', '_blank');
    expect(screen.getByRole('link', { name: 'e-mail' })).toHaveAttribute(
      'href',
      `mailto:${EMAIL}`,
    );
  });

  it('should only offer email when LinkedIn is not configured', async () => {
    vi.stubEnv('NEXT_PUBLIC_CONTACT_EMAIL', EMAIL);

    await renderServerComponent(
      AuthorByline({ author: AUTHOR, locale: 'en-US' }),
    );

    expect(screen.getByRole('link', { name: 'email' })).toHaveAttribute(
      'href',
      `mailto:${EMAIL}`,
    );
    expect(
      screen.queryByRole('link', { name: 'LinkedIn' }),
    ).not.toBeInTheDocument();
  });

  it('should not render the invite when no contact channel is configured', async () => {
    await renderServerComponent(
      AuthorByline({ author: AUTHOR, locale: 'en-US' }),
    );

    expect(screen.queryByText(/Want to talk/)).not.toBeInTheDocument();
  });
});
