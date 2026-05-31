import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, useTheme } from "@mykaraikudi/ui";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import {
  Cormorant_600SemiBold,
  Cormorant_500Medium_Italic,
} from "@expo-google-fonts/cormorant";
import * as SplashScreen from "expo-splash-screen";
import { I18nextProvider } from "react-i18next";

import "../lib/i18n";
import { queryClient } from "../lib/query-client";
import i18n from "../lib/i18n";
import { useOnboardingStore } from "../stores/onboarding-store";
import { useAuthStore } from "../stores/auth-store";

SplashScreen.preventAutoHideAsync().catch(() => {});

function FontGate({ children }: { children: React.ReactNode }) {
  const t = useTheme();
  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Cormorant_600SemiBold,
    Cormorant_500Medium_Italic,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [loaded]);

  if (!loaded) {
    return (
      <View style={[styles.loading, { backgroundColor: t.colors.background }]}>
        <ActivityIndicator color={t.colors.accent} />
      </View>
    );
  }

  return <>{children}</>;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const hasHydrated = useOnboardingStore((s) => s.hasHydrated);
  const ensureHydrated = useAuthStore((s) => s.ensureHydrated);

  useEffect(() => {
    void ensureHydrated();
  }, [ensureHydrated]);

  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <FontGate>
            {hasHydrated ? children : (
              <BootstrapLoading />
            )}
          </FontGate>
        </ThemeProvider>
      </I18nextProvider>
    </QueryClientProvider>
  );
}

function BootstrapLoading() {
  const t = useTheme();
  return (
    <View style={[styles.loading, { backgroundColor: t.colors.background }]}>
      <ActivityIndicator color={t.colors.accent} />
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
