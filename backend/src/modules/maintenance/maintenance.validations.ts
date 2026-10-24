/**
 * Maintenance module validation schemas.
 */
import { z } from "zod";

export const maintenanceSchema = z.object({
  propertyId: z.string().min(1),
  title: z.string().min(5, "Give the request a short title"),
  description: z.string().min(10, "Describe the problem"),
  category: z
    .enum(["PLUMBING", "ELECTRICAL", "WATER", "STRUCTURAL", "GENERAL"])
    .default("GENERAL"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
});

export const maintenanceUpdateSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]),
  response: z.string().max(500).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
});

export type MaintenanceInput = z.infer<typeof maintenanceSchema>;
export type MaintenanceUpdateInput = z.infer<typeof maintenanceUpdateSchema>;
