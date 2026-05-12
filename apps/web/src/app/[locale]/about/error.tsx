'use client';

import { ErrorView } from '~components/View';

interface AboutErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AboutError({ reset }: AboutErrorProps) {
  return <ErrorView reset={reset} />;
}
