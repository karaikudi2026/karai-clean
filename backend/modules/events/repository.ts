import { supabaseAdmin } from "../../config/supabase";
import { assertNoDbError } from "../../utils/db";
import type { CreateEventInput, ListEventsQuery } from "./schemas";
import { getPaginationRange } from "../../utils/pagination";

export const eventsRepository = {
  async listPublic(query: ListEventsQuery) {
    const { offset, limit } = getPaginationRange(query);

    let builder = supabaseAdmin
      .from("events")
      .select(
        "id, title, description, image_url, event_date, start_time, end_time, address, latitude, longitude",
        { count: "exact" }
      )
      .eq("is_published", true)
      .is("deleted_at", null)
      .order("event_date", { ascending: true });

    if (query.upcoming_only) {
      builder = builder.gte("event_date", new Date().toISOString().slice(0, 10));
    }

    const { data, error, count } = await builder.range(
      offset,
      offset + limit - 1
    );

    assertNoDbError(error, "Failed to list events");
    return { data: data ?? [], count: count ?? 0 };
  },

  async getById(id: string) {
    const { data, error } = await supabaseAdmin
      .from("events")
      .select("*")
      .eq("id", id)
      .eq("is_published", true)
      .is("deleted_at", null)
      .maybeSingle();

    assertNoDbError(error, "Failed to fetch event");
    return data;
  },

  async create(input: CreateEventInput, adminId: string) {
    const { data, error } = await supabaseAdmin
      .from("events")
      .insert({ ...input, created_by: adminId })
      .select()
      .single();

    assertNoDbError(error, "Failed to create event");
    return data;
  },

  async update(id: string, input: Partial<CreateEventInput>) {
    const { data, error } = await supabaseAdmin
      .from("events")
      .update(input)
      .eq("id", id)
      .is("deleted_at", null)
      .select()
      .single();

    assertNoDbError(error, "Failed to update event");
    return data;
  },

  async softDelete(id: string) {
    const { error } = await supabaseAdmin
      .from("events")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    assertNoDbError(error, "Failed to delete event");
  },
};
