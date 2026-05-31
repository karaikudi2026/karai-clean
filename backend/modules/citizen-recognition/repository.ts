import { supabaseAdmin } from "../../config/supabase";
import { assertNoDbError } from "../../utils/db";

export const citizenRecognitionRepository = {
  async getPlaceholder() {
    const { data, error } = await supabaseAdmin
      .from("citizen_recognition_config")
      .select("is_locked, launch_message, teaser_title")
      .limit(1)
      .maybeSingle();

    assertNoDbError(error, "Failed to fetch citizen recognition config");
    return data;
  },
};
