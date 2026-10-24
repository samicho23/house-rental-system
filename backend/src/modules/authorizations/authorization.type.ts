/**
 * Authorization module contracts.
 */
export type AuthorizationRole = "TENANT" | "LANDLORD" | "ADMIN";

export interface AuthorizationResult {
  userId: string;
  role: string;
  permissions: string[];
}
