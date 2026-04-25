'use client';

import { ErrorView } from '~components/View';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProjectsError({ reset }: ErrorProps) {
  return <ErrorView reset={reset} />;
}
