/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { PostCover } from '~features/blog/PostCover';

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

describe('PostCover', () => {
  it('should render the cover image with its localized alt text', () => {
    render(
      <PostCover
        image={{ url: 'https://cdn/cover.webp', alt: 'Article cover' }}
      />,
    );

    expect(screen.getByRole('img', { name: 'Article cover' })).toHaveAttribute(
      'src',
      'https://cdn/cover.webp',
    );
  });
});
