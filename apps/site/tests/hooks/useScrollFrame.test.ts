/**
 * @vitest-environment jsdom
 */
import { renderHook } from '@testing-library/react';

import { useScrollFrame } from '~/hooks/useScrollFrame';

const fire = (type: 'scroll' | 'resize') =>
  window.dispatchEvent(new Event(type));

beforeEach(() => {
  vi.stubGlobal('requestAnimationFrame', (update: FrameRequestCallback) => {
    update(0);
    return 0;
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('useScrollFrame', () => {
  it('should run the update on mount and on every scroll or resize when mounted', () => {
    const update = vi.fn();
    renderHook(() => useScrollFrame(update));

    fire('scroll');
    fire('resize');

    expect(update).toHaveBeenCalledTimes(3);
  });

  it('should stop running the update when unmounted', () => {
    const update = vi.fn();
    const { unmount } = renderHook(() => useScrollFrame(update));

    unmount();
    fire('scroll');
    fire('resize');

    expect(update).toHaveBeenCalledTimes(1);
  });
});
