import { API_BASE_PATH } from "@mykaraikudi/constants";
import { useAuthStore } from "@/src/stores/auth-store";

type ApiFetchArgs = RequestInit & {
  path: string;
  auth?: boolean;
};

const getBaseUrl = () => process.env.EXPO_PUBLIC_API_URL ?? "";

export async function apiFetch<T>({ path, auth, ...init }: ApiFetchArgs) {
  const baseUrl = getBaseUrl();
  const token = auth ? useAuthStore.getState().accessToken : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> | undefined),
  };

  if (auth && token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${baseUrl}${API_BASE_PATH}${path}`, {
    ...init,
    headers,
  });

  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const json = (await res.json()) as any;
      message = json?.error?.message ?? json?.message ?? message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  const json = (await res.json()) as { data: T };
  return json.data;
}

