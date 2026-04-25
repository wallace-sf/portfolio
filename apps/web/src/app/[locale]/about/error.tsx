'use client';

import { ErrorView } from '~components/View';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AboutError({ reset }: ErrorProps) {
  return <ErrorView reset={reset} />;
}
