/**
 * Leases module validation schemas.
 */
import { z } from "zod";

export const leaseUpdateSchema = z.object({
  status: z.enum(["ACTIVE", "ENDED"]).optional(),
  monthlyRent: z.coerce.number().positive().optional(),
  endDate: z.string().optional(),
  notes: z.string().max(500).optional(),
});

export type LeaseUpdateInput = z.infer<typeof leaseUpdateSchema>;
