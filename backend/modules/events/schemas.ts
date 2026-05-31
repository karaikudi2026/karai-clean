import { z } from "zod";
import { paginationQuerySchema } from "../../utils/pagination";

export const listEventsQuerySchema = paginationQuerySchema.extend({
  upcoming_only: z.coerce.boolean().default(true),
});

export const createEventSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(5000),
  image_url: z.string().url().optional(),
  event_date: z.string().date(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  address: z.string().min(5).max(500),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  is_published: z.boolean().default(false),
  push_scheduled_at: z.string().datetime().optional(),
});

export const updateEventSchema = createEventSchema.partial();

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type ListEventsQuery = z.infer<typeof listEventsQuerySchema>;
