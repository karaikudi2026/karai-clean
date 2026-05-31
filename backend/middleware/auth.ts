import type { FastifyInstance, FastifyRequest } from "fastify";
import { supabaseAnon } from "../config/supabase";
import { AppError } from "../utils/errors";

function extractBearerToken(request: FastifyRequest): string | null {
  const header = request.headers.authorization;
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice(7).trim() || null;
}

export async function authenticateUser(
  request: FastifyRequest
): Promise<string> {
  const token = extractBearerToken(request);
  if (!token) {
    throw AppError.unauthorized();
  }

  const { data, error } = await supabaseAnon.auth.getUser(token);
  if (error || !data.user) {
    throw AppError.unauthorized("Invalid or expired token");
  }

  request.userId = data.user.id;
  return data.user.id;
}

export async function optionalAuth(request: FastifyRequest) {
  const token = extractBearerToken(request);
  if (!token) return null;

  const { data, error } = await supabaseAnon.auth.getUser(token);
  if (error || !data.user) return null;

  request.userId = data.user.id;
  return data.user.id;
}

export async function registerAuthDecorators(app: FastifyInstance) {
  app.decorateRequest("userId", undefined);

  app.decorate(
    "requireAuth",
    async function requireAuth(request: FastifyRequest) {
      await authenticateUser(request);
    }
  );

  app.decorate(
    "optionalAuth",
    async function optionalAuthDecorator(request: FastifyRequest) {
      await optionalAuth(request);
    }
  );
}

declare module "fastify" {
  interface FastifyInstance {
    requireAuth: (request: FastifyRequest) => Promise<void>;
    optionalAuth: (request: FastifyRequest) => Promise<void>;
  }
}
