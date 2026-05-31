import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { FadeIn, Text, useTheme } from "@mykaraikudi/ui";

import type { Business } from "../types";
import { BusinessCard } from "./BusinessCard";

type Section = {
  key: string;
  titleKey: string;
  items: Business[];
};

type Props = {
  trending: Business[];
  recent: Business[];
  verified: Business[];
};

function SectionBlock({ titleKey, items }: { titleKey: string; items: Business[] }) {
  const { t: tr } = useTranslation();
  const t = useTheme();

  if (items.length === 0) return null;

  return (
    <FadeIn style={styles.section}>
      <Text size="md" weight="semibold" style={{ marginBottom: t.spacing.sm }}>
        {tr(titleKey)}
      </Text>
      {items.map((business) => (
        <BusinessCard key={business.id} business={business} variant="vertical" />
      ))}
    </FadeIn>
  );
}

export const TrendingBusinesses = memo(function TrendingBusinesses({
  trending,
  recent,
  verified,
}: Props) {
  const { t: tr } = useTranslation();
  const t = useTheme();

  const sections: Section[] = [
    { key: "trending", titleKey: "businesses.trendingTitle", items: trending },
    { key: "recent", titleKey: "businesses.recentTitle", items: recent },
    { key: "verified", titleKey: "businesses.verifiedTitle", items: verified },
  ];

  const hasAny = sections.some((s) => s.items.length > 0);
  if (!hasAny) return null;

  return (
    <View>
      <Text size="lg" weight="semibold" style={{ marginBottom: t.spacing.md }}>
        {tr("businesses.discoverMore")}
      </Text>
      {sections.map((section) => (
        <SectionBlock
          key={section.key}
          titleKey={section.titleKey}
          items={section.items}
        />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
});
