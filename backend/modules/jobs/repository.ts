import { supabaseAdmin } from "../../config/supabase";
import { assertNoDbError } from "../../utils/db";
import type { CreateJobInput, ListJobsQuery } from "./schemas";
import { getPaginationRange } from "../../utils/pagination";

export const jobsRepository = {
  async list(query: ListJobsQuery) {
    const { offset, limit } = getPaginationRange(query);

    let builder = supabaseAdmin
      .from("jobs")
      .select(
        "id, title, company_name, summary, location, category, contact_phone, contact_email, apply_link, created_at",
        { count: "exact" }
      )
      .eq("is_active", true)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (query.category) builder = builder.eq("category", query.category);
    if (query.location) builder = builder.ilike("location", `%${query.location}%`);
    if (query.search) {
      builder = builder.or(
        `title.ilike.%${query.search}%,summary.ilike.%${query.search}%`
      );
    }

    const { data, error, count } = await builder.range(
      offset,
      offset + limit - 1
    );

    assertNoDbError(error, "Failed to list jobs");
    return { data: data ?? [], count: count ?? 0 };
  },

  async getById(id: string) {
    const { data, error } = await supabaseAdmin
      .from("jobs")
      .select("*")
      .eq("id", id)
      .eq("is_active", true)
      .is("deleted_at", null)
      .maybeSingle();

    assertNoDbError(error, "Failed to fetch job");
    return data;
  },

  async create(input: CreateJobInput, userId: string) {
    const { data, error } = await supabaseAdmin
      .from("jobs")
      .insert({ ...input, user_id: userId })
      .select()
      .single();

    assertNoDbError(error, "Failed to create job");
    return data;
  },
};
