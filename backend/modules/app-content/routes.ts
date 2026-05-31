import type { FastifyInstance } from "fastify";
import { sendSuccess } from "../../utils/responses";
import { appContentRepository } from "./repository";

export async function appContentRoutes(app: FastifyInstance) {
  app.get("/onboarding", async (_request, reply) => {
    const slides = await appContentRepository.listOnboardingSlides();
    return sendSuccess(reply, slides);
  });
}
