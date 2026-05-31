import type { FastifyInstance } from "fastify";
import { sendCreated, sendSuccess } from "../../utils/responses";
import { parseOrThrow } from "../../utils/validators";
import {
  createBloodDonorSchema,
  createEnquirySchema,
  createVolunteerGroupSchema,
  listBloodDonorsQuerySchema,
} from "./schemas";
import { volunteersService } from "./service";

export async function volunteersRoutes(app: FastifyInstance) {
  app.get("/groups", async (_request, reply) => {
    const groups = await volunteersService.listGroups();
    return sendSuccess(reply, groups);
  });

  app.get("/blood-donors", async (request, reply) => {
    const query = parseOrThrow(listBloodDonorsQuerySchema, request.query);
    const donors = await volunteersService.listBloodDonors(
      query.blood_group,
      query.location
    );
    return sendSuccess(reply, donors);
  });

  app.post("/enquiries", async (request, reply) => {
    const body = parseOrThrow(createEnquirySchema, request.body);
    await app.optionalAuth(request);
    const enquiry = await volunteersService.submitEnquiry(
      body,
      request.userId
    );
    return sendCreated(reply, enquiry);
  });

  app.post(
    "/blood-donors",
    { preHandler: [app.requireAuth] },
    async (request, reply) => {
      const body = parseOrThrow(createBloodDonorSchema, request.body);
      const donor = await volunteersService.registerBloodDonor(
        body,
        request.userId!
      );
      return sendCreated(reply, donor);
    }
  );

  app.register(async function adminRoutes(adminApp) {
    adminApp.addHook("preHandler", adminApp.requireContentAdmin);

    adminApp.post("/admin/groups", async (request, reply) => {
      const body = parseOrThrow(createVolunteerGroupSchema, request.body);
      const group = await volunteersService.createGroup(body);
      return sendCreated(reply, group);
    });
  });
}
