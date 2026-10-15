/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PostHeader } from '~features/blog/PostHeader';

const BASE = {
  title: 'The Either Pattern',
  description: 'Why this codebase never throws for domain errors.',
  publishedAt: '2026-08-01',
  tags: ['typescript', 'ddd'],
  locale: 'en-US',
};

describe('PostHeader', () => {
  it('should render the published date as a locale-formatted time element', () => {
    const { container } = render(<PostHeader {...BASE} locale="es" />);
    const time = container.querySelector('time');

    expect(time).toHaveAttribute('datetime', '2026-08-01');
    expect(time?.textContent).toBe(
      new Intl.DateTimeFormat('es', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
      }).format(new Date('2026-08-01')),
    );
  });

  it('should render one badge per tag when the post has tags', () => {
    render(<PostHeader {...BASE} />);

    expect(screen.getByText('typescript')).toBeInTheDocument();
    expect(screen.getByText('ddd')).toBeInTheDocument();
  });

  it('should not render a tag row when there are no tags', () => {
    render(<PostHeader {...BASE} tags={[]} />);

    expect(screen.queryByText('typescript')).not.toBeInTheDocument();
  });
});
