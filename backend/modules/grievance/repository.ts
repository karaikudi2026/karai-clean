import { supabaseAdmin } from "../../config/supabase";
import { assertNoDbError } from "../../utils/db";

export const grievanceRepository = {
  async getActiveConfig() {
    const { data, error } = await supabaseAdmin
      .from("grievance_config")
      .select("id, ai_phone_number, helpline_text, display_title")
      .eq("is_active", true)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    assertNoDbError(error, "Failed to fetch grievance config");
    return data;
  },
};
