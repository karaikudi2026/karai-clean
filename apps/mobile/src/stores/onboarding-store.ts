import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const STORAGE_KEY = "mykaraikudi.onboarding";

interface OnboardingState {
  hasCompletedOnboarding: boolean;
  hasHydrated: boolean;
  replayRequested: boolean;

  setCompleted: () => void;
  openReplay: () => void;
  clearReplay: () => void;
  setHydrated: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      hasCompletedOnboarding: false,
      hasHydrated: false,
      replayRequested: false,

      setCompleted: () =>
        set({
          hasCompletedOnboarding: true,
          replayRequested: false,
        }),

      openReplay: () =>
        set({
          replayRequested: true,
        }),

      clearReplay: () =>
        set({
          replayRequested: false,
        }),

      setHydrated: () =>
        set({
          hasHydrated: true,
        }),
    }),
    {
      name: STORAGE_KEY,

      storage: createJSONStorage(() => AsyncStorage),

      partialize: (state) => ({
        hasCompletedOnboarding: state.hasCompletedOnboarding,
      }),

      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);