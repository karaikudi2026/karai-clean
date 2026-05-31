import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Locale } from "@mykaraikudi/constants";
import i18n from "../lib/i18n";

const STORAGE_KEY = "mykaraikudi.locale";

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set, get) => ({
      locale: (i18n.language as Locale) || "ta",

      setLocale: (locale) => {
        void i18n.changeLanguage(locale);
        set({ locale });
      },

      toggleLocale: () => {
        const next: Locale = get().locale === "ta" ? "en" : "ta";
        get().setLocale(next);
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),

      onRehydrateStorage: () => (state) => {
        if (state?.locale) {
          void i18n.changeLanguage(state.locale);
        }
      },
    }
  )
);