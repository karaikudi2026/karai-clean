import type { FastifyInstance } from "fastify";
import { sendSuccess } from "../../utils/responses";
import { grievanceRepository } from "./repository";

export async function grievanceRoutes(app: FastifyInstance) {
  app.get("/", async (_request, reply) => {
    const config = await grievanceRepository.getActiveConfig();
    return sendSuccess(reply, config);
  });
}
