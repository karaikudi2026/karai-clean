import type { FastifyInstance } from "fastify";
import { sendCreated, sendSuccess } from "../../utils/responses";
import { parseOrThrow } from "../../utils/validators";
import {
  createAgriServiceSchema,
  createAgriSchemeSchema,
  createLaborSchema,
  createMandiPriceSchema,
  listMandiQuerySchema,
  listAgriSchemesQuerySchema,
  upsertWeatherSchema,
} from "./schemas";
import { agriService } from "./service";

export async function agriRoutes(app: FastifyInstance) {
  app.get("/mandi", async (request, reply) => {
    const query = parseOrThrow(listMandiQuerySchema, request.query);
    const items = await agriService.listMandiPrices(
      query.crop_name,
      query.date
    );
    return sendSuccess(reply, items);
  });

  app.get("/weather", async (request, reply) => {
    const { location } = request.query as { location?: string };
    const summary = await agriService.getWeatherSummary(location);
    return sendSuccess(reply, summary);
  });

  app.get("/schemes", async (request, reply) => {
    const query = listAgriSchemesQuerySchema.parse(request.query ?? {});
    const items = await agriService.listSchemes(query);
    return sendSuccess(reply, items);
  });

  app.get("/services", async (_request, reply) => {
    const items = await agriService.listServices();
    return sendSuccess(reply, items);
  });

  app.post(
    "/labor",
    { preHandler: [app.requireAuth] },
    async (request, reply) => {
      const body = parseOrThrow(createLaborSchema, request.body);
      const item = await agriService.registerLabor(body, request.userId!);
      return sendCreated(reply, item);
    }
  );

  app.get(
    "/labor/me",
    { preHandler: [app.requireAuth] },
    async (request, reply) => {
      const item = await agriService.getLaborRegistration(request.userId!);
      return sendSuccess(reply, item);
    }
  );

  app.register(async function adminRoutes(adminApp) {
    adminApp.addHook("preHandler", adminApp.requireContentAdmin);

    adminApp.post("/admin/mandi", async (request, reply) => {
      const body = parseOrThrow(createMandiPriceSchema, request.body);
      const item = await agriService.createMandiPrice(body);
      return sendCreated(reply, item);
    });

    adminApp.post("/admin/weather", async (request, reply) => {
      const body = parseOrThrow(upsertWeatherSchema, request.body);
      const item = await agriService.upsertWeather(body);
      return sendCreated(reply, item);
    });

    adminApp.post("/admin/services", async (request, reply) => {
      const body = parseOrThrow(createAgriServiceSchema, request.body);
      const item = await agriService.createService(body);
      return sendCreated(reply, item);
    });

    adminApp.post("/admin/schemes", async (request, reply) => {
      const body = parseOrThrow(createAgriSchemeSchema, request.body);
      const item = await agriService.createScheme(body);
      return sendCreated(reply, item);
    });
  });
}
