export function validateEnv(vars: readonly string[]): void {
  const missing = vars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. Please set them in your .env file.`,
    );
  }
}
