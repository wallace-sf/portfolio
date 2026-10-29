'use client';

import { useCallback, useRef } from 'react';

import { Icon } from '@repo/ui/Imagery';
import classNames from 'classnames';

import { useScrollFrame } from '~/hooks/useScrollFrame';

export interface IBackToTopProps {
  /** Accessible name, e.g. "Back to top". */
  label: string;
  /** Id of the element focused once back at the top (the post title). */
  focusTargetId: string;
}

/** Viewport heights the reader must scroll before the button shows. */
const SHOW_AFTER_VIEWPORTS = 2;

/** Classes of the hidden state: `invisible` keeps it out of the tab order and the a11y tree. */
const HIDDEN = ['invisible', 'opacity-0', 'translate-y-2'];

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * A floating "back to top" button, shown once the reader is well into the
 * post. Scrolls to the top and moves keyboard focus to `focusTargetId`, so the
 * next Tab continues from the top instead of the bottom of the page.
 * Visibility is toggled through classes on the element, not React state, so
 * scrolling never re-renders.
 */
export function BackToTop({ label, focusTargetId }: IBackToTopProps) {
  const button = useRef<HTMLButtonElement>(null);

  const update = useCallback(() => {
    const hidden = window.scrollY < window.innerHeight * SHOW_AFTER_VIEWPORTS;
    HIDDEN.forEach((name) => button.current?.classList.toggle(name, hidden));
  }, []);

  useScrollFrame(update);

  const backToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? 'instant' : 'smooth',
    });
    document.getElementById(focusTargetId)?.focus({ preventScroll: true });
  }, [focusTargetId]);

  return (
    <button
      ref={button}
      type="button"
      aria-label={label}
      title={label}
      onClick={backToTop}
      className={classNames(
        HIDDEN,
        'fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 lg:right-8 lg:bottom-8',
        'flex h-11 w-11 items-center justify-center rounded-full',
        'bg-surface-raised shadow-drop-md hover:bg-surface-interactive',
        'transition-[opacity,transform,visibility,background-color] duration-200 motion-reduce:transition-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
      )}
    >
      <Icon
        icon="ic:round-arrow-upward"
        aria-hidden="true"
        className="text-2xl text-content-secondary"
      />
    </button>
  );
}
