import "react-native-url-polyfill/auto";

import { createClient, type Session } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

const storage =
  Platform.OS === "web"
    ? undefined
    : AsyncStorage;

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage,
      persistSession: Platform.OS !== "web",
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  }
);

export async function getAccessTokenFromSession() {
  const { data } = await supabase.auth.getSession();
  return (data.session as Session | null)?.access_token ?? null;
}