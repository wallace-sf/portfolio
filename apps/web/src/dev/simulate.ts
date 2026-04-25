const isDev = process.env.NODE_ENV === 'development';

export async function simulateLoading(ms: number): Promise<void> {
  if (!isDev) return;
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export function simulateError(message = 'Simulated error — dev only'): never {
  if (!isDev) throw new Error('simulateError called outside development');
  throw new Error(message);
}
