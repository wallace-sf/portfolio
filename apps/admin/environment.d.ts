import 'next';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly SITE_API_URL: string;
      readonly NEXT_PUBLIC_SITE_API_URL: string;
    }
  }
}
