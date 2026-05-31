import React, { memo } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { FadeIn, ScalePress, Text, useTheme } from "@mykaraikudi/ui";

import { JOB_CATEGORIES } from "../data/categories";
import type { JobCategory } from "../types";

const GAP = 10;
const H_PAD = 20;

type Props = {
  selectedSlug: string | null;
  onSelect: (slug: string) => void;
};

function CategoryCard({
  category,
  selected,
  width,
  onPress,
}: {
  category: JobCategory;
  selected: boolean;
  width: number;
  onPress: () => void;
}) {
  const { t: tr } = useTranslation();

  return (
    <ScalePress onPress={onPress} style={{ width }}>
      <LinearGradient
        colors={[...category.gradient]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, selected && styles.cardSelected]}
      >
        <Ionicons
          name={category.icon as keyof typeof Ionicons.glyphMap}
          size={20}
          color="#FFFFFF"
        />
        <Text size="xs" weight="semibold" style={styles.cardTitle} numberOfLines={2}>
          {tr(category.titleKey)}
        </Text>
      </LinearGradient>
    </ScalePress>
  );
}

export const JobCategoryGrid = memo(function JobCategoryGrid({
  selectedSlug,
  onSelect,
}: Props) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const { width: screenWidth } = useWindowDimensions();
  const columns = screenWidth >= 900 ? 4 : screenWidth >= 600 ? 3 : 2;
  const cardWidth =
    (screenWidth - H_PAD * 2 - GAP * (columns - 1)) / columns;

  return (
    <View>
      <Text size="lg" weight="semibold" style={{ marginBottom: t.spacing.md }}>
        {tr("jobs.categoriesTitle")}
      </Text>
      <View style={[styles.grid, { gap: GAP }]}>
        {JOB_CATEGORIES.map((cat, index) => (
          <FadeIn key={cat.id} delay={index * 35}>
            <CategoryCard
              category={cat}
              selected={selectedSlug === cat.slug}
              width={cardWidth}
              onPress={() => onSelect(cat.slug)}
            />
          </FadeIn>
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap" },
  card: {
    minHeight: 88,
    borderRadius: 16,
    padding: 12,
    justifyContent: "space-between",
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.6)",
  },
  cardTitle: { color: "#FFFFFF", lineHeight: 16, marginTop: 8 },
});
