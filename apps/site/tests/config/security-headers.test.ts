import { describe, expect, it } from 'vitest';

import nextConfig from '../../next.config.mjs';

describe('security headers', () => {
  it('should apply CSP, X-Frame-Options, X-Content-Type-Options and Referrer-Policy to every route', async () => {
    const rules = await nextConfig.headers?.();
    const rule = rules?.find((r) => r.source === '/(.*)');
    const keys = rule?.headers.map((h) => h.key);

    expect(keys).toEqual(
      expect.arrayContaining([
        'Content-Security-Policy',
        'X-Frame-Options',
        'X-Content-Type-Options',
        'Referrer-Policy',
      ]),
    );
  });

  it('should deny framing and allow known third-party script/connect origins in the CSP', async () => {
    const rules = await nextConfig.headers?.();
    const rule = rules?.find((r) => r.source === '/(.*)');
    const csp = rule?.headers.find(
      (h) => h.key === 'Content-Security-Policy',
    )?.value;
    const frameOptions = rule?.headers.find(
      (h) => h.key === 'X-Frame-Options',
    )?.value;

    expect(frameOptions).toBe('DENY');
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain('https://www.googletagmanager.com');
    expect(csp).toContain('https://cdn.jsdelivr.net');
    expect(csp).toContain('https://api.iconify.design');
  });
});
