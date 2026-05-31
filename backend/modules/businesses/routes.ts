import type { FastifyInstance } from "fastify";
import { sendCreated, sendSuccess } from "../../utils/responses";
import { parseOrThrow } from "../../utils/validators";
import {
  createBusinessSchema,
  listBusinessesQuerySchema,
  moderateBusinessSchema,
} from "./schemas";
import { businessesService } from "./service";

export async function businessesRoutes(app: FastifyInstance) {
  app.get("/categories", async (_request, reply) => {
    const categories = await businessesService.listCategories();
    return sendSuccess(reply, categories);
  });

  app.get("/", async (request, reply) => {
    const query = parseOrThrow(listBusinessesQuerySchema, request.query);
    const items = await businessesService.list(query);
    return sendSuccess(reply, items);
  });

  app.get("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const item = await businessesService.get(id);
    return sendSuccess(reply, item);
  });

  app.post("/", { preHandler: [app.requireAuth] }, async (request, reply) => {
    const body = parseOrThrow(createBusinessSchema, request.body);
    const item = await businessesService.create(body, request.userId!);
    return sendCreated(reply, item);
  });

  app.register(async function adminRoutes(adminApp) {
    adminApp.addHook("preHandler", adminApp.requireContentAdmin);

    adminApp.get("/admin/pending", async (_request, reply) => {
      const items = await businessesService.listPending();
      return sendSuccess(reply, items);
    });

    adminApp.patch("/admin/:id/moderate", async (request, reply) => {
      const { id } = request.params as { id: string };
      const body = parseOrThrow(moderateBusinessSchema, request.body);
      const item = await businessesService.moderate(
        id,
        body.moderation_status,
        body.moderation_notes,
        request.userId!
      );
      return sendSuccess(reply, item);
    });
  });
}
