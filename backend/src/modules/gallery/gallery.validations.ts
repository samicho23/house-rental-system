/**
 * Property gallery validation schemas.
 */
import { z } from "zod";

export const galleryPhotoSchema = z.object({
  url: z.string().trim().url("Image URL must be valid"),
  isCover: z.boolean().optional().default(false),
  order: z.number().int().min(0).optional(),
});

export const galleryReorderSchema = z.object({
  photoIds: z.array(z.string().min(1)).min(1, "At least one photo is required"),
});

export type GalleryPhotoInput = z.infer<typeof galleryPhotoSchema>;
export type GalleryReorderInput = z.infer<typeof galleryReorderSchema>;
