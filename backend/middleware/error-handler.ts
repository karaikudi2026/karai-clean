import type { FastifyInstance, FastifyError } from "fastify";
import { ZodError } from "zod";
import { isAppError } from "../utils/errors";
import { sendError } from "../utils/responses";

export async function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error: FastifyError | Error, request, reply) => {
    request.log.error({ err: error, requestId: request.requestId }, "Request failed");

    if (error instanceof ZodError) {
      return sendError(
        reply,
        422,
        "VALIDATION_ERROR",
        "Validation failed",
        error.flatten()
      );
    }

    if (isAppError(error)) {
      return sendError(reply, error.statusCode, error.code, error.message, error.details);
    }

    const statusCode =
      "statusCode" in error && typeof error.statusCode === "number"
        ? error.statusCode
        : 500;

    const message =
      statusCode >= 500 ? "Internal server error" : error.message;

    return sendError(
      reply,
      statusCode,
      statusCode >= 500 ? "INTERNAL_ERROR" : "BAD_REQUEST",
      message
    );
  });
}
