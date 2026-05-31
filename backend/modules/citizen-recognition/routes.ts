import type { FastifyInstance } from "fastify";
import { sendSuccess } from "../../utils/responses";
import { citizenRecognitionRepository } from "./repository";

export async function citizenRecognitionRoutes(app: FastifyInstance) {
  app.get("/", async (_request, reply) => {
    const config = await citizenRecognitionRepository.getPlaceholder();
    return sendSuccess(reply, config);
  });
}
