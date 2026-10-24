/**
 * Verification request validation schemas.
 */
import { z } from "zod";

export const verificationRequestSchema = z.object({
  fin: z.string().trim().min(6, "Enter your Fayda Identification Number (FIN)"),
  consent: z.literal(true, { message: "Consent is required to share your data" }),
});

export type VerificationRequestInput = z.infer<typeof verificationRequestSchema>;
