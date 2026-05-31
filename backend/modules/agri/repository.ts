import { supabaseAdmin } from "../../config/supabase";
import { assertNoDbError } from "../../utils/db";
import type {
  CreateAgriServiceInput,
  CreateAgriSchemeInput,
  CreateLaborInput,
  CreateMandiPriceInput,
  ListAgriSchemesQuery,
  UpsertWeatherInput,
} from "./schemas";

export const agriRepository = {
  async listMandiPrices(cropName?: string, date?: string) {
    let q = supabaseAdmin
      .from("mandi_prices")
      .select("*")
      .order("price_date", { ascending: false })
      .limit(50);

    if (cropName) q = q.ilike("crop_name", `%${cropName}%`);
    if (date) q = q.eq("price_date", date);

    const { data, error } = await q;
    assertNoDbError(error, "Failed to list mandi prices");
    return data ?? [];
  },

  async getLatestWeather(location = "Karaikudi") {
    const { data, error } = await supabaseAdmin
      .from("agri_weather")
      .select("*")
      .eq("location_name", location)
      .order("forecast_date", { ascending: false })
      .limit(7);

    assertNoDbError(error, "Failed to fetch weather");
    return data ?? [];
  },

  formatForecastDateInKolkata(offsetDays: number) {
    const dt = new Date(Date.now() + offsetDays * 24 * 60 * 60 * 1000);
    // Use Asia/Kolkata so "today" matches Karaikudi/Sivaganga local date.
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(dt);
    const y = parts.find((p) => p.type === "year")?.value ?? "1970";
    const m = parts.find((p) => p.type === "month")?.value ?? "01";
    const d = parts.find((p) => p.type === "day")?.value ?? "01";
    return `${y}-${m}-${d}`;
  },

  async getWeatherSummary(location = "Karaikudi") {
    const today = this.formatForecastDateInKolkata(0);
    const tomorrow = this.formatForecastDateInKolkata(1);

    const { data, error } = await supabaseAdmin
      .from("agri_weather")
      .select("*")
      .eq("location_name", location)
      .in("forecast_date", [today, tomorrow]);

    assertNoDbError(error, "Failed to fetch weather summary");
    const rows = data ?? [];
    const todayRow = rows.find((r) => r.forecast_date === today);
    const tomorrowRow = rows.find((r) => r.forecast_date === tomorrow);

    const lastUpdatedAt = [todayRow?.fetched_at, tomorrowRow?.fetched_at]
      .filter(Boolean)
      .sort()
      .at(-1);

    const getNum = (v: unknown) =>
      typeof v === "number" ? v : v == null ? null : Number(v);

    return {
      location_name: location,
      temperature_c: getNum(todayRow?.temp_max) ?? getNum(todayRow?.temp_min),
      humidity_percent: getNum(todayRow?.humidity),
      rain_probability: getNum(todayRow?.rain_probability),
      advisory_text: todayRow?.advisory_text ?? todayRow?.condition ?? null,
      tomorrow_evening_advice: tomorrowRow?.advisory_text ?? null,
      last_updated_at: lastUpdatedAt ?? null,
      has_today: Boolean(todayRow),
      has_tomorrow: Boolean(tomorrowRow),
    };
  },

  async listServices() {
    const { data, error } = await supabaseAdmin
      .from("agri_services")
      .select("*")
      .eq("is_active", true)
      .is("deleted_at", null)
      .order("sort_order");

    assertNoDbError(error, "Failed to list agri services");
    return data ?? [];
  },

  async registerLabor(input: CreateLaborInput, userId: string) {
    const { data, error } = await supabaseAdmin
      .from("labor_registrations")
      .upsert(
        { ...input, user_id: userId },
        { onConflict: "user_id" }
      )
      .select()
      .single();

    assertNoDbError(error, "Failed to register labor");
    return data;
  },

  async getLaborByUser(userId: string) {
    const { data, error } = await supabaseAdmin
      .from("labor_registrations")
      .select("*")
      .eq("user_id", userId)
      .is("deleted_at", null)
      .maybeSingle();

    assertNoDbError(error, "Failed to fetch labor registration");
    return data;
  },

  async createMandiPrice(input: CreateMandiPriceInput) {
    const { data, error } = await supabaseAdmin
      .from("mandi_prices")
      .insert(input)
      .select()
      .single();

    assertNoDbError(error, "Failed to create mandi price");
    return data;
  },

  async upsertWeather(input: UpsertWeatherInput) {
    const { data, error } = await supabaseAdmin
      .from("agri_weather")
      .upsert(
        { ...input, fetched_at: new Date().toISOString() },
        { onConflict: "forecast_date,location_name" }
      )
      .select()
      .single();

    assertNoDbError(error, "Failed to upsert weather");
    return data;
  },

  async createService(input: CreateAgriServiceInput) {
    const { data, error } = await supabaseAdmin
      .from("agri_services")
      .insert(input)
      .select()
      .single();

    assertNoDbError(error, "Failed to create agri service");
    return data;
  },

  async listAgriSchemes(query: ListAgriSchemesQuery) {
    const { state_name, district_name, limit } = query;
    let q = supabaseAdmin
      .from("agri_schemes")
      .select("*")
      .eq("is_active", true)
      .is("deleted_at", null)
      .order("deadline", { ascending: true });

    if (state_name) q = q.eq("state_name", state_name);
    if (district_name) q = q.eq("district_name", district_name);
    if (limit) q = q.limit(limit);

    const { data, error } = await q;
    assertNoDbError(error, "Failed to list agri schemes");
    return data ?? [];
  },

  async createScheme(input: CreateAgriSchemeInput) {
    const { data, error } = await supabaseAdmin
      .from("agri_schemes")
      .insert(input)
      .select()
      .single();

    assertNoDbError(error, "Failed to create agri scheme");
    return data;
  },
};
