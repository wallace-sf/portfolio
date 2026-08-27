import { getSecurityHeaders } from '~/securityHeaders';

describe('getSecurityHeaders', () => {
  it('should include unsafe-eval in the CSP when not production', () => {
    const headers = getSecurityHeaders({ isProduction: false });
    const csp = headers.find((h) => h.key === 'Content-Security-Policy');

    expect(csp?.value).toContain("'unsafe-eval'");
  });

  it('should not include unsafe-eval in the CSP when production', () => {
    const headers = getSecurityHeaders({ isProduction: true });
    const csp = headers.find((h) => h.key === 'Content-Security-Policy');

    expect(csp?.value).not.toContain("'unsafe-eval'");
  });

  it('should include the shared security headers regardless of environment', () => {
    const headers = getSecurityHeaders({ isProduction: true });
    const keys = headers.map((h) => h.key);

    expect(keys).toEqual([
      'Content-Security-Policy',
      'X-Frame-Options',
      'X-Content-Type-Options',
      'Referrer-Policy',
    ]);
  });

  it('should scope the CSP to self and known analytics/CDN origins', () => {
    const headers = getSecurityHeaders({ isProduction: true });
    const csp = headers.find((h) => h.key === 'Content-Security-Policy');

    expect(csp?.value).toContain("default-src 'self'");
    expect(csp?.value).toContain('https://www.googletagmanager.com');
    expect(csp?.value).toContain('https://api.iconify.design');
  });
});
