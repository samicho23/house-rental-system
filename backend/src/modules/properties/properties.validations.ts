/**
 * Properties module validation schemas.
 */
import { z } from "zod";

export const propertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Describe the property in at least 20 characters"),
  propertyType: z.enum(["HOUSE", "APARTMENT", "CONDO", "SINGLE_ROOM", "STUDIO"]),
  city: z.string().min(2, "City is required"),
  subCity: z.string().optional(),
  address: z.string().optional(),
  price: z.coerce.number().positive("Rent must be greater than zero"),
  bedrooms: z.coerce.number().int().min(0).max(20),
  bathrooms: z.coerce.number().int().min(0).max(20),
  areaSqm: z.coerce.number().int().positive().optional().nullable(),
  furnished: z.coerce.boolean().optional().default(false),
  hasParking: z.coerce.boolean().optional().default(false),
  hasWater: z.coerce.boolean().optional().default(true),
  amenities: z.array(z.string()).optional().default([]),
  photos: z.array(z.string()).optional().default([]),
  availableFrom: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "UNPUBLISHED"]).optional(),
});

export const propertyUpdateSchema = propertySchema.partial().extend({
  approvalStatus: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
  rejectionReason: z.string().max(300).optional(),
});

export type PropertyInput = z.infer<typeof propertySchema>;
export type PropertyUpdateInput = z.infer<typeof propertyUpdateSchema>;
