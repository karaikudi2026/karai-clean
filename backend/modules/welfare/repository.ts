import { supabaseAdmin } from "../../config/supabase";
import { assertNoDbError } from "../../utils/db";
import type { SubmitWelfareApplicationInput } from "./schemas";
import type { EligibilityRuleSet } from "../../services/welfare-engine.service";

export const welfareRepository = {
  async listSchemes() {
    const { data, error } = await supabaseAdmin
      .from("welfare_schemes")
      .select("id, name, description, image_url, form_schema")
      .eq("is_active", true)
      .is("deleted_at", null)
      .order("name");

    assertNoDbError(error, "Failed to list welfare schemes");
    return data ?? [];
  },

  async getScheme(id: string) {
    const { data, error } = await supabaseAdmin
      .from("welfare_schemes")
      .select("*")
      .eq("id", id)
      .eq("is_active", true)
      .is("deleted_at", null)
      .maybeSingle();

    assertNoDbError(error, "Failed to fetch welfare scheme");
    return data;
  },

  async getActiveRules(schemeId: string) {
    const { data, error } = await supabaseAdmin
      .from("welfare_eligibility_rules")
      .select("id, rule_name, rule_definition, priority")
      .eq("scheme_id", schemeId)
      .eq("is_active", true)
      .order("priority");

    assertNoDbError(error, "Failed to fetch eligibility rules");
    return (data ?? []) as Array<{
      id: string;
      rule_name: string;
      rule_definition: EligibilityRuleSet;
      priority: number;
    }>;
  },

  async saveApplication(
    input: SubmitWelfareApplicationInput,
    userId: string,
    eligibilityResult: Record<string, unknown>
  ) {
    const { data, error } = await supabaseAdmin
      .from("welfare_applications")
      .insert({
        user_id: userId,
        scheme_id: input.scheme_id,
        form_responses: input.form_responses,
        eligibility_result: eligibilityResult,
        status: "submitted",
      })
      .select()
      .single();

    assertNoDbError(error, "Failed to submit welfare application");
    return data;
  },

  async getUserApplications(userId: string) {
    const { data, error } = await supabaseAdmin
      .from("welfare_applications")
      .select(
        `
        id, status, eligibility_result, created_at,
        welfare_schemes ( id, name )
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    assertNoDbError(error, "Failed to fetch applications");
    return data ?? [];
  },
};
