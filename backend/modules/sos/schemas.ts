import { z } from "zod";
import { SOS_CONTACT_TYPES } from "@mykaraikudi/constants";

export const upsertSosProfileSchema = z.object({
  emergency_contact_name: z.string().min(2).max(100),
  emergency_contact_phone: z.string().min(10).max(15),
  custom_message: z.string().max(300).optional(),
  countdown_seconds: z.number().int().min(3).max(30).default(5),
});

export const createEmergencyContactSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(3).max(20),
  contact_type: z.enum(SOS_CONTACT_TYPES),
  sort_order: z.number().int().default(0),
});

export const triggerSosSchema = z.object({
  confirmed: z.literal(true),
});

export type UpsertSosProfileInput = z.infer<typeof upsertSosProfileSchema>;
