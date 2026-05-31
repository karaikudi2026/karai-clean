import { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@mykaraikudi/ui";
import { useOnboardingStore } from "@/src/stores/onboarding-store";

/**
 * Entry router — sends users through launch cinematic, then onboarding (first install), then tabs.
 */
export default function Index() {
  const router = useRouter();
  const t = useTheme();
  const hasHydrated = useOnboardingStore((s) => s.hasHydrated);
  const hasCompleted = useOnboardingStore((s) => s.hasCompletedOnboarding);
  const replayRequested = useOnboardingStore((s) => s.replayRequested);

  useEffect(() => {
    if (!hasHydrated) return;

    if (replayRequested) {
      router.replace("/(onboarding)/slides");
      return;
    }

    router.replace("/(launch)/splash");
  }, [hasHydrated, hasCompleted, replayRequested, router]);

  return (
    <View style={[styles.root, { backgroundColor: t.colors.background }]}>
      <ActivityIndicator color={t.colors.accent} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
