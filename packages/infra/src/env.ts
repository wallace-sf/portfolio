export const env = {
  get RESEND_API_KEY() {
    return process.env['RESEND_API_KEY']!;
  },
  get CONTACT_EMAIL_TO() {
    return process.env['CONTACT_EMAIL_TO']!;
  },
  get CONTACT_EMAIL_FROM() {
    return process.env['CONTACT_EMAIL_FROM']!;
  },
  get ADMIN_EMAIL() {
    return process.env['ADMIN_EMAIL'] ?? 'admin@portfolio.dev';
  },
};
