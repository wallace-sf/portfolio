'use client';

import { ErrorView } from '~components/View';

interface ProjectDetailErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProjectDetailError({ reset }: ProjectDetailErrorProps) {
  return <ErrorView reset={reset} />;
}
