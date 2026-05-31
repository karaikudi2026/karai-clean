export type ErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "VALIDATION_ERROR"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  readonly statusCode: number;
  readonly code: ErrorCode;
  readonly details?: unknown;

  constructor(
    message: string,
    statusCode: number,
    code: ErrorCode,
    details?: unknown
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }

  static badRequest(message: string, details?: unknown) {
    return new AppError(message, 400, "BAD_REQUEST", details);
  }

  static unauthorized(message = "Authentication required") {
    return new AppError(message, 401, "UNAUTHORIZED");
  }

  static forbidden(message = "Insufficient permissions") {
    return new AppError(message, 403, "FORBIDDEN");
  }

  static notFound(resource = "Resource") {
    return new AppError(`${resource} not found`, 404, "NOT_FOUND");
  }

  static conflict(message: string) {
    return new AppError(message, 409, "CONFLICT");
  }

  static validation(message: string, details?: unknown) {
    return new AppError(message, 422, "VALIDATION_ERROR", details);
  }

  static internal(message = "Internal server error") {
    return new AppError(message, 500, "INTERNAL_ERROR");
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
