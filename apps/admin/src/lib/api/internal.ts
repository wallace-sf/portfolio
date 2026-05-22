export function getSiteApiUrl(): string {
  return process.env.SITE_API_URL ?? "http://localhost:3000";
}
