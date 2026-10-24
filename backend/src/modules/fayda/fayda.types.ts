/**
 * Fayda verification contracts.
 */
export interface FaydaClaims {
  fin: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  city: string;
  subCity: string;
  photoUrl?: string;
  verifiedAt: string;
}

export interface FaydaVerificationResult {
  claims: FaydaClaims;
  accountExists: boolean;
  existingRole: string | null;
}
