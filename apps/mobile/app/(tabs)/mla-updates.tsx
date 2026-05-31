import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useTheme, FadeIn, Text, Image } from "@mykaraikudi/ui";

import { API_BASE_PATH, API_ROUTES } from "@mykaraikudi/constants";
import { useLocaleStore } from "@/src/stores/locale-store";

type MlaUpdate = {
  id: string;
  title: string;
  summary: string;
  content?: string | null;
  image_url?: string | null;
  image_alt?: string | null;
  published_at?: string | null;
};

type MockBilingual = {
  id: string;
  title_en: string;
  title_ta: string;
  summary_en: string;
  summary_ta: string;
  image_url: string;
  image_alt: string;
};

const MOCK_UPDATES: MockBilingual[] = [
  {
    id: "tkp-scheme-card",
    title_en: "Dr. T. K. Prabhu introduces new welfare schemes for Karaikudi",
    title_ta:
      "காரைக்குடிக்கான புதிய நலத்திட்டங்களை அமைச்சர் திரு. டி. கே. பிரபு அறிமுகப்படுத்துகிறார்",
    summary_en:
      "Subsidized essentials and targeted support for eligible families begin this month across Karaikudi constituency.",
    summary_ta:
      "இந்த மாதம் காரைக்குடி தொகுதி முழுவதும் தகுதியுள்ள குடும்பங்களுக்கு மானிய அத்தியாவசிய உதவிகள் மற்றும் இலக்கு ஆதரவு தொடங்குகிறது.",
    image_url:
      "https://images.unsplash.com/photo-1529253354667-75d1e3f44f3c?auto=format&fit=crop&w=1200&q=80",
    image_alt: "Civic announcement",
  },
  {
    id: "tkp-roads-water",
    title_en: "Road construction + drinking water connections announced",
    title_ta:
      "சாலை அமைப்பு + குடிநீர் இணைப்புகள் அறிவிப்பு",
    summary_en:
      "Road improvement works and new water connections will be taken up in priority wards to reduce daily hardships.",
    summary_ta:
      "தினசரி சிரமங்களை குறைக்க முன்னுரிமை வார்டுகளில் சாலை மேம்பாடு பணிகள் மற்றும் புதிய குடிநீர் இணைப்புகள் மேற்கொள்ளப்படும்.",
    image_url:
      "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80",
    image_alt: "Road and water infrastructure",
  },
  {
    id: "tkp-housing-access",
    title_en: "Improving access to services for citizens",
    title_ta:
      "குடிமக்களுக்கு சேவைகளை எளிதாக பெறும் வசதி",
    summary_en:
      "A coordinated approach to faster grievance resolution and service desk handholding across the constituency.",
    summary_ta:
      "தொகுதி முழுவதும் புகார் தீர்வு விரைவுபடுத்தும் ஒருங்கிணைந்த அணுகுமுறை மற்றும் சேவை மைய உதவிகள்.",
    image_url:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
    image_alt: "Community support",
  },
];

export default function MlaUpdatesScreen() {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const insets = useSafeAreaInsets();

  const locale = useLocaleStore((s) => s.locale);

  const [updates, setUpdates] = useState<MlaUpdate[] | null>(null);

  const title = tr("dashboard.mlaUpdates");
  const subtitle = tr("dashboard.mlaUpdatesSub");

  useEffect(() => {
    const baseUrl = process.env.EXPO_PUBLIC_API_URL ?? "";
    if (!baseUrl) {
      setUpdates(null);
      return;
    }

    void (async () => {
      try {
        const res = await fetch(`${baseUrl}${API_BASE_PATH}${API_ROUTES.mlaUpdates}`);
        const json = await res.json();
        const items: MlaUpdate[] = (json?.data ?? json) as MlaUpdate[];
        // Public list uses sendSuccess(reply, items, 200, meta)
        setUpdates(Array.isArray(items) ? items : []);
      } catch {
        setUpdates(null);
      }
    })();
  }, []);

  const displayUpdates: MlaUpdate[] = useMemo(() => {
    if (updates) return updates;
    return MOCK_UPDATES.map((m) => ({
      id: m.id,
      title: locale === "ta" ? m.title_ta : m.title_en,
      summary: locale === "ta" ? m.summary_ta : m.summary_en,
      image_url: m.image_url,
      image_alt: m.image_alt,
    }));
  }, [locale, updates]);

  const hasItems = displayUpdates.length > 0;

  return (
    <View style={[styles.root, { backgroundColor: t.colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 60,
          paddingTop: insets.top + 16,
        }}
      >
        <FadeIn>
          <View style={styles.header}>
            <View>
              <Text size="xxl" display weight="semibold">
                {title}
              </Text>
              <Text size="md" color="textSecondary" style={{ marginTop: t.spacing.xs }}>
                {subtitle}
              </Text>
            </View>
            <View style={styles.headerIcon}>
              <Ionicons name="newspaper-outline" size={22} color={t.colors.heritageGold} />
            </View>
          </View>

          <LinearGradient
            colors={[t.colors.accent, "#2B3A52", "#171F2B"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <View style={styles.heroGlow} />
            <Text size="sm" weight="semibold" color="textInverse">
              {locale === "ta" ? "இன்றைய முக்கிய அறிவிப்புகள்" : "Today’s important announcements"}
            </Text>
          </LinearGradient>
        </FadeIn>

        {hasItems ? (
          <View style={{ marginTop: t.spacing.lg, gap: t.spacing.md }}>
            {displayUpdates.map((u, idx) => (
              <FadeIn key={u.id} delay={idx * 60} duration={t.motion.duration.slow}>
                <View style={[styles.card, t.shadows.md]}>
                  {u.image_url ? (
                    <View style={styles.imageWrap}>
                      <Image
                        source={{ uri: u.image_url }}
                        style={styles.image}
                        contentFit="cover"
                      />
                      <View style={styles.imageOverlay} />
                    </View>
                  ) : null}

                  <View style={styles.cardBody}>
                    <View style={styles.metaRow}>
                      {u.published_at ? (
                        <Text size="xs" color="textTertiary">
                          {new Date(u.published_at).toLocaleDateString()}
                        </Text>
                      ) : (
                        <Text size="xs" color="textTertiary">
                          {locale === "ta" ? "புதுப்பிப்பு" : "Update"}
                        </Text>
                      )}
                      <View style={styles.metaDot} />
                      <Text size="xs" color="textTertiary">
                        {locale === "ta" ? "திரு. டி. கே. பிரபு" : "Dr. T. K. Prabhu"}
                      </Text>
                    </View>

                    <Text size="md" weight="semibold" style={{ marginTop: 8 }} numberOfLines={2}>
                      {u.title}
                    </Text>
                    <Text size="sm" color="textSecondary" style={{ marginTop: 6 }} numberOfLines={2}>
                      {u.summary}
                    </Text>

                    <Pressable
                      accessibilityRole="button"
                      style={({ pressed }) => [
                        styles.cardAction,
                        { opacity: pressed ? 0.9 : 1 },
                      ]}
                      onPress={() => {}}
                    >
                      <Text size="sm" weight="semibold" color="accent">
                        {locale === "ta" ? "மேலும்" : "More"}
                      </Text>
                      <Ionicons name="arrow-forward" size={18} color={t.colors.accent} />
                    </Pressable>
                  </View>
                </View>
              </FadeIn>
            ))}
          </View>
        ) : (
          <View style={styles.empty}>
            <Text size="lg" weight="semibold">
              {locale === "ta" ? "இப்போது செய்திகள் இல்லை" : "No updates yet"}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "rgba(196,165,116,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  hero: {
    marginTop: 16,
    borderRadius: 20,
    padding: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(196,165,116,0.18)",
  },
  heroGlow: {
    position: "absolute",
    top: -60,
    right: -50,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(196,165,116,0.18)",
  },
  card: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderWidth: 1,
    borderColor: "rgba(26,26,26,0.06)",
  },
  imageWrap: {
    height: 160,
    position: "relative",
  },
  image: { width: "100%", height: "100%" },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.18)",
  },
  cardBody: { padding: 14 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  metaDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: "rgba(0,0,0,0.2)" },
  cardAction: { marginTop: 12, flexDirection: "row", alignItems: "center", gap: 8 },
  empty: { marginTop: 60, alignItems: "center" },
});

