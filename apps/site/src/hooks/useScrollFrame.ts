import { useEffect } from 'react';

/**
 * Runs `update` on mount and then at most once per animation frame while the
 * window scrolls or resizes (passive listeners). Pass a stable callback
 * (`useCallback`), or the listeners are re-attached on every render.
 */
export function useScrollFrame(update: () => void): void {
  useEffect(() => {
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [update]);
}
