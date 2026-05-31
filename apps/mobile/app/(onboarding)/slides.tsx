import { useRouter } from "expo-router";
import { OnboardingPager } from "@/src/features/onboarding/OnboardingPager";
import { useOnboardingStore } from "@/src/stores/onboarding-store";

export default function OnboardingSlidesScreen() {
  const router = useRouter();
  const setCompleted = useOnboardingStore((s) => s.setCompleted);
  const clearReplay = useOnboardingStore((s) => s.clearReplay);
  const replayRequested = useOnboardingStore((s) => s.replayRequested);

  const finish = () => {
    setCompleted();
    clearReplay();
    router.replace("/(tabs)");
  };

  return (
    <OnboardingPager
      showSkip={!replayRequested}
      onComplete={finish}
      onSkip={finish}
    />
  );
}
