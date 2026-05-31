import type { FastifyInstance } from "fastify";
import { sendCreated, sendSuccess } from "../../utils/responses";
import { parseOrThrow } from "../../utils/validators";
import { submitWelfareApplicationSchema } from "./schemas";
import { welfareService } from "./service";
import { z } from "zod";

const checkEligibilitySchema = z.object({
  scheme_id: z.string().uuid(),
  form_responses: z.record(z.string(), z.unknown()),
});

export async function welfareRoutes(app: FastifyInstance) {
  app.get("/schemes", async (_request, reply) => {
    const schemes = await welfareService.listSchemes();
    return sendSuccess(reply, schemes);
  });

  app.get("/schemes/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const scheme = await welfareService.getScheme(id);
    return sendSuccess(reply, scheme);
  });

  app.post("/check-eligibility", async (request, reply) => {
    const body = parseOrThrow(checkEligibilitySchema, request.body);
    const result = await welfareService.checkEligibility(
      body.scheme_id,
      body.form_responses
    );
    return sendSuccess(reply, result);
  });

  app.post(
    "/applications",
    { preHandler: [app.requireAuth] },
    async (request, reply) => {
      const body = parseOrThrow(submitWelfareApplicationSchema, request.body);
      const application = await welfareService.submitApplication(
        body,
        request.userId!
      );
      return sendCreated(reply, application);
    }
  );

  app.get(
    "/applications/me",
    { preHandler: [app.requireAuth] },
    async (request, reply) => {
      const applications = await welfareService.getUserApplications(
        request.userId!
      );
      return sendSuccess(reply, applications);
    }
  );
}
