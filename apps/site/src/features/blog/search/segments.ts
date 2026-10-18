import type { MarkRange } from './bodyExcerpt';

export interface ISegment {
  text: string;
  marked: boolean;
}

/**
 * `text` split at the mark boundaries, in order: plain and marked runs
 * alternate and joining them gives back `text`. Empty runs are dropped.
 * `marks` must be sorted and non-overlapping, as `bodyExcerpt` returns them.
 */
export function toSegments(
  text: string,
  marks: readonly MarkRange[],
): ISegment[] {
  const bounds = [0, ...marks.flat(), text.length];

  return bounds
    .slice(0, -1)
    .map((from, i) => ({
      text: text.slice(from, bounds[i + 1]),
      marked: i % 2 === 1,
    }))
    .filter((segment) => segment.text.length > 0);
}
