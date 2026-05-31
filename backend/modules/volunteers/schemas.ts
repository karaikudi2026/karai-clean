import { z } from "zod";
import { BLOOD_GROUPS } from "@mykaraikudi/constants";

export const createBloodDonorSchema = z.object({
  full_name: z.string().min(2).max(100),
  blood_group: z.enum(BLOOD_GROUPS),
  phone: z.string().min(10).max(15),
  location_area: z.string().max(100).optional(),
  last_donation_date: z.string().date().optional(),
  is_available: z.boolean().default(true),
});

export const listBloodDonorsQuerySchema = z.object({
  blood_group: z.enum(BLOOD_GROUPS).optional(),
  location: z.string().optional(),
});

export const createEnquirySchema = z.object({
  volunteer_group_id: z.string().uuid(),
  name: z.string().min(2).max(100),
  phone: z.string().min(10).max(15),
  message: z.string().max(500).optional(),
});

export const createVolunteerGroupSchema = z.object({
  name: z.string().min(2).max(150),
  description: z.string().min(10).max(2000),
  contact_phone: z.string().optional(),
  contact_email: z.string().email().optional(),
  image_url: z.string().url().optional(),
  location_area: z.string().optional(),
});

export type CreateBloodDonorInput = z.infer<typeof createBloodDonorSchema>;
export type CreateEnquiryInput = z.infer<typeof createEnquirySchema>;
export type CreateVolunteerGroupInput = z.infer<typeof createVolunteerGroupSchema>;
