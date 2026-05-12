import { isDev } from './isDev';

export async function simulateLoading(ms: number): Promise<void> {
  if (!isDev()) return;
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export function simulateError(message = 'Simulated error — dev only'): void {
  if (!isDev()) return;
  throw new Error(message);
}

export async function applyDevSimulations(params?: {
  loading?: string;
  error?: string;
}): Promise<void> {
  if (params?.loading) await simulateLoading(Number(params.loading) || 2000);
  if (params?.error) simulateError();
}
