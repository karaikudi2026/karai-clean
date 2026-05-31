import type { FastifyInstance } from "fastify";
import { notificationService } from "../../services/notification.service";
import { sendCreated, sendSuccess } from "../../utils/responses";
import { parseOrThrow } from "../../utils/validators";
import { createNotificationSchema, registerDeviceSchema } from "./schemas";

export async function notificationsRoutes(app: FastifyInstance) {
  app.post("/devices", async (request, reply) => {
    const body = parseOrThrow(registerDeviceSchema, request.body);
    await app.optionalAuth(request);

    const device = await notificationService.registerDevice({
      deviceToken: body.device_token,
      platform: body.platform,
      userId: request.userId,
      isGuest: body.is_guest ?? !request.userId,
      language: body.language,
    });

    return sendCreated(reply, device);
  });

  app.get(
    "/history",
    { preHandler: [app.requireAuth] },
    async (request, reply) => {
      const history = await notificationService.getHistoryForUser(
        request.userId!
      );
      return sendSuccess(reply, history);
    }
  );

  app.register(async function adminRoutes(adminApp) {
    adminApp.addHook("preHandler", adminApp.requireContentAdmin);

    adminApp.post("/admin/send", async (request, reply) => {
      const body = parseOrThrow(createNotificationSchema, request.body);
      const notification = await notificationService.createAndQueue({
        title: body.title,
        body: body.body,
        category: body.category,
        targetAudience: body.target_audience,
        payload: body.payload,
        locale: body.locale,
        createdBy: request.userId,
      });
      return sendCreated(reply, notification);
    });
  });
}
