import { useRouter } from "expo-router";
import { MinisterSplash } from "@/src/features/splash/MinisterSplash";
import { useOnboardingStore } from "@/src/stores/onboarding-store";

export default function MinisterScreen() {
  const router = useRouter();
  const hasCompleted = useOnboardingStore((s) => s.hasCompletedOnboarding);

  return (
    <MinisterSplash
      onComplete={() => {
        if (hasCompleted) {
          router.replace("/(tabs)");
        } else {
          router.replace("/(onboarding)/slides");
        }
      }}
    />
  );
}
