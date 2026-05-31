import { z } from "zod";
import { paginationQuerySchema } from "../../utils/pagination";
import { MODERATION_STATUSES } from "@mykaraikudi/constants";

export const listBusinessesQuerySchema = paginationQuerySchema.extend({
  category_id: z.string().uuid().optional(),
  location: z.string().max(100).optional(),
  search: z.string().max(100).optional(),
  seed: z.string().optional(),
});

export const createBusinessSchema = z.object({
  category_id: z.string().uuid(),
  name: z.string().min(2).max(150),
  address: z.string().min(5).max(500),
  phone: z.string().min(10).max(15),
  email: z.string().email().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  summary: z.string().min(10).max(1000),
  image_url: z.string().url().optional(),
  location_area: z.string().max(100).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const updateBusinessSchema = createBusinessSchema.partial();

export const moderateBusinessSchema = z.object({
  moderation_status: z.enum(MODERATION_STATUSES),
  moderation_notes: z.string().max(500).optional(),
});

export type ListBusinessesQuery = z.infer<typeof listBusinessesQuerySchema>;
export type CreateBusinessInput = z.infer<typeof createBusinessSchema>;
