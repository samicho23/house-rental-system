/**
 * Authentication contracts shared by JWT, middleware, and auth modules.
 */
export interface AuthTokenPayload {
  sub: string;
  role: string;
  name: string;
  iat: number;
  exp: number;
}

export type AuthenticatedUser = {
  id: string;
  role: string;
  name: string;
};
