import { AppError } from "../../utils/errors";
import { buildPaginationMeta } from "../../utils/pagination";
import { jobsRepository } from "./repository";
import type { CreateJobInput, ListJobsQuery } from "./schemas";

export const jobsService = {
  async list(query: ListJobsQuery) {
    const { data, count } = await jobsRepository.list(query);
    return { items: data, meta: buildPaginationMeta(count, query) };
  },

  async get(id: string) {
    const item = await jobsRepository.getById(id);
    if (!item) throw AppError.notFound("Job");
    return item;
  },

  create(input: CreateJobInput, userId: string) {
    return jobsRepository.create(input, userId);
  },
};
