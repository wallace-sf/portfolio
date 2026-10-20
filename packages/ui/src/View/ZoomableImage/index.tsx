'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from 'react';

import { Icon } from '@iconify/react';
import { createPortal } from 'react-dom';

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
 * the image sits inside a `<p>`, where a `<dialog>` is invalid — so it only
 * exists after mount. Closing returns focus to the inline image.
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const open = useCallback(() => dialogRef.current?.showModal(), []);
  const close = useCallback(() => dialogRef.current?.close(), []);
  const restoreFocus = useCallback(() => triggerRef.current?.focus(), []);
  // The <dialog> box itself is the backdrop: the figure fills its content.
  const closeOnBackdrop = useCallback(
    (event: MouseEvent<HTMLDialogElement>) => {
      if (event.target === event.currentTarget) close();
    },
    [close],
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        onClick={open}
        className="zoomable-image-trigger"
      >
        <img
          src={src}
          alt={alt}
          title={title}
          loading={loading}
          decoding={decoding}
        />
        <span className="sr-only">{labels.zoom}</span>
      </button>

      {mounted &&
        createPortal(
          // Backdrop click is a pointer shortcut; Esc (native) is the keyboard one.
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
          <dialog
            ref={dialogRef}
            aria-label={alt || undefined}
            onClick={closeOnBackdrop}
            onClose={restoreFocus}
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
