import { API_ROUTES } from "@mykaraikudi/constants";
import { apiFetch } from "@/src/lib/api-fetch";

export type AgriWeatherSummary = {
  location_name: string;
  temperature_c: number | null;
  humidity_percent: number | null;
  rain_probability: number | null;
  advisory_text: string | null;
  tomorrow_evening_advice: string | null;
  last_updated_at: string | null;
  has_today: boolean;
  has_tomorrow: boolean;
};

export type AgriScheme = {
  id: string;
  title: string;
  summary: string;
  eligibility: string;
  deadline: string | null;
  apply_url: string | null;
  state_name: string;
  district_name: string | null;
  department_contact_name: string | null;
  department_contact_phone: string | null;
  department_contact_email: string | null;
  is_active: boolean;
};

export async function fetchAgriWeatherSummary(
  location: string = "Karaikudi"
): Promise<AgriWeatherSummary> {
  return apiFetch<AgriWeatherSummary>({
    path: `${API_ROUTES.agri}/weather?location=${encodeURIComponent(location)}`,
    auth: false,
    method: "GET",
  });
}

export async function fetchAgriSchemes(
  opts?: { stateName?: string; districtName?: string; limit?: number }
): Promise<AgriScheme[]> {
  const params = new URLSearchParams();
  if (opts?.stateName) params.set("state_name", opts.stateName);
  if (opts?.districtName) params.set("district_name", opts.districtName);
  if (opts?.limit) params.set("limit", String(opts.limit));

  return apiFetch<AgriScheme[]>({
    path: `${API_ROUTES.agri}/schemes${params.toString() ? `?${params}` : ""}`,
    auth: false,
    method: "GET",
  });
}

export type AgriMandiPrice = {
  id: string;
  crop_name: string;
  market_name: string;
  price_per_unit: number | string;
  unit: string;
  price_date: string;
  source?: string | null;
};

export async function fetchAgriMandiPrices(opts?: {
  cropName?: string;
  date?: string; // YYYY-MM-DD
  limit?: number;
}): Promise<AgriMandiPrice[]> {
  const params = new URLSearchParams();
  if (opts?.cropName) params.set("crop_name", opts.cropName);
  if (opts?.date) params.set("date", opts.date);

  // backend currently returns a fixed max of 50. `limit` kept for future.
  void opts?.limit;

  return apiFetch<AgriMandiPrice[]>({
    path: `${API_ROUTES.agri}/mandi${params.toString() ? `?${params}` : ""}`,
    auth: false,
    method: "GET",
  });
}

