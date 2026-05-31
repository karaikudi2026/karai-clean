import { z } from "zod";

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

export function getPaginationRange(query: PaginationQuery) {
  const offset = (query.page - 1) * query.limit;
  return { offset, limit: query.limit };
}

export function buildPaginationMeta(
  total: number,
  query: PaginationQuery
) {
  return {
    page: query.page,
    limit: query.limit,
    total,
    totalPages: Math.ceil(total / query.limit) || 0,
  };
}
