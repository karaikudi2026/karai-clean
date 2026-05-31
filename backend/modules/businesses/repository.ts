import { supabaseAdmin } from "../../config/supabase";
import { assertNoDbError } from "../../utils/db";
import type { CreateBusinessInput, ListBusinessesQuery } from "./schemas";
import { getPaginationRange } from "../../utils/pagination";

export const businessesRepository = {
  async listPublic(query: ListBusinessesQuery) {
    const { offset, limit } = getPaginationRange(query);
    const seed =
      query.seed ?? new Date().toISOString().slice(0, 10);

    const { data, error } = await supabaseAdmin.rpc("search_businesses", {
      p_seed: seed,
      p_category_id: query.category_id ?? null,
      p_location: query.location ?? null,
      p_search: query.search ?? null,
      p_limit: limit,
      p_offset: offset,
    });

    assertNoDbError(error, "Failed to search businesses");
    return data ?? [];
  },

  async listCategories() {
    const { data, error } = await supabaseAdmin
      .from("business_categories")
      .select("id, name, slug, sort_order")
      .eq("is_active", true)
      .order("sort_order");

    assertNoDbError(error, "Failed to list categories");
    return data ?? [];
  },

  async getById(id: string) {
    const { data, error } = await supabaseAdmin
      .from("businesses")
      .select(
        `
        *,
        business_categories ( id, name, slug )
      `
      )
      .eq("id", id)
      .eq("moderation_status", "approved")
      .eq("is_active", true)
      .is("deleted_at", null)
      .maybeSingle();

    assertNoDbError(error, "Failed to fetch business");
    return data;
  },

  async create(input: CreateBusinessInput, userId: string) {
    const { data, error } = await supabaseAdmin
      .from("businesses")
      .insert({
        user_id: userId,
        category_id: input.category_id,
        name: input.name,
        address: input.address,
        phone: input.phone,
        email: input.email || null,
        website: input.website || null,
        summary: input.summary,
        image_url: input.image_url ?? null,
        location_area: input.location_area ?? null,
        latitude: input.latitude ?? null,
        longitude: input.longitude ?? null,
        moderation_status: "pending",
      })
      .select()
      .single();

    assertNoDbError(error, "Failed to create business");
    return data;
  },

  async listPendingModeration() {
    const { data, error } = await supabaseAdmin
      .from("businesses")
      .select("*, business_categories(name, slug)")
      .eq("moderation_status", "pending")
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    assertNoDbError(error, "Failed to list pending businesses");
    return data ?? [];
  },

  async moderate(
    id: string,
    status: string,
    notes: string | undefined,
    adminId: string
  ) {
    const { data, error } = await supabaseAdmin
      .from("businesses")
      .update({
        moderation_status: status,
        moderation_notes: notes ?? null,
        approved_by: status === "approved" ? adminId : null,
        approved_at: status === "approved" ? new Date().toISOString() : null,
      })
      .eq("id", id)
      .select()
      .single();

    assertNoDbError(error, "Failed to moderate business");
    return data;
  },
};
