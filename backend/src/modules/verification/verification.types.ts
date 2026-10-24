/**
 * Verification module contracts.
 */
export interface VerificationStatus {
  userId: string;
  verified: boolean;
  faydaId: string | null;
  verifiedAt: string | null;
}
