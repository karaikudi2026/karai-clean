import { AppError } from "./errors";

export function assertNoDbError(
  error: { message: string } | null,
  context: string
): void {
  if (error) {
    throw AppError.internal(`${context}: ${error.message}`);
  }
}

export function assertSingleRow<T>(
  data: T | null,
  resource = "Resource"
): T {
  if (!data) {
    throw AppError.notFound(resource);
  }
  return data;
}
