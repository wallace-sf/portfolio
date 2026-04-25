import type {
  AuthCookieApi,
  CookieSetOptions,
} from '@repo/application/identity';
import { cookies } from 'next/headers';

export function createNextAuthCookieApi(): AuthCookieApi {
  const jar = cookies();
  return {
    get(name: string): string | undefined {
      return jar.get(name)?.value;
    },
    set(name: string, value: string, options?: CookieSetOptions): void {
      jar.set(name, value, options ?? {});
    },
    delete(name: string): void {
      jar.delete(name);
    },
  };
}
