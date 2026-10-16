import { useCallback, useState } from 'react';

import { useScrollFrame } from '~/hooks/useScrollFrame';

/**
 * How far below the viewport top a heading counts as "reached": clears the
 * fixed mobile header (68px) with some room, and matches the anchors'
 * `scroll-margin-top` closely enough that a TOC jump activates its entry.
 */
const ACTIVE_OFFSET = 96;

const reached = (id: string): boolean => {
  const element = document.getElementById(id);
  return (
    element !== null && element.getBoundingClientRect().top <= ACTIVE_OFFSET
  );
};

/**
 * The id of the last heading whose top has crossed `ACTIVE_OFFSET`, or
 * `undefined` above the first one. Recomputed from positions on scroll and
 * resize (`useScrollFrame`). An `IntersectionObserver` is not enough: it only
 * fires on intersection changes, so an anchor jump that carries a heading from
 * below the viewport straight past the offset never reports.
 */
export function useActiveHeading(ids: string[]): string | undefined {
  const [active, setActive] = useState<string>();
  const key = ids.join(' ');

  const update = useCallback(
    () => setActive(key.split(' ').filter(reached).at(-1)),
    [key],
  );
  useScrollFrame(update);

  return active;
}
