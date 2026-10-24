/**
 * Contact form validation schemas.
 */
import { z } from "zod";
import { isValidPhone } from "../../utils/phone";

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email address").max(254),
  subject: z.string().trim().min(3, "Subject is required").max(200),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(5000),
  phone: z.string().trim().refine(isValidPhone, "Enter a valid phone number").optional(),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
