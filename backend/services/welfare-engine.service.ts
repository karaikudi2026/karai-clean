/**
 * Rules-based welfare eligibility engine (no AI).
 * Rules are stored as JSON in welfare_eligibility_rules.rule_definition.
 */

export type RuleOperator =
  | "eq"
  | "neq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "in"
  | "not_in"
  | "between"
  | "exists";

export interface EligibilityRule {
  field: string;
  operator: RuleOperator;
  value: unknown;
}

export interface EligibilityRuleGroup {
  match: "all" | "any";
  rules: EligibilityRule[];
}

export interface EligibilityRuleSet {
  version: number;
  groups: EligibilityRuleGroup[];
}

export interface EligibilityEvaluationResult {
  eligible: boolean;
  matchedRules: string[];
  failedRules: string[];
  score: number;
}

function evaluateRule(
  rule: EligibilityRule,
  responses: Record<string, unknown>
): boolean {
  const actual = responses[rule.field];

  switch (rule.operator) {
    case "exists":
      return actual !== undefined && actual !== null && actual !== "";
    case "eq":
      return actual === rule.value;
    case "neq":
      return actual !== rule.value;
    case "gt":
      return Number(actual) > Number(rule.value);
    case "gte":
      return Number(actual) >= Number(rule.value);
    case "lt":
      return Number(actual) < Number(rule.value);
    case "lte":
      return Number(actual) <= Number(rule.value);
    case "in":
      return Array.isArray(rule.value) && rule.value.includes(actual);
    case "not_in":
      return Array.isArray(rule.value) && !rule.value.includes(actual);
    case "between": {
      const [min, max] = rule.value as [number, number];
      const num = Number(actual);
      return num >= min && num <= max;
    }
    default:
      return false;
  }
}

export function evaluateEligibility(
  ruleSet: EligibilityRuleSet,
  responses: Record<string, unknown>,
  ruleNames: Record<number, string> = {}
): EligibilityEvaluationResult {
  const matchedRules: string[] = [];
  const failedRules: string[] = [];

  const groupResults = ruleSet.groups.map((group, groupIndex) => {
    const results = group.rules.map((rule, ruleIndex) => {
      const passed = evaluateRule(rule, responses);
      const label =
        ruleNames[groupIndex * 100 + ruleIndex] ??
        `${rule.field}:${rule.operator}`;
      if (passed) matchedRules.push(label);
      else failedRules.push(label);
      return passed;
    });

    return group.match === "all"
      ? results.every(Boolean)
      : results.some(Boolean);
  });

  const eligible = groupResults.every(Boolean);
  const total = matchedRules.length + failedRules.length;
  const score = total === 0 ? 0 : matchedRules.length / total;

  return { eligible, matchedRules, failedRules, score };
}
