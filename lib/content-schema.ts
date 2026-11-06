import { z } from "zod";

export const dateSchema = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), "Invalid date string")
  .transform<string>((value) => new Date(value).toISOString());

export const PostSchema = z.object({
  content: z.string(),
  image: z.string().optional(),
  featured: z.boolean().optional().default(false),
  leading: z.boolean().optional().default(false),
  publishedAt: dateSchema,
  seoTitle: z
    .string()
    .trim()
    .min(1, "Post SEO title must not be empty")
    .optional(),
  summary: z.string().trim().min(1, "Post summary must not be empty"),
  title: z.string(),
  updatedAt: dateSchema.optional(),
});
