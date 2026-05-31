import { supabaseAdmin } from "../../config/supabase";
import { assertNoDbError } from "../../utils/db";
import type {
  CreateBloodDonorInput,
  CreateEnquiryInput,
  CreateVolunteerGroupInput,
} from "./schemas";

export const volunteersRepository = {
  async listGroups() {
    const { data, error } = await supabaseAdmin
      .from("volunteer_groups")
      .select("*")
      .eq("is_active", true)
      .is("deleted_at", null)
      .order("name");

    assertNoDbError(error, "Failed to list volunteer groups");
    return data ?? [];
  },

  async listBloodDonors(bloodGroup?: string, location?: string) {
    let q = supabaseAdmin
      .from("blood_donors")
      .select("id, full_name, blood_group, phone, location_area, is_available")
      .eq("is_available", true)
      .is("deleted_at", null);

    if (bloodGroup) q = q.eq("blood_group", bloodGroup);
    if (location) q = q.ilike("location_area", `%${location}%`);

    const { data, error } = await q;
    assertNoDbError(error, "Failed to list blood donors");
    return data ?? [];
  },

  async registerBloodDonor(input: CreateBloodDonorInput, userId: string) {
    const { data, error } = await supabaseAdmin
      .from("blood_donors")
      .upsert({ ...input, user_id: userId }, { onConflict: "user_id" })
      .select()
      .single();

    assertNoDbError(error, "Failed to register blood donor");
    return data;
  },

  async createEnquiry(input: CreateEnquiryInput, userId?: string) {
    const { data, error } = await supabaseAdmin
      .from("volunteer_enquiries")
      .insert({ ...input, user_id: userId ?? null })
      .select()
      .single();

    assertNoDbError(error, "Failed to submit enquiry");
    return data;
  },

  async createGroup(input: CreateVolunteerGroupInput) {
    const { data, error } = await supabaseAdmin
      .from("volunteer_groups")
      .insert(input)
      .select()
      .single();

    assertNoDbError(error, "Failed to create volunteer group");
    return data;
  },
};
