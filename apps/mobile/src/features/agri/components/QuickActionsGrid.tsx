import React, { memo } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { Card, Text, useTheme, FadeIn } from "@mykaraikudi/ui";

import { useAuthStore } from "@/src/stores/auth-store";

const actions = [
  { key: "worker-register", title: "Register as Worker", icon: "person-add-outline" },
  { key: "worker-hire", title: "Hire Workers", icon: "briefcase-outline" },
  { key: "services", title: "Agri Services", icon: "storefront-outline" },
  { key: "support", title: "Water & Alerts", icon: "water-outline" },
];

export const QuickActionsGrid = memo(function QuickActionsGrid() {
  const t = useTheme();
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);

  const requireAuthOrGo = (redirectTo: string) => {
    if (!accessToken) {
      router.push(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
      return false;
    }
    return true;
  };

  return (
    <FadeIn>
      <View style={styles.grid}>
        {actions.map((a) => (
          <Pressable
            key={a.key}
            onPress={() => {
              const needsAuth = a.key === "worker-register" || a.key === "worker-hire";
              if (needsAuth && !requireAuthOrGo("/agri")) return;

              Alert.alert("Coming soon", `${a.title} feature will be added in Phase 2.`);
            }}
          >
            <Card style={styles.card}>
              <View style={styles.cardInner}>
                <View style={[styles.iconPill, { backgroundColor: "rgba(184,74,74,0.12)" }]}>
                  <Ionicons name={a.icon as any} size={20} color={t.colors.accent} />
                </View>
                <Text size="sm" weight="semibold" style={{ marginTop: 10 }}>
                  {a.title}
                </Text>
              </View>
            </Card>
          </Pressable>
        ))}
      </View>
    </FadeIn>
  );
});

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  card: {
    flex: 1,
    minWidth: 160,
    borderRadius: 22,
  },
  cardInner: {
    alignItems: "flex-start",
    gap: 8,
  },
  iconPill: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
});

