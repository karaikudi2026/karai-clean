import { randomUUID } from "node:crypto";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export async function registerRequestContext(app: FastifyInstance) {
  app.addHook(
    "onRequest",
    async (request: FastifyRequest, _reply: FastifyReply) => {
      request.requestId =
        (request.headers["x-request-id"] as string | undefined) ??
        randomUUID();
    }
  );

  app.addHook(
    "onSend",
    async (request: FastifyRequest, reply: FastifyReply) => {
      if (request.requestId) {
        reply.header("x-request-id", request.requestId);
      }
    }
  );
}
