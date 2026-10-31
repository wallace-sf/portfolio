'use client';

import { useCallback, useEffect, useRef, type MouseEvent } from 'react';

import { Icon } from '@iconify/react';
import { createPortal } from 'react-dom';
import { useBoolean } from 'usehooks-ts';

import {
  DEFAULT_ZOOMABLE_IMAGE_LABELS,
  type ZoomableImageLabels,
} from './labels';

export interface IZoomableImageProps {
  src?: string;
  alt?: string;
  title?: string;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'auto' | 'sync';
  labels?: ZoomableImageLabels;
}

/**
 * A Markdown image that opens full size in a native modal `<dialog>` (focus
 * trap, Esc and backdrop for free). The dialog is portalled to `<body>` —
 * the image sits inside a `<p>`, where a `<dialog>` is invalid — and only
 * exists while zoomed: a closed one would still be in the DOM, and browser
 * reader modes, blind to its UA `display: none`, score its caption as page
 * text and pick the wrong container. Closing returns focus to the trigger.
 */
export const ZoomableImage = ({
  src,
  alt = '',
  title,
  loading,
  decoding,
  labels = DEFAULT_ZOOMABLE_IMAGE_LABELS,
}: IZoomableImageProps) => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { value: zoomed, setTrue: zoom, setFalse: unzoom } = useBoolean(false);

  useEffect(() => {
    if (zoomed) dialogRef.current?.showModal();
  }, [zoomed]);

  // Every way out (Esc, close button, backdrop) fires the dialog's `close`.
  const close = useCallback(() => dialogRef.current?.close(), []);
  const onClosed = useCallback(() => {
    unzoom();
    triggerRef.current?.focus();
  }, [unzoom]);
  // The <dialog> box itself is the backdrop: the figure fills its content.
  const closeOnBackdrop = useCallback(
    (event: MouseEvent<HTMLDialogElement>) => {
      if (event.target === event.currentTarget) close();
    },
    [close],
  );

  return (
    <>
      {/* The trigger overlays the image instead of wrapping it: browser reader
          modes (e.g. Firefox's Readability) drop <button>s with their content,
          which would take the image with them. `title` sits on the wrapper so
          its tooltip still shows over the trigger. */}
      <span title={title} className="zoomable-image">
        <img
          src={src}
          alt={alt}
          title={title}
          loading={loading}
          decoding={decoding}
        />
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="dialog"
          onClick={zoom}
          className="zoomable-image-trigger"
        >
          <span className="sr-only">{labels.zoom}</span>
        </button>
      </span>

      {zoomed &&
        createPortal(
          // Backdrop click is a pointer shortcut; Esc (native) is the keyboard one.
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
          <dialog
            ref={dialogRef}
            aria-label={alt || undefined}
            onClick={closeOnBackdrop}
            onClose={onClosed}
            className="zoomable-image-dialog"
          >
            <button
              type="button"
              onClick={close}
              aria-label={labels.close}
              className="zoomable-image-close"
            >
              <Icon icon="material-symbols:close" className="text-2xl" />
            </button>
            <figure>
              <img src={src} alt="" decoding="async" />
              {alt && <figcaption>{alt}</figcaption>}
            </figure>
          </dialog>,
          document.body,
        )}
    </>
  );
};
