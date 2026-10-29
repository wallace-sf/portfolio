/**
 * @vitest-environment jsdom
 */
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { BackToTop } from '~features/blog/BackToTop';

vi.mock('@repo/ui/Imagery', () => ({
  Icon: () => <span data-testid="icon" />,
}));

const VIEWPORT = 800;

/** The window scrolled to `y`, then reporting the scroll. */
function scrollWindowTo(y: number) {
  vi.stubGlobal('scrollY', y);
  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });
}

function stubReducedMotion(reduce: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: reduce && query.includes('reduce'),
  }));
}

function renderButton() {
  const title = document.createElement('h1');
  title.id = 'post-title';
  title.tabIndex = -1;
  document.body.appendChild(title);

  render(<BackToTop label="Back to top" focusTargetId="post-title" />);
  return {
    title,
    button: screen.getByRole('button', { hidden: true }),
  };
}

beforeEach(() => {
  vi.stubGlobal('innerHeight', VIEWPORT);
  vi.stubGlobal('scrollY', 0);
  vi.stubGlobal('scrollTo', vi.fn());
  vi.stubGlobal('requestAnimationFrame', (update: FrameRequestCallback) => {
    update(0);
    return 0;
  });
  stubReducedMotion(false);
});

afterEach(() => {
  vi.unstubAllGlobals();
  document.body.innerHTML = '';
});

describe('BackToTop', () => {
  it('should be hidden and out of the tab order when the reader is near the top', () => {
    const { button } = renderButton();

    expect(button).toHaveClass('invisible');
  });

  it('should appear when the reader scrolls past two viewports and hide again near the top', () => {
    const { button } = renderButton();

    scrollWindowTo(VIEWPORT * 2 + 1);
    expect(button).not.toHaveClass('invisible');
    expect(screen.getByRole('button', { name: 'Back to top' })).toBe(button);

    scrollWindowTo(VIEWPORT);
    expect(button).toHaveClass('invisible');
  });

  it('should smoothly scroll to the top and focus the target when clicked', () => {
    const { button, title } = renderButton();
    scrollWindowTo(VIEWPORT * 3);

    fireEvent.click(button);

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
    expect(document.activeElement).toBe(title);
  });

  it('should jump to the top instantly when the reader prefers reduced motion', () => {
    stubReducedMotion(true);
    const { button } = renderButton();
    scrollWindowTo(VIEWPORT * 3);

    fireEvent.click(button);

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'instant',
    });
  });
});
