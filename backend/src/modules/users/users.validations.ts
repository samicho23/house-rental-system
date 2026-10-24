/**
 * Users (admin) module validation schemas.
 */
import { z } from "zod";

export const adminUserActionSchema = z.object({
  id: z.string().min(1, "User id is required"),
  action: z.enum(["SUSPEND", "ACTIVATE", "SET_ROLE"]),
  role: z.enum(["TENANT", "LANDLORD", "ADMIN"]).optional(),
});

export type AdminUserActionInput = z.infer<typeof adminUserActionSchema>;
