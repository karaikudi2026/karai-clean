import { z } from "zod";

export const listMandiQuerySchema = z.object({
  crop_name: z.string().optional(),
  date: z.string().date().optional(),
});

export const createLaborSchema = z.object({
  full_name: z.string().min(2).max(100),
  phone: z.string().min(10).max(15),
  skills: z.array(z.string()).min(1).max(10),
  availability: z.string().max(200).optional(),
  location_area: z.string().max(100).optional(),
  notes: z.string().max(500).optional(),
});

export const createMandiPriceSchema = z.object({
  crop_name: z.string().min(2).max(100),
  market_name: z.string().max(100).default("Karaikudi"),
  price_per_unit: z.number().positive(),
  unit: z.string().default("quintal"),
  price_date: z.string().date().optional(),
  source: z.string().optional(),
});

export const upsertWeatherSchema = z.object({
  forecast_date: z.string().date(),
  location_name: z.string().default("Karaikudi"),
  temp_min: z.number().optional(),
  temp_max: z.number().optional(),
  condition: z.string().optional(),
  humidity: z.number().optional(),
  rain_probability: z.number().optional(),
  wind_speed: z.number().optional(),
  advisory_text: z.string().max(500).optional(),
});

export const createAgriSchemeSchema = z.object({
  title: z.string().min(3).max(200),
  summary: z.string().min(10).max(600),
  eligibility: z.string().min(3).max(500),
  deadline: z.string().date().optional(),
  apply_url: z.string().url().optional(),
  state_name: z.string().default("Tamil Nadu"),
  district_name: z.string().optional(),
  department_contact_name: z.string().optional(),
  department_contact_phone: z.string().optional(),
  department_contact_email: z.string().email().optional(),
  is_active: z.boolean().default(true),
});

export const listAgriSchemesQuerySchema = z.object({
  state_name: z.string().optional(),
  district_name: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
});

export const createAgriServiceSchema = z.object({
  title: z.string().min(3).max(150),
  description: z.string().min(10).max(2000),
  contact_phone: z.string().optional(),
  contact_email: z.string().email().optional(),
  service_type: z.string().min(2).max(50),
  image_url: z.string().url().optional(),
  sort_order: z.number().int().default(0),
});

export type CreateLaborInput = z.infer<typeof createLaborSchema>;
export type CreateMandiPriceInput = z.infer<typeof createMandiPriceSchema>;
export type UpsertWeatherInput = z.infer<typeof upsertWeatherSchema>;
export type CreateAgriSchemeInput = z.infer<typeof createAgriSchemeSchema>;
export type ListAgriSchemesQuery = z.infer<typeof listAgriSchemesQuerySchema>;
export type CreateAgriServiceInput = z.infer<typeof createAgriServiceSchema>;
