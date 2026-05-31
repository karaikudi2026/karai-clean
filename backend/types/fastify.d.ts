import type { AdminRole } from "@mykaraikudi/constants";

declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
    userRole?: AdminRole;
    isAdmin?: boolean;
    requestId?: string;
  }
}
