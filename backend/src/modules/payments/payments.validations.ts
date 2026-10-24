/**
 * Payments module validation schemas.
 */
import { z } from "zod";

export const paymentSchema = z.object({
  leaseId: z.string().min(1, "Lease is required"),
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  dueDate: z.string().min(1, "Due date is required"),
  paidDate: z.string().optional().nullable(),
  method: z.enum(["CASH", "BANK_TRANSFER", "MOBILE_MONEY", "CHEQUE"]).default("CASH"),
  status: z.enum(["PENDING", "PAID", "OVERDUE"]).default("PENDING"),
  periodLabel: z.string().optional(),
  note: z.string().max(300).optional(),
});

export const paymentActionSchema = z.object({
  action: z.enum(["MARK_PAID", "REOPEN"]),
  method: z.enum(["CASH", "BANK_TRANSFER", "MOBILE_MONEY", "CHEQUE"]).optional(),
  note: z.string().max(300).optional(),
});

export type PaymentInput = z.infer<typeof paymentSchema>;
export type PaymentActionInput = z.infer<typeof paymentActionSchema>;
