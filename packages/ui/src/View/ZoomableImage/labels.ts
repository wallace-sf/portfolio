/**
 * Labels of the image zoom viewer. Kept out of the `'use client'` entry so the
 * Server Component `Markdown` can read the defaults (a client module's exports
 * are only references on the server).
 */
export interface ZoomableImageLabels {
  /** Screen-reader hint on the inline image, e.g. "Open larger view". */
  zoom: string;
  /** Accessible name of the viewer's close button. */
  close: string;
}

export const DEFAULT_ZOOMABLE_IMAGE_LABELS: ZoomableImageLabels = {
  zoom: 'Open larger view',
  close: 'Close',
};
