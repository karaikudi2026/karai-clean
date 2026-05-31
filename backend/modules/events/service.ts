import { AppError } from "../../utils/errors";
import { buildPaginationMeta } from "../../utils/pagination";
import { notificationService } from "../../services/notification.service";
import { eventsRepository } from "./repository";
import type { CreateEventInput, ListEventsQuery } from "./schemas";

export const eventsService = {
  async list(query: ListEventsQuery) {
    const { data, count } = await eventsRepository.listPublic(query);
    return { items: data, meta: buildPaginationMeta(count, query) };
  },

  async get(id: string) {
    const item = await eventsRepository.getById(id);
    if (!item) throw AppError.notFound("Event");
    return item;
  },

  create(input: CreateEventInput, adminId: string) {
    return eventsRepository.create(input, adminId);
  },

  update(id: string, input: Partial<CreateEventInput>) {
    return eventsRepository.update(id, input);
  },

  async publishAndNotify(id: string, adminId: string) {
    const event = await eventsRepository.update(id, {
      is_published: true,
    });

    await notificationService.createAndQueue({
      title: event.title,
      body: event.description.slice(0, 200),
      category: "event",
      targetAudience: "all",
      payload: { event_id: id, type: "event_published" },
      createdBy: adminId,
    });

    return event;
  },

  remove(id: string) {
    return eventsRepository.softDelete(id);
  },
};
