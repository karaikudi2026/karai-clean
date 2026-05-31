import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "./env";

const clientOptions = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
} as const;

/** Public anon client — JWT verification and user-scoped operations */
export const supabaseAnon: SupabaseClient = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY,
  clientOptions
);

/** Service role client — backend-only; never expose to clients */
export const supabaseAdmin: SupabaseClient = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  clientOptions
);

/** @deprecated Use supabaseAdmin or supabaseAnon explicitly */
export const supabase = supabaseAdmin;
