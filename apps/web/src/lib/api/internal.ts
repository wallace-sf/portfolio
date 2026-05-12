import { headers } from 'next/headers';

export async function getInternalBaseUrl(): Promise<string> {
  const host = (await headers()).get('host') ?? 'localhost:3000';
  return host.includes('localhost') ? `http://${host}` : `https://${host}`;
}
