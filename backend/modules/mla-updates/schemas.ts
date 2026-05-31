import { z } from "zod";
import { paginationQuerySchema } from "../../utils/pagination";

export const listMlaUpdatesQuerySchema = paginationQuerySchema;

export const createMlaUpdateSchema = z.object({
  title: z.string().min(3).max(200),
  summary: z.string().min(10).max(500),
  content: z.string().optional(),
  image_url: z.string().url().optional(),
  image_alt: z.string().max(200).optional(),
  is_published: z.boolean().default(false),
});

export const updateMlaUpdateSchema = createMlaUpdateSchema.partial();

export type CreateMlaUpdateInput = z.infer<typeof createMlaUpdateSchema>;
export type UpdateMlaUpdateInput = z.infer<typeof updateMlaUpdateSchema>;
