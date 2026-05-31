import type { FastifyInstance } from "fastify";
import { env } from "../config/env";

/**
 * Rate-limit-ready hook placeholder.
 * Wire @fastify/rate-limit in production with Redis store for multi-instance deploys.
 */
export async function registerRateLimitPlaceholder(app: FastifyInstance) {
  const buckets = new Map<string, { count: number; resetAt: number }>();

  app.addHook("onRequest", async (request, reply) => {
    if (env.NODE_ENV === "test") return;

    const key =
      (request.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ??
      request.ip;

    const now = Date.now();
    const bucket = buckets.get(key);

    if (!bucket || now > bucket.resetAt) {
      buckets.set(key, {
        count: 1,
        resetAt: now + env.RATE_LIMIT_WINDOW_MS,
      });
      return;
    }

    bucket.count += 1;

    if (bucket.count > env.RATE_LIMIT_MAX) {
      reply.header("Retry-After", Math.ceil((bucket.resetAt - now) / 1000));
      return reply.status(429).send({
        success: false,
        error: {
          code: "RATE_LIMITED",
          message: "Too many requests. Please try again later.",
        },
      });
    }
  });
}
