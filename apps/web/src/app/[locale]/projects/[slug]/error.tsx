'use client';

import { ErrorView } from '~features/shared/ErrorView';

interface ProjectDetailErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProjectDetailError({ reset }: ProjectDetailErrorProps) {
  return <ErrorView reset={reset} />;
}
