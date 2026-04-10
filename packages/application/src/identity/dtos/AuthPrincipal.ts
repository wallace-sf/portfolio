export type AuthPrincipal = {
  /** Stable IdP subject identifier (e.g. Supabase `sub`). */
  id: string;
  email: string;
  role: string;
};
