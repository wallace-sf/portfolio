'use client';

import { ErrorView } from '~components/View';

interface HomeErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function HomeError({ reset }: HomeErrorProps) {
  return <ErrorView reset={reset} />;
}
