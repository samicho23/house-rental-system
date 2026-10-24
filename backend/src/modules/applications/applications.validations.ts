/**
 * Applications module validation schemas.
 */
import { z } from "zod";

export const applicationSchema = z.object({
  propertyId: z.string().min(1, "Property is required"),
  message: z.string().max(1000).optional(),
  moveInDate: z.string().optional().nullable(),
  occupants: z.coerce.number().int().min(1).max(20).default(1),
  phone: z.string().optional(),
});

export const applicationDecisionSchema = z.object({
  action: z.enum(["APPROVE", "REJECT", "WITHDRAW"]),
  decisionNote: z.string().max(500).optional(),
  // used when approving -> create the lease
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  deposit: z.coerce.number().min(0).optional(),
  paymentDay: z.coerce.number().int().min(1).max(28).optional(),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;
export type ApplicationDecisionInput = z.infer<typeof applicationDecisionSchema>;
