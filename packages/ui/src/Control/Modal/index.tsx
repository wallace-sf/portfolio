'use client';

import {
  FC,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useId,
  useRef,
} from 'react';

import { Icon } from '@iconify/react';
import { createPortal } from 'react-dom';
import {
  useEventListener,
  useOnClickOutside,
  useScrollLock,
} from 'usehooks-ts';

export interface IModalProps {
  open: boolean;
  onClose: () => void;
  closeLabel: string;
  title?: string;
  children: ReactNode;
}

const FOCUSABLE_SELECTORS =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export const Modal: FC<IModalProps> = ({
  open,
  onClose,
  closeLabel,
  title,
  children,
}) => {
  const titleId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useScrollLock({ autoLock: open });
  useOnClickOutside(containerRef as RefObject<HTMLElement>, onClose);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;

      const container = containerRef.current;
      if (!container) return;

      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS),
      );
      if (focusable.length === 0) return;

      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [open, onClose],
  );

  useEventListener('keydown', handleKeyDown);

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      const container = containerRef.current;
      if (container) {
        const first = container.querySelector<HTMLElement>(FOCUSABLE_SELECTORS);
        first?.focus();
      }
    } else {
      previousFocusRef.current?.focus();
    }
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className="bg-surface rounded-xl p-6 w-[calc(100vw-2rem)] lg:w-[642px] max-h-[80vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between gap-2 mb-6">
          {title && (
            <h2
              id={titleId}
              className="text-2xl font-bold text-content-primary"
            >
              {title}
            </h2>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="ml-auto text-content-primary hover:opacity-70 transition-opacity"
          >
            <Icon icon="material-symbols:close" className="text-2xl" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
};
