import { z } from "zod";
import {
  NOTIFICATION_AUDIENCES,
  NOTIFICATION_CATEGORIES,
} from "@mykaraikudi/constants";

export const registerDeviceSchema = z.object({
  device_token: z.string().min(10),
  platform: z.enum(["ios", "android", "web"]),
  language: z.string().default("ta"),
  is_guest: z.boolean().optional(),
});

export const createNotificationSchema = z.object({
  title: z.string().min(3).max(200),
  body: z.string().min(3).max(1000),
  category: z.enum(NOTIFICATION_CATEGORIES),
  target_audience: z.enum(NOTIFICATION_AUDIENCES),
  payload: z.record(z.string(), z.unknown()).optional(),
  locale: z.string().default("ta"),
});
