import React, { memo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { FadeIn, Text, useTheme } from "@mykaraikudi/ui";

import { WeatherSummaryCard } from "./components/WeatherSummaryCard";
import { MarketPricesCard } from "./components/MarketPricesCard";
import { GovernmentSchemesSection } from "./components/GovernmentSchemesSection";
import { QuickActionsGrid } from "./components/QuickActionsGrid";
import { AgriSupportSection } from "./components/AgriSupportSection";

const H_PADDING = 20;

export const AgriHomeScreen = memo(function AgriHomeScreen() {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { backgroundColor: t.colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + t.spacing.md,
          paddingBottom: insets.bottom + 140,
          paddingHorizontal: H_PADDING,
          gap: 16,
        }}
      >
        <FadeIn>
          <Text size="xxl" display weight="semibold">
            {tr("tabs.agri")}
          </Text>
          <Text
            size="md"
            color="textSecondary"
            style={{ marginTop: 6, lineHeight: 24 }}
          >
            {tr("dashboard.agriSub")}
          </Text>
        </FadeIn>

        <WeatherSummaryCard />

        <MarketPricesCard />

        <QuickActionsGrid />

        {/* Keep the home uncluttered: schemes are the main "vertical" content here. */}
        <GovernmentSchemesSection />

        <AgriSupportSection />
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

