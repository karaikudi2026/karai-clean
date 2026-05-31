import type { FastifyInstance } from "fastify";
import { registerAuthDecorators } from "./auth";
import { registerErrorHandler } from "./error-handler";
import { registerRateLimitPlaceholder } from "./rate-limit";
import { registerRbacDecorators } from "./rbac";
import { registerRequestContext } from "./request-context";

export async function registerMiddleware(app: FastifyInstance) {
  await registerRequestContext(app);
  await registerRateLimitPlaceholder(app);
  await registerAuthDecorators(app);
  await registerRbacDecorators(app);
  await registerErrorHandler(app);
}
