import { supabaseAdmin } from "../../config/supabase";
import { assertNoDbError } from "../../utils/db";
import type { UpsertSosProfileInput } from "./schemas";

export const sosRepository = {
  async listEmergencyContacts() {
    const { data, error } = await supabaseAdmin
      .from("sos_emergency_contacts")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");

    assertNoDbError(error, "Failed to list emergency contacts");
    return data ?? [];
  },

  async getUserProfile(userId: string) {
    const { data, error } = await supabaseAdmin
      .from("sos_user_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    assertNoDbError(error, "Failed to fetch SOS profile");
    return data;
  },

  async upsertUserProfile(input: UpsertSosProfileInput, userId: string) {
    const { data, error } = await supabaseAdmin
      .from("sos_user_profiles")
      .upsert({ ...input, user_id: userId }, { onConflict: "user_id" })
      .select()
      .single();

    assertNoDbError(error, "Failed to save SOS profile");
    return data;
  },
};
