export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  roles: string[]; // ex: ['ROLE_USER'], ['ROLE_ADMIN']
  is_verified: boolean;
  is_blocked: boolean;
  created_at: string;         // ISO date
  updated_at?: string;        // ISO date (nullable)
  cgu_accepted: string;    // ISO date
  token?: string;
  password?: string;          // ⚠️ pour le mock uniquement (jamais renvoyé par l'API réelle)
}
