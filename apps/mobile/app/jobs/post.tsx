import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import {
  AnimatedButton,
  FadeIn,
  Text,
  useTheme,
} from "@mykaraikudi/ui";

export default function PostJobScreen() {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.root, { backgroundColor: t.colors.background }]}>
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={t.colors.textPrimary} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <FadeIn>
          <LinearGradient
            colors={["#1A2332", "#C4A574"]}
            style={styles.heroIcon}
          >
            <Ionicons name="briefcase-outline" size={40} color="#fff" />
          </LinearGradient>

          <Text size="xxl" display weight="semibold" style={{ marginTop: 24 }}>
            {tr("jobs.postFormTitle")}
          </Text>
          <Text
            size="md"
            color="textSecondary"
            style={{ marginTop: t.spacing.sm, lineHeight: 24 }}
          >
            {tr("jobs.postFormSubtitle")}
          </Text>

          <View
            style={[
              styles.note,
              {
                backgroundColor: t.colors.accentSoft,
                borderColor: t.colors.border,
              },
            ]}
          >
            <Ionicons name="time-outline" size={20} color={t.colors.accent} />
            <Text size="sm" color="textSecondary" style={{ flex: 1, marginLeft: 10 }}>
              {tr("jobs.postFormNote")}
            </Text>
          </View>

          <AnimatedButton
            label={tr("common.comingSoon")}
            disabled
            fullWidth
            style={{ marginTop: t.spacing.xl }}
          />
        </FadeIn>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: { paddingHorizontal: 20, paddingBottom: 8 },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    paddingBottom: 48,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  note: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 24,
  },
});
