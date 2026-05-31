import { create } from "zustand";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/src/lib/supabase";

type AuthState = {
  isHydrated: boolean;
  session: Session | null;
  accessToken: string | null;
  userId: string | null;
  ensureHydrated: () => Promise<void>;
  signOut: () => Promise<void>;
};

let listenerStarted = false;

function deriveAuth(session: Session | null) {
  return {
    session,
    accessToken: session?.access_token ?? null,
    userId: session?.user?.id ?? null,
  };
}

export const useAuthStore = create<AuthState>()((set) => ({
  isHydrated: false,
  session: null,
  accessToken: null,
  userId: null,
  ensureHydrated: async () => {
    if (!listenerStarted) {
      listenerStarted = true;
      supabase.auth.onAuthStateChange((_event, session) => {
        set((prev) => ({
          ...prev,
          ...deriveAuth(session),
          isHydrated: true,
        }));
      });
    }

    const { data } = await supabase.auth.getSession();
    set((prev) => ({
      ...prev,
      ...deriveAuth(data.session ?? null),
      isHydrated: true,
    }));
  },
  signOut: async () => {
    await supabase.auth.signOut();
    set({
      isHydrated: true,
      session: null,
      accessToken: null,
      userId: null,
    });
  },
}));

