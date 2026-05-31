import { supabaseAdmin } from "../../config/supabase";
import { assertNoDbError } from "../../utils/db";
import type { CreateMlaUpdateInput, UpdateMlaUpdateInput } from "./schemas";
import type { PaginationQuery } from "../../utils/pagination";
import { getPaginationRange } from "../../utils/pagination";

const SELECT_PUBLIC = `
  id, title, summary, content, image_url, image_alt,
  is_published, published_at, created_at, updated_at
`;

export const mlaUpdatesRepository = {
  async listPublished(query: PaginationQuery) {
    const { offset, limit } = getPaginationRange(query);

    const { data, error, count } = await supabaseAdmin
      .from("mla_updates")
      .select(SELECT_PUBLIC, { count: "exact" })
      .eq("is_published", true)
      .is("deleted_at", null)
      .order("published_at", { ascending: false })
      .range(offset, offset + limit - 1);

    assertNoDbError(error, "Failed to list MLA updates");
    return { data: data ?? [], count: count ?? 0 };
  },

  async getById(id: string) {
    const { data, error } = await supabaseAdmin
      .from("mla_updates")
      .select(SELECT_PUBLIC)
      .eq("id", id)
      .eq("is_published", true)
      .is("deleted_at", null)
      .maybeSingle();

    assertNoDbError(error, "Failed to fetch MLA update");
    return data;
  },

  async listAdmin(query: PaginationQuery) {
    const { offset, limit } = getPaginationRange(query);

    const { data, error, count } = await supabaseAdmin
      .from("mla_updates")
      .select("*", { count: "exact" })
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    assertNoDbError(error, "Failed to list MLA updates (admin)");
    return { data: data ?? [], count: count ?? 0 };
  },

  async create(input: CreateMlaUpdateInput, createdBy: string) {
    const { data, error } = await supabaseAdmin
      .from("mla_updates")
      .insert({
        ...input,
        published_at: input.is_published ? new Date().toISOString() : null,
        created_by: createdBy,
      })
      .select()
      .single();

    assertNoDbError(error, "Failed to create MLA update");
    return data;
  },

  async update(id: string, input: UpdateMlaUpdateInput) {
    const payload: Record<string, unknown> = { ...input };
    if (input.is_published === true) {
      payload.published_at = new Date().toISOString();
    }

    const { data, error } = await supabaseAdmin
      .from("mla_updates")
      .update(payload)
      .eq("id", id)
      .is("deleted_at", null)
      .select()
      .single();

    assertNoDbError(error, "Failed to update MLA update");
    return data;
  },

  async softDelete(id: string) {
    const { error } = await supabaseAdmin
      .from("mla_updates")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    assertNoDbError(error, "Failed to delete MLA update");
  },
};
