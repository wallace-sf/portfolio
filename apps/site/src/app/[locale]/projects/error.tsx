'use client';

import { ErrorView } from '~features/shared/ErrorView';

interface ProjectsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProjectsError({ reset }: ProjectsErrorProps) {
  return <ErrorView reset={reset} />;
}
