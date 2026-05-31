import { API_BASE_PATH } from "@mykaraikudi/constants";
import type { ApiError, ApiSuccess } from "@mykaraikudi/types";

export function getApiBaseUrl(envUrl?: string): string {
  return envUrl ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
}

export function apiUrl(path: string, base = getApiBaseUrl()): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${API_BASE_PATH}${normalized}`;
}

export class ApiClientError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<ApiSuccess<T>> {
  const { token, headers, ...rest } = options;

  const response = await fetch(apiUrl(path), {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const body = (await response.json()) as ApiSuccess<T> | ApiError;

  if (!response.ok || !body.success) {
    const err = body as ApiError;
    throw new ApiClientError(
      err.error?.code ?? "REQUEST_FAILED",
      err.error?.message ?? "Request failed",
      response.status,
      err.error?.details
    );
  }

  return body;
}
