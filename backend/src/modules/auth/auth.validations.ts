/**
 * Auth module validation schemas.
 */
import { z } from "zod";
import { isValidPhone } from "../../utils/phone";

export const faydaVerifySchema = z.object({
  fin: z.string().min(6, "Enter your Fayda Identification Number (FIN)"),
  consent: z.literal(true, { message: "Consent is required to share your data" }),
});

export const registerSchema = z.object({
  faydaId: z.string().min(4, "Fayda verification is required").optional().nullable(),
  faydaVerified: z.boolean().optional().default(false),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().refine(isValidPhone, "Enter a valid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  gender: z.string().optional(),
  dateOfBirth: z.string().optional(),
  city: z.string().optional(),
  subCity: z.string().optional(),
  role: z.enum(["TENANT", "LANDLORD"], {
    message: "Choose tenant or landlord",
  }),
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type FaydaVerifyInput = z.infer<typeof faydaVerifySchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
