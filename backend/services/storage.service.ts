import { env } from "../config/env";
import { supabaseAdmin } from "../config/supabase";
import { AppError } from "../utils/errors";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export interface UploadImageInput {
  buffer: Buffer;
  mimeType: string;
  folder: string;
  fileName: string;
}

/**
 * CDN-ready image upload via Supabase Storage.
 * Clients should prefer direct signed uploads in a later phase;
 * this service supports admin/server-side uploads now.
 */
export async function uploadImage(input: UploadImageInput): Promise<string> {
  if (!ALLOWED_MIME_TYPES.has(input.mimeType)) {
    throw AppError.badRequest(
      "Only JPEG, PNG, and WebP images are allowed"
    );
  }

  if (input.buffer.byteLength > env.STORAGE_MAX_IMAGE_BYTES) {
    throw AppError.badRequest(
      `Image exceeds maximum size of ${env.STORAGE_MAX_IMAGE_BYTES} bytes`
    );
  }

  const path = `${input.folder}/${input.fileName}`;

  const { error } = await supabaseAdmin.storage
    .from(env.STORAGE_BUCKET)
    .upload(path, input.buffer, {
      contentType: input.mimeType,
      upsert: false,
      cacheControl: "31536000",
    });

  if (error) {
    throw AppError.internal(`Image upload failed: ${error.message}`);
  }

  const { data } = supabaseAdmin.storage
    .from(env.STORAGE_BUCKET)
    .getPublicUrl(path);

  return data.publicUrl;
}

export function getOptimizedImageUrl(
  publicUrl: string,
  _options?: { width?: number; quality?: number }
): string {
  // Supabase image transformation params when enabled on project
  return publicUrl;
}
