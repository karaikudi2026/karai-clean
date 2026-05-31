import type { FastifyInstance } from "fastify";
import { sendCreated, sendSuccess } from "../../utils/responses";
import { parseOrThrow } from "../../utils/validators";
import { createJobSchema, listJobsQuerySchema } from "./schemas";
import { jobsService } from "./service";

export async function jobsRoutes(app: FastifyInstance) {
  app.get("/", async (request, reply) => {
    const query = parseOrThrow(listJobsQuerySchema, request.query);
    const result = await jobsService.list(query);
    return sendSuccess(reply, result.items, 200, result.meta);
  });

  app.get("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const item = await jobsService.get(id);
    return sendSuccess(reply, item);
  });

  app.post("/", { preHandler: [app.requireAuth] }, async (request, reply) => {
    const body = parseOrThrow(createJobSchema, request.body);
    const item = await jobsService.create(body, request.userId!);
    return sendCreated(reply, item);
  });
}
