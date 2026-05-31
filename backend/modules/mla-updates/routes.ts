import type { FastifyInstance } from "fastify";
import { sendCreated, sendSuccess } from "../../utils/responses";
import { parseOrThrow } from "../../utils/validators";
import {
  createMlaUpdateSchema,
  listMlaUpdatesQuerySchema,
  updateMlaUpdateSchema,
} from "./schemas";
import { mlaUpdatesService } from "./service";

export async function mlaUpdatesRoutes(app: FastifyInstance) {
  app.get("/", async (request, reply) => {
    const query = parseOrThrow(listMlaUpdatesQuerySchema, request.query);
    const result = await mlaUpdatesService.listPublic(query);
    return sendSuccess(reply, result.items, 200, result.meta);
  });

  app.get("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const item = await mlaUpdatesService.getPublic(id);
    return sendSuccess(reply, item);
  });

  app.register(async function adminRoutes(adminApp) {
    adminApp.addHook("preHandler", adminApp.requireContentAdmin);

    adminApp.get("/admin", async (request, reply) => {
      const query = parseOrThrow(listMlaUpdatesQuerySchema, request.query);
      const result = await mlaUpdatesService.listAdmin(query);
      return sendSuccess(reply, result.items, 200, result.meta);
    });

    adminApp.post("/admin", async (request, reply) => {
      const body = parseOrThrow(createMlaUpdateSchema, request.body);
      const item = await mlaUpdatesService.create(body, request.userId!);
      return sendCreated(reply, item);
    });

    adminApp.patch("/admin/:id", async (request, reply) => {
      const { id } = request.params as { id: string };
      const body = parseOrThrow(updateMlaUpdateSchema, request.body);
      const item = await mlaUpdatesService.update(id, body);
      return sendSuccess(reply, item);
    });

    adminApp.delete("/admin/:id", async (request, reply) => {
      const { id } = request.params as { id: string };
      await mlaUpdatesService.remove(id);
      return sendSuccess(reply, { deleted: true });
    });
  });
}
