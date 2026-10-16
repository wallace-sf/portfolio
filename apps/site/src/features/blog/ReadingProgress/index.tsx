'use client';

import { useCallback, useRef } from 'react';

import { useScrollFrame } from '~/hooks/useScrollFrame';

export interface IReadingProgressProps {
  /** Id of the element whose reading progress the bar shows (the post body). */
  targetId: string;
}

/** Empty until the first measurement on mount. */
const INITIAL_STYLE = { transform: 'scaleX(0)' };

const clamp = (value: number) => Math.min(Math.max(value, 0), 1);

/**
 * Share of `element` read: 0 until its top reaches the viewport top, 1 once
 * its bottom reaches the viewport bottom. A target shorter than the viewport
 * is all-or-nothing: read once it fits entirely on screen.
 */
const progressOf = (element: HTMLElement): number => {
  const { top, height } = element.getBoundingClientRect();
  const distance = height - window.innerHeight;

  if (distance <= 0) return top + height <= window.innerHeight ? 1 : 0;
  return clamp(-top / distance);
};

/**
 * A thin bar fixed to the top of the viewport showing how much of the post
 * has been read. Decorative (the scrollbar already conveys position), so it is
 * hidden from assistive technology. Updated through `transform` on the
 * element, not React state, so scrolling never re-renders or triggers layout.
 */
export function ReadingProgress({ targetId }: IReadingProgressProps) {
  const bar = useRef<HTMLDivElement>(null);

  const update = useCallback(() => {
    const target = document.getElementById(targetId);
    if (!bar.current || !target) return;
    bar.current.style.transform = `scaleX(${progressOf(target)})`;
  }, [targetId]);

  useScrollFrame(update);

  return (
    <div
      ref={bar}
      aria-hidden="true"
      style={INITIAL_STYLE}
      className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-brand-primary transition-transform duration-100 ease-linear motion-reduce:transition-none"
    />
  );
}
