import 'next';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly NEXT_PUBLIC_CONTACT_EMAIL: string;
      readonly NEXT_PUBLIC_CONTACT_NUMBER: string;
      readonly NEXT_PUBLIC_GITHUB_URL: string;
      readonly NEXT_PUBLIC_LINKEDIN_URL: string;
      readonly NEXT_PUBLIC_RESUME_URL_EN_US: string;
      readonly NEXT_PUBLIC_RESUME_URL_PT_BR: string;
      readonly NEXT_PUBLIC_RESUME_URL_ES: string;
      readonly NEXT_PUBLIC_WHATSAPP_URL: string;
    }
  }
}
