'use client';

import { ErrorView } from '~features/shared/ErrorView';

interface HomeErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function HomeError({ reset }: HomeErrorProps) {
  return <ErrorView reset={reset} />;
}
