export interface ISecurityHeader {
  key: string;
  value: string;
}

export interface IGetSecurityHeadersOptions {
  isProduction: boolean;
}

function buildContentSecurityPolicy({
  isProduction,
}: IGetSecurityHeadersOptions): string {
  return [
    "default-src 'self'",
    [
      "script-src 'self' 'unsafe-inline'",
      // React dev mode uses eval() for debugging; never used in production builds.
      !isProduction && "'unsafe-eval'",
      'https://www.googletagmanager.com https://cdn.jsdelivr.net',
    ]
      .filter(Boolean)
      .join(' '),
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://api.iconify.design https://api.unisvg.com https://api.simplesvg.com",
    "frame-ancestors 'none'",
  ].join('; ');
}

export function getSecurityHeaders(
  options: IGetSecurityHeadersOptions,
): ISecurityHeader[] {
  return [
    {
      key: 'Content-Security-Policy',
      value: buildContentSecurityPolicy(options),
    },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  ];
}
