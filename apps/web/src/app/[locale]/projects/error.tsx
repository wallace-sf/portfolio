'use client';

import { ErrorView } from '~components/View';

interface ProjectsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProjectsError({ reset }: ProjectsErrorProps) {
  return <ErrorView reset={reset} />;
}
