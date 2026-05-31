import { supabaseAdmin } from "../../config/supabase";
import { assertNoDbError } from "../../utils/db";

export const appContentRepository = {
  async listOnboardingSlides() {
    const { data, error } = await supabaseAdmin
      .from("onboarding_slides")
      .select("id, title, subtitle, image_url, sort_order")
      .eq("is_active", true)
      .order("sort_order");

    assertNoDbError(error, "Failed to list onboarding slides");
    return data ?? [];
  },
};
