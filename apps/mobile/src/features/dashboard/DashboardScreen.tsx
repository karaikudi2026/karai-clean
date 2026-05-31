import React, { useCallback, memo } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Pressable,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  HeroBanner,
  LanguageSwitch,
  ModuleTile,
  Text,
  useTheme,
} from "@mykaraikudi/ui";

import { GovernmentPulse } from "../government-pulse";
import { useLocaleStore } from "../../stores/locale-store";
import { useOnboardingStore } from "../../stores/onboarding-store";
import { DASHBOARD_MODULES } from "./module-config";

const COLUMN_GAP = 12;
const H_PADDING = 20;
const TILE_WIDTH =
  (Dimensions.get("window").width - H_PADDING * 2 - COLUMN_GAP) / 2;

export const DashboardScreen = memo(function DashboardScreen() {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const locale = useLocaleStore((s) => s.locale);
  const toggleLocale = useLocaleStore((s) => s.toggleLocale);
  const openReplay = useOnboardingStore((s) => s.openReplay);

  const handleInfo = useCallback(() => {
    openReplay();
    router.push("/(onboarding)/slides");
  }, [openReplay, router]);

  return (
    <View style={[styles.root, { backgroundColor: t.colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + t.spacing.sm,
          paddingBottom: insets.bottom + 100,
          paddingHorizontal: H_PADDING,
        }}
      >
        <View style={styles.topBar}>
          <View>
            <Text size="sm" color="textSecondary">
              {tr("common.appName")}
            </Text>
          </View>
          <View style={styles.topActions}>
            <Pressable
              onPress={handleInfo}
              hitSlop={12}
              style={({ pressed }) => [
                styles.iconBtn,
                {
                  backgroundColor: t.colors.backgroundElevated,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Ionicons
                name="information-circle-outline"
                size={22}
                color={t.colors.accent}
              />
            </Pressable>
            <LanguageSwitch locale={locale} onToggle={toggleLocale} />
          </View>
        </View>

        <View style={{ marginTop: t.spacing.md }}>
          <HeroBanner
            title={tr("dashboard.heroTitle")}
            subtitle={tr("dashboard.heroSubtitle")}
            badge={tr("dashboard.heroBadge")}
          />
        </View>

        <View style={{ marginTop: t.spacing.lg }}>
          <GovernmentPulse locale={locale} />
        </View>

        <Text
          size="lg"
          weight="semibold"
          style={{ marginTop: t.spacing.xl, marginBottom: t.spacing.md }}
        >
          {tr("dashboard.modulesTitle")}
        </Text>

        <View style={styles.grid}>
          {DASHBOARD_MODULES.map((mod, index) => (
            <View key={mod.id} style={{ width: TILE_WIDTH }}>
              <ModuleTile
                index={index}
                title={tr(mod.titleKey)}
                subtitle={tr(mod.subtitleKey)}
                locked={mod.locked}
                icon={
                  <Ionicons
                    name={mod.icon}
                    size={22}
                    color={t.colors.accent}
                  />
                }
                onPress={() => {
                  if (mod.id === "grievance") router.push("/grievance");
                  else if (mod.id === "mla-updates") router.push("/mla-updates");
                }}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: COLUMN_GAP,
  },
});
