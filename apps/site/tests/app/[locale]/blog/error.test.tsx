/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import BlogError from '~/app/[locale]/blog/error';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) =>
    ({
      title: 'Something went wrong',
      description: "We couldn't load this content.",
      retry: 'Try again',
    })[key],
}));

describe('blog error boundary', () => {
  it('should render the error view for a thrown blog page', () => {
    render(<BlogError error={new Error('boom')} reset={vi.fn()} />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Try again' }),
    ).toBeInTheDocument();
  });

  it('should call reset when the retry button is clicked', async () => {
    const reset = vi.fn();
    render(<BlogError error={new Error('boom')} reset={reset} />);

    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));

    expect(reset).toHaveBeenCalledTimes(1);
  });
});
