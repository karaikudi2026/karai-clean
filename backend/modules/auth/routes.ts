import type { FastifyInstance } from "fastify";
import { sendSuccess } from "../../utils/responses";
import { parseOrThrow } from "../../utils/validators";
import { authRepository } from "./repository";
import { updateProfileSchema } from "./schemas";

export async function authRoutes(app: FastifyInstance) {
  app.get(
    "/me",
    { preHandler: [app.requireAuth] },
    async (request, reply) => {
      const profile = await authRepository.getProfile(request.userId!);
      const admin = await authRepository.getAdminRole(request.userId!);

      return sendSuccess(reply, {
        profile,
        admin: admin?.is_active ? { role: admin.role } : null,
      });
    }
  );

  app.patch(
    "/me",
    { preHandler: [app.requireAuth] },
    async (request, reply) => {
      const body = parseOrThrow(updateProfileSchema, request.body);
      const profile = await authRepository.updateProfile(
        request.userId!,
        body
      );
      return sendSuccess(reply, profile);
    }
  );
}
