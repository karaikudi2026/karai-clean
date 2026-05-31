import { z } from "zod";
import { AppError } from "./errors";

export function parseOrThrow<T extends z.ZodType>(
  schema: T,
  data: unknown
): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw AppError.validation("Validation failed", result.error.flatten());
  }
  return result.data;
}

export const uuidSchema = z.string().uuid();

export const optionalUrlSchema = z
  .string()
  .url()
  .optional()
  .or(z.literal("").transform(() => undefined));

export const phoneSchema = z
  .string()
  .min(10)
  .max(15)
  .regex(/^[+]?[\d\s-]+$/, "Invalid phone number format");

export const imageUrlSchema = z.string().url().optional();
