/**
 * @vitest-environment jsdom
 */
import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ReadingProgress } from '~features/blog/ReadingProgress';

const VIEWPORT = 800;

/** Mounts the target whose box is `height` tall, `top` px below the viewport top. */
function mountTarget(top: number, height: number) {
  const element = document.createElement('div');
  element.id = 'post-body';
  element.getBoundingClientRect = () => ({ top, height }) as DOMRect;
  document.body.appendChild(element);
}

/** The target scrolled to `top`, then the window reports the scroll. */
function scrollTo(top: number) {
  const element = document.getElementById('post-body') as HTMLElement;
  const { height } = element.getBoundingClientRect();
  element.getBoundingClientRect = () => ({ top, height }) as DOMRect;
  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });
}

const renderBar = () =>
  render(<ReadingProgress targetId="post-body" />).container
    .firstElementChild as HTMLElement;

beforeEach(() => {
  vi.stubGlobal('innerHeight', VIEWPORT);
  vi.stubGlobal('requestAnimationFrame', (update: FrameRequestCallback) => {
    update(0);
    return 0;
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  document.body.innerHTML = '';
});

describe('ReadingProgress', () => {
  it('should grow from 0 above the target to 1 at its end when the reader scrolls', () => {
    mountTarget(300, 2800);
    const bar = renderBar();
    expect(bar.style.transform).toBe('scaleX(0)');

    scrollTo(-1000);
    expect(bar.style.transform).toBe('scaleX(0.5)');

    scrollTo(-2000);
    expect(bar.style.transform).toBe('scaleX(1)');

    scrollTo(-5000);
    expect(bar.style.transform).toBe('scaleX(1)');
  });

  it('should be full once the target is scrolled into view when it is shorter than the viewport', () => {
    mountTarget(1000, 400);
    const bar = renderBar();
    expect(bar.style.transform).toBe('scaleX(0)');

    scrollTo(200);
    expect(bar.style.transform).toBe('scaleX(1)');
  });

  it('should be hidden from assistive technology and not animate when motion is reduced', () => {
    mountTarget(0, 2000);
    const bar = renderBar();

    expect(bar).toHaveAttribute('aria-hidden', 'true');
    expect(bar).toHaveClass('motion-reduce:transition-none');
  });
});
