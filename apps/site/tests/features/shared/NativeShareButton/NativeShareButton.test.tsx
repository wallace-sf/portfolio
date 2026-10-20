import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { NativeShareButton } from '~features/shared/NativeShareButton';

vi.mock('next-intl', () => ({
  useLocale: () => 'pt-BR',
}));

vi.mock('@repo/ui/Imagery', () => ({
  Icon: () => <span />,
}));

const PROPS = {
  path: '/blog/2026/10/post',
  title: 'A post',
  label: 'More sharing options',
};

const stubShare = (share: unknown) =>
  Object.defineProperty(navigator, 'share', {
    value: share,
    configurable: true,
  });

describe('NativeShareButton', () => {
  afterEach(() => {
    stubShare(undefined);
  });

  it('should render nothing when the browser has no Web Share API', () => {
    stubShare(undefined);

    render(<NativeShareButton {...PROPS} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should share the title and the localized absolute url when clicked', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    stubShare(share);

    render(<NativeShareButton {...PROPS} />);
    fireEvent.click(
      await screen.findByRole('button', { name: 'More sharing options' }),
    );

    expect(share).toHaveBeenCalledWith({
      title: 'A post',
      url: `${window.location.origin}/pt-BR/blog/2026/10/post`,
    });
  });

  it('should swallow the rejection when the reader cancels the share sheet', async () => {
    const unhandled = vi.fn();
    process.on('unhandledRejection', unhandled);
    // A plain function: vi.fn tracks settled results, which would mark the
    // rejection as handled and hide a missing catch.
    let calls = 0;
    const share = () => {
      calls += 1;
      return Promise.reject(new DOMException('cancelled', 'AbortError'));
    };
    stubShare(share);

    render(<NativeShareButton {...PROPS} />);
    fireEvent.click(await screen.findByRole('button'));
    await new Promise((resolve) => setTimeout(resolve, 0));
    process.off('unhandledRejection', unhandled);

    expect(calls).toBe(1);
    expect(unhandled).not.toHaveBeenCalled();
  });
});
