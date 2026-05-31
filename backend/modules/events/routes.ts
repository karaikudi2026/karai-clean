import type { FastifyInstance } from "fastify";
import { sendCreated, sendSuccess } from "../../utils/responses";
import { parseOrThrow } from "../../utils/validators";
import {
  createEventSchema,
  listEventsQuerySchema,
  updateEventSchema,
} from "./schemas";
import { eventsService } from "./service";

export async function eventsRoutes(app: FastifyInstance) {
  app.get("/", async (request, reply) => {
    const query = parseOrThrow(listEventsQuerySchema, request.query);
    const result = await eventsService.list(query);
    return sendSuccess(reply, result.items, 200, result.meta);
  });

  app.get("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const item = await eventsService.get(id);
    return sendSuccess(reply, item);
  });

  app.register(async function adminRoutes(adminApp) {
    adminApp.addHook("preHandler", adminApp.requireContentAdmin);

    adminApp.post("/admin", async (request, reply) => {
      const body = parseOrThrow(createEventSchema, request.body);
      const item = await eventsService.create(body, request.userId!);
      return sendCreated(reply, item);
    });

    adminApp.patch("/admin/:id", async (request, reply) => {
      const { id } = request.params as { id: string };
      const body = parseOrThrow(updateEventSchema, request.body);
      const item = await eventsService.update(id, body);
      return sendSuccess(reply, item);
    });

    adminApp.post("/admin/:id/publish", async (request, reply) => {
      const { id } = request.params as { id: string };
      const item = await eventsService.publishAndNotify(id, request.userId!);
      return sendSuccess(reply, item);
    });

    adminApp.delete("/admin/:id", async (request, reply) => {
      const { id } = request.params as { id: string };
      await eventsService.remove(id);
      return sendSuccess(reply, { deleted: true });
    });
  });
}
