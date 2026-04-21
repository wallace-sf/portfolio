export type AuthSession = {
  /** Short-lived JWT access token. */
  accessToken: string;
  /** Opaque refresh token used to obtain a new session. */
  refreshToken: string;
  /** Session expiry as a Unix timestamp (seconds). */
  expiresAt: number;
};
