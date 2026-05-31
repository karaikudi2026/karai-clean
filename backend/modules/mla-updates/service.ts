import { AppError } from "../../utils/errors";
import { buildPaginationMeta } from "../../utils/pagination";
import type { PaginationQuery } from "../../utils/pagination";
import { mlaUpdatesRepository } from "./repository";
import type { CreateMlaUpdateInput, UpdateMlaUpdateInput } from "./schemas";

export const mlaUpdatesService = {
  async listPublic(query: PaginationQuery) {
    const { data, count } = await mlaUpdatesRepository.listPublished(query);
    return {
      items: data,
      meta: buildPaginationMeta(count, query),
    };
  },

  async getPublic(id: string) {
    const item = await mlaUpdatesRepository.getById(id);
    if (!item) throw AppError.notFound("MLA update");
    return item;
  },

  async listAdmin(query: PaginationQuery) {
    const { data, count } = await mlaUpdatesRepository.listAdmin(query);
    return {
      items: data,
      meta: buildPaginationMeta(count, query),
    };
  },

  async create(input: CreateMlaUpdateInput, adminId: string) {
    return mlaUpdatesRepository.create(input, adminId);
  },

  async update(id: string, input: UpdateMlaUpdateInput) {
    return mlaUpdatesRepository.update(id, input);
  },

  async remove(id: string) {
    await mlaUpdatesRepository.softDelete(id);
  },
};
