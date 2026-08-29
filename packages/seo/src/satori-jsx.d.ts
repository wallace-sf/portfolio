/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars */
import 'react';

/**
 * `next/og` (Satori) accepts a Tailwind-like `tw` prop on intrinsic elements.
 * `renderOgImage` produces that JSX without importing `next/og`, so the
 * augmentation is declared here instead of inherited from it.
 */
declare module 'react' {
  interface HTMLAttributes<T> {
    tw?: string;
  }
}
