/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { PostAuthor } from '~features/blog/PostAuthor';

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

const AUTHOR = {
  name: 'Test Author',
  avatarUrl: 'https://example.com/avatar.png',
};

const LINKED_AUTHOR = { ...AUTHOR, url: 'https://example.com/me' };

describe('PostAuthor', () => {
  it('should render the avatar as a decorative image when given an author', () => {
    const { container } = render(<PostAuthor author={AUTHOR} />);
    const avatar = container.querySelector('img');

    expect(avatar).toHaveAttribute('src', AUTHOR.avatarUrl);
    expect(avatar).toHaveAttribute('alt', '');
  });

  it('should link the name to the author page when the author has a url', () => {
    render(<PostAuthor author={LINKED_AUTHOR} />);

    const link = screen.getByRole('link', { name: 'Test Author' });
    expect(link).toHaveAttribute('href', 'https://example.com/me');
    expect(link).toHaveAttribute('rel', 'author noopener');
  });

  it('should render the name as plain text when the author has no url', () => {
    render(<PostAuthor author={AUTHOR} />);

    expect(screen.getByText('Test Author')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
