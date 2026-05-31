import { z } from "zod";
import { paginationQuerySchema } from "../../utils/pagination";

export const listJobsQuerySchema = paginationQuerySchema.extend({
  search: z.string().max(100).optional(),
  category: z.string().max(50).optional(),
  location: z.string().max(100).optional(),
});

export const createJobSchema = z.object({
  title: z.string().min(3).max(150),
  company_name: z.string().max(150).optional(),
  summary: z.string().min(10).max(2000),
  location: z.string().max(150).optional(),
  category: z.string().max(50).optional(),
  contact_phone: z.string().min(10).max(15).optional(),
  contact_email: z.string().email().optional(),
  apply_link: z.string().url().optional(),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type ListJobsQuery = z.infer<typeof listJobsQuerySchema>;
