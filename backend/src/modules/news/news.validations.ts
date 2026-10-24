/**
 * News module validation schemas.
 */
import { z } from "zod";

export const newsArticleSchema = z.object({
  title: z.string().trim().min(3, "Title is required").max(200),
  slug: z
    .string()
    .trim()
    .min(3, "Slug is required")
    .max(220)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must contain lowercase letters, numbers, and hyphens"),
  summary: z.string().trim().max(500).optional().nullable(),
  content: z.string().trim().min(10, "Content must be at least 10 characters"),
  coverImageUrl: z.string().trim().url("Cover image URL must be valid").optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
});

export const updateNewsArticleSchema = newsArticleSchema.partial();

export type NewsArticleInput = z.infer<typeof newsArticleSchema>;
export type UpdateNewsArticleInput = z.infer<typeof updateNewsArticleSchema>;
