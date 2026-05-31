import { AppError } from "../../utils/errors";
import {
  evaluateEligibility,
  type EligibilityRuleSet,
} from "../../services/welfare-engine.service";
import { welfareRepository } from "./repository";
import type { SubmitWelfareApplicationInput } from "./schemas";

export const welfareService = {
  listSchemes() {
    return welfareRepository.listSchemes();
  },

  async getScheme(id: string) {
    const scheme = await welfareRepository.getScheme(id);
    if (!scheme) throw AppError.notFound("Welfare scheme");
    return scheme;
  },

  async checkEligibility(schemeId: string, responses: Record<string, unknown>) {
    const rules = await welfareRepository.getActiveRules(schemeId);

    if (rules.length === 0) {
      return {
        eligible: true,
        matchedRules: [],
        failedRules: [],
        score: 1,
        message: "No rules configured for this scheme",
      };
    }

    const combined: EligibilityRuleSet = {
      version: 1,
      groups: rules.flatMap(
        (r: { rule_definition: EligibilityRuleSet }) => r.rule_definition.groups
      ),
    };

    const ruleNames: Record<number, string> = {};
    rules.forEach((r: { rule_name: string }, i: number) => {
      ruleNames[i] = r.rule_name;
    });

    return evaluateEligibility(combined, responses, ruleNames);
  },

  async submitApplication(input: SubmitWelfareApplicationInput, userId: string) {
    const scheme = await welfareRepository.getScheme(input.scheme_id);
    if (!scheme) throw AppError.notFound("Welfare scheme");

    const eligibility = await this.checkEligibility(
      input.scheme_id,
      input.form_responses
    );

    return welfareRepository.saveApplication(
      input,
      userId,
      eligibility as unknown as Record<string, unknown>
    );
  },

  getUserApplications(userId: string) {
    return welfareRepository.getUserApplications(userId);
  },
};
