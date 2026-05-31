import { z } from "zod";

export const submitWelfareApplicationSchema = z.object({
  scheme_id: z.string().uuid(),
  form_responses: z.record(z.string(), z.unknown()),
});

export const createWelfareSchemeSchema = z.object({
  name: z.string().min(3).max(200),
  description: z.string().min(10).max(5000),
  image_url: z.string().url().optional(),
  form_schema: z.record(z.string(), z.unknown()).default({}),
  is_active: z.boolean().default(true),
});

export const createEligibilityRuleSchema = z.object({
  scheme_id: z.string().uuid(),
  rule_name: z.string().min(2).max(100),
  rule_definition: z.object({
    version: z.number().default(1),
    groups: z.array(
      z.object({
        match: z.enum(["all", "any"]),
        rules: z.array(
          z.object({
            field: z.string(),
            operator: z.enum([
              "eq",
              "neq",
              "gt",
              "gte",
              "lt",
              "lte",
              "in",
              "not_in",
              "between",
              "exists",
            ]),
            value: z.unknown(),
          })
        ),
      })
    ),
  }),
  priority: z.number().int().default(0),
});

export type SubmitWelfareApplicationInput = z.infer<
  typeof submitWelfareApplicationSchema
>;
