'use client';

import { ErrorView } from '~features/shared/ErrorView';

interface BlogErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function BlogError({ reset }: BlogErrorProps) {
  return <ErrorView reset={reset} />;
}
