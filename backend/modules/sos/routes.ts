import type { FastifyInstance } from "fastify";
import { sendSuccess } from "../../utils/responses";
import { parseOrThrow } from "../../utils/validators";
import { triggerSosSchema, upsertSosProfileSchema } from "./schemas";
import { sosService } from "./service";

export async function sosRoutes(app: FastifyInstance) {
  app.get("/contacts", async (_request, reply) => {
    const contacts = await sosService.listEmergencyContacts();
    return sendSuccess(reply, contacts);
  });

  app.get(
    "/profile",
    { preHandler: [app.requireAuth] },
    async (request, reply) => {
      const profile = await sosService.getProfile(request.userId!);
      return sendSuccess(reply, profile);
    }
  );

  app.put(
    "/profile",
    { preHandler: [app.requireAuth] },
    async (request, reply) => {
      const body = parseOrThrow(upsertSosProfileSchema, request.body);
      const profile = await sosService.saveProfile(body, request.userId!);
      return sendSuccess(reply, profile);
    }
  );

  app.post(
    "/trigger",
    { preHandler: [app.requireAuth] },
    async (request, reply) => {
      parseOrThrow(triggerSosSchema, request.body);
      const payload = await sosService.buildEmergencyPayload(request.userId!);
      return sendSuccess(reply, payload);
    }
  );
}
