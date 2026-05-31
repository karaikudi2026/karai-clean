import { supabaseAdmin } from "../../config/supabase";
import { assertNoDbError } from "../../utils/db";

export const authRepository = {
  async getProfile(userId: string) {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .is("deleted_at", null)
      .maybeSingle();

    assertNoDbError(error, "Failed to fetch profile");
    return data;
  },

  async updateProfile(
    userId: string,
    updates: Record<string, unknown>
  ) {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    assertNoDbError(error, "Failed to update profile");
    return data;
  },

  async getAdminRole(userId: string) {
    const { data, error } = await supabaseAdmin
      .from("admin_users")
      .select("role, is_active")
      .eq("user_id", userId)
      .is("deleted_at", null)
      .maybeSingle();

    assertNoDbError(error, "Failed to fetch admin role");
    return data;
  },
};
