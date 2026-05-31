import React, { useEffect, useMemo, useState } from "react";
import { Linking, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme, Text, FadeIn } from "@mykaraikudi/ui";
import { LinearGradient } from "expo-linear-gradient";

import { API_BASE_PATH, API_ROUTES } from "@mykaraikudi/constants";
import { useLocaleStore } from "@/src/stores/locale-store";

type GrievanceConfig = {
  ai_phone_number: string | null;
  helpline_text: string | null;
  display_title: string | null;
};

const FALLBACK: GrievanceConfig = {
  ai_phone_number: "1800-000-0000",
  helpline_text: "Call the AI grievance helpline for assistance.",
  display_title: "Grievance Redressal",
};

export default function GrievanceScreen() {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const insets = useSafeAreaInsets();

  const locale = useLocaleStore((s) => s.locale);

  const [config, setConfig] = useState<GrievanceConfig>(FALLBACK);

  useEffect(() => {
    const baseUrl = process.env.EXPO_PUBLIC_API_URL ?? "";
    if (!baseUrl) return;

    void (async () => {
      try {
        const res = await fetch(
          `${baseUrl}${API_BASE_PATH}${API_ROUTES.grievance}`
        );
        const json = await res.json();
        // backend responds with sendSuccess(reply, data)
        setConfig(
          (json?.data ?? json) as GrievanceConfig
        );
      } catch {
        // Keep fallback
      }
    })();
  }, []);

  const phone = config.ai_phone_number ?? FALLBACK.ai_phone_number!;
  const title =
    locale === "ta"
      ? "காரைக்குடி தொகுதி புகார் எண் — 24*7"
      : "Karaikudi Constituency Grievance Number — 24*7";

  const subtitle =
    locale === "ta"
      ? "புகார் தீர்வுக்கான 24 மணி நேரமும் உதவி."
      : "24/7 assistance for grievance redressal.";

  const displayTitle = config.display_title ?? tr("dashboard.grievance");
  const helplineText = config.helpline_text ?? tr("dashboard.grievanceSub");

  const callLabel =
    locale === "ta" ? "அழைக்கவும்" : "Call now";

  const openTel = () => {
    void Linking.openURL(`tel:${phone.replace(/\s/g, "")}`);
  };

  const topFade = useMemo(() => ({ paddingTop: insets.top + 10 }), [insets.top]);

  return (
    <View style={[styles.root, { backgroundColor: t.colors.background }]}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.topBar, topFade]}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={22}
            color={t.colors.accent}
          />
          <Text size="sm" color="textSecondary" style={{ marginLeft: 10 }}>
            {displayTitle}
          </Text>
        </View>

        <FadeIn>
          <LinearGradient
            colors={[t.colors.accent, "#2B3A52", "#171F2B"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <View style={styles.glow} />

            <Text size="lg" weight="semibold" style={styles.heroTitle}>
              {title}
            </Text>
            <Text size="md" style={styles.heroPhone}>
              {phone}
            </Text>
            <Text size="sm" color="textSecondary" style={{ marginTop: 6 }}>
              {subtitle}
            </Text>

            <View style={styles.actions}>
              <Pressable
                onPress={openTel}
                accessibilityRole="button"
                accessibilityLabel={callLabel}
                style={({ pressed }) => [
                  styles.callBtn,
                  { opacity: pressed ? 0.9 : 1 },
                ]}
              >
                <Ionicons name="call" size={20} color="#fff" />
                <Text
                  size="sm"
                  weight="semibold"
                  color="textInverse"
                  style={{ marginLeft: 10 }}
                >
                  {callLabel}
                </Text>
              </Pressable>
            </View>
          </LinearGradient>

          <View style={[styles.infoCard, { marginTop: t.spacing.lg }]}>
            <Text size="md" weight="semibold">
              {locale === "ta"
                ? "புகார் ஆதரவு விவரம்"
                : "Grievance Support Details"}
            </Text>
            <Text
              size="sm"
              color="textSecondary"
              style={{ marginTop: 8, lineHeight: 24 }}
            >
              {helplineText}
            </Text>
            <Text
              size="xs"
              color="textTertiary"
              style={{ marginTop: 14, lineHeight: 20 }}
            >
              {locale === "ta"
                ? "காரைக்குடி குடிமக்கள் மற்றும் சுற்றுலாப் பயணிகளுக்காக."
                : "For citizens and visitors across Karaikudi."}
            </Text>
          </View>
        </FadeIn>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 4,
    marginBottom: 14,
  },
  hero: {
    borderRadius: 24,
    padding: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(196, 165, 116, 0.22)",
  },
  glow: {
    position: "absolute",
    top: -40,
    right: -30,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(196, 165, 116, 0.22)",
  },
  heroTitle: {
    maxWidth: 300,
    color: "#fff",
    letterSpacing: 0.2,
  },
  heroPhone: {
    marginTop: 10,
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
  },
  actions: {
    marginTop: 16,
  },
  callBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(196, 165, 116, 0.95)",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  infoCard: {
    borderRadius: 18,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
});

