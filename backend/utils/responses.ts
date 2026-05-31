import type { FastifyReply } from "fastify";

export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  [key: string]: unknown;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: ApiMeta;
}

export interface ApiErrorBody {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export function success<T>(
  data: T,
  meta?: ApiMeta
): ApiSuccessResponse<T> {
  return meta ? { success: true, data, meta } : { success: true, data };
}

export function errorBody(
  code: string,
  message: string,
  details?: unknown
): ApiErrorBody {
  return {
    success: false,
    error: { code, message, ...(details !== undefined && { details }) },
  };
}

export function sendSuccess<T>(
  reply: FastifyReply,
  data: T,
  statusCode = 200,
  meta?: ApiMeta
) {
  return reply.status(statusCode).send(success(data, meta));
}

export function sendCreated<T>(reply: FastifyReply, data: T, meta?: ApiMeta) {
  return sendSuccess(reply, data, 201, meta);
}

export function sendNoContent(reply: FastifyReply) {
  return reply.status(204).send();
}

export function sendError(
  reply: FastifyReply,
  statusCode: number,
  code: string,
  message: string,
  details?: unknown
) {
  return reply.status(statusCode).send(errorBody(code, message, details));
}
