import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

let ratelimit: Ratelimit | null = null;

function getContactRateLimit(): Ratelimit | null {
  const url = process.env['UPSTASH_REDIS_REST_URL'];
  const token = process.env['UPSTASH_REDIS_REST_TOKEN'];
  if (!url || !token) return null;

  if (!ratelimit) {
    const max = parseInt(process.env['CONTACT_RATE_LIMIT_MAX'] ?? '3', 10);
    ratelimit = new Ratelimit({
      redis: new Redis({ url, token }),
      limiter: Ratelimit.slidingWindow(max, '1 h'),
      analytics: false,
    });
  }

  return ratelimit;
}

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

export async function checkContactRateLimit(
  ip: string,
): Promise<RateLimitResult> {
  const limiter = getContactRateLimit();
  if (!limiter) return { success: true, limit: 0, remaining: 0, reset: 0 };
  return limiter.limit(ip);
}
