import { AppError } from "../../utils/errors";
import { businessesRepository } from "./repository";
import type {
  CreateBusinessInput,
  ListBusinessesQuery,
} from "./schemas";

export const businessesService = {
  list(query: ListBusinessesQuery) {
    return businessesRepository.listPublic(query);
  },

  listCategories() {
    return businessesRepository.listCategories();
  },

  async get(id: string) {
    const item = await businessesRepository.getById(id);
    if (!item) throw AppError.notFound("Business");
    return item;
  },

  create(input: CreateBusinessInput, userId: string) {
    return businessesRepository.create(input, userId);
  },

  listPending() {
    return businessesRepository.listPendingModeration();
  },

  moderate(
    id: string,
    status: string,
    notes: string | undefined,
    adminId: string
  ) {
    return businessesRepository.moderate(id, status, notes, adminId);
  },
};
