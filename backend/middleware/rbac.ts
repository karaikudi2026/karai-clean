import type { FastifyInstance, FastifyRequest } from "fastify";
import type { AdminRole } from "@mykaraikudi/constants";
import { supabaseAdmin } from "../config/supabase";
import { authenticateUser } from "./auth";
import { AppError } from "../utils/errors";

async function loadAdminContext(request: FastifyRequest) {
  const userId = request.userId ?? (await authenticateUser(request));

  const { data, error } = await supabaseAdmin
    .from("admin_users")
    .select("role, is_active")
    .eq("user_id", userId)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) {
    throw AppError.internal("Failed to verify admin access");
  }

  if (!data?.is_active) {
    throw AppError.forbidden("Admin access required");
  }

  request.userId = userId;
  request.isAdmin = true;
  request.userRole = data.role as AdminRole;
}

export function requireAdminRole(...roles: AdminRole[]) {
  return async (request: FastifyRequest) => {
    await loadAdminContext(request);

    if (roles.length > 0 && request.userRole && !roles.includes(request.userRole)) {
      throw AppError.forbidden(`Requires one of: ${roles.join(", ")}`);
    }
  };
}

export async function registerRbacDecorators(app: FastifyInstance) {
  app.decorateRequest("userRole", undefined);
  app.decorateRequest("isAdmin", undefined);

  app.decorate("requireAdmin", requireAdminRole());
  app.decorate(
    "requireSuperAdmin",
    requireAdminRole("super_admin")
  );
  app.decorate(
    "requireContentAdmin",
    requireAdminRole("super_admin", "content_admin")
  );
}

declare module "fastify" {
  interface FastifyInstance {
    requireAdmin: (request: FastifyRequest) => Promise<void>;
    requireSuperAdmin: (request: FastifyRequest) => Promise<void>;
    requireContentAdmin: (request: FastifyRequest) => Promise<void>;
  }
}
