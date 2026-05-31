import type { FastifyInstance } from "fastify";
import { API_ROUTES } from "@mykaraikudi/constants";
import { authRoutes } from "../../modules/auth";
import { appContentRoutes } from "../../modules/app-content";
import { mlaUpdatesRoutes } from "../../modules/mla-updates";
import { businessesRoutes } from "../../modules/businesses";
import { jobsRoutes } from "../../modules/jobs";
import { agriRoutes } from "../../modules/agri";
import { sosRoutes } from "../../modules/sos";
import { volunteersRoutes } from "../../modules/volunteers";
import { welfareRoutes } from "../../modules/welfare";
import { eventsRoutes } from "../../modules/events";
import { grievanceRoutes } from "../../modules/grievance";
import { citizenRecognitionRoutes } from "../../modules/citizen-recognition";
import { notificationsRoutes } from "../../modules/notifications";

export async function registerV1Routes(app: FastifyInstance) {
  await app.register(authRoutes, { prefix: API_ROUTES.auth });
  await app.register(appContentRoutes, { prefix: "/app" });
  await app.register(mlaUpdatesRoutes, { prefix: API_ROUTES.mlaUpdates });
  await app.register(businessesRoutes, { prefix: API_ROUTES.businesses });
  await app.register(jobsRoutes, { prefix: API_ROUTES.jobs });
  await app.register(agriRoutes, { prefix: API_ROUTES.agri });
  await app.register(sosRoutes, { prefix: API_ROUTES.sos });
  await app.register(volunteersRoutes, { prefix: API_ROUTES.volunteers });
  await app.register(welfareRoutes, { prefix: API_ROUTES.welfare });
  await app.register(eventsRoutes, { prefix: API_ROUTES.events });
  await app.register(grievanceRoutes, { prefix: API_ROUTES.grievance });
  await app.register(citizenRecognitionRoutes, {
    prefix: API_ROUTES.citizenRecognition,
  });
  await app.register(notificationsRoutes, { prefix: API_ROUTES.notifications });
}
