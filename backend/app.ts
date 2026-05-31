import Fastify from "fastify";
import cors from "@fastify/cors";
import { API_BASE_PATH } from "@mykaraikudi/constants";
import { env, corsOrigins, isDevelopment } from "./config/env";
import { registerMiddleware } from "./middleware";
import { registerV1Routes } from "./api/v1/routes";
import { sendSuccess } from "./utils/responses";
import { startAgriWeatherScheduler } from "./modules/agri/scheduler";

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: isDevelopment ? "info" : "warn",
    },
    requestIdHeader: "x-request-id",
    genReqId: (req) =>
      (req.headers["x-request-id"] as string) ?? crypto.randomUUID(),
  });

  await app.register(cors, {
    origin: corsOrigins.length > 0 ? corsOrigins : true,
    credentials: true,
  });

  await registerMiddleware(app);

  app.get("/health", async () => ({
    status: "ok",
    service: env.APP_NAME,
    version: env.API_VERSION,
    timestamp: new Date().toISOString(),
  }));

  app.get("/", async (_request, reply) => {
    return sendSuccess(reply, {
      message: `${env.APP_NAME} API`,
      version: env.API_VERSION,
      docs: `${API_BASE_PATH}`,
    });
  });

  await app.register(
    async function v1Scope(v1App) {
      await registerV1Routes(v1App);
    },
    { prefix: API_BASE_PATH }
  );

  // Background cache refresh for weather (Open-Meteo → Supabase).
  // Safe no-op for multiple hot reloads due to internal `started` guard.
  startAgriWeatherScheduler();

  return app;
}
