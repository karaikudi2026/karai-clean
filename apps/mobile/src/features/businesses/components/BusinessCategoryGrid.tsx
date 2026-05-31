import React, { memo } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { FadeIn, ScalePress, Text, useTheme } from "@mykaraikudi/ui";

import { BUSINESS_CATEGORIES } from "../data/categories";
import type { BusinessCategory } from "../types";

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
  category: BusinessCategory;
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
        style={[
          styles.card,
          selected && styles.cardSelected,
        ]}
      >
        <View
          style={[
            styles.iconWrap,
            selected && { backgroundColor: "rgba(255,255,255,0.28)" },
          ]}
        >
          <Ionicons
            name={category.icon as keyof typeof Ionicons.glyphMap}
            size={22}
            color="#FFFFFF"
          />
        </View>
        <Text
          size="sm"
          weight="semibold"
          style={styles.cardTitle}
          numberOfLines={2}
        >
          {tr(category.titleKey)}
        </Text>
      </LinearGradient>
    </ScalePress>
  );
}

export const BusinessCategoryGrid = memo(function BusinessCategoryGrid({
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
        {tr("businesses.categoriesTitle")}
      </Text>
      <View style={[styles.grid, { gap: GAP }]}>
        {BUSINESS_CATEGORIES.map((cat, index) => (
          <FadeIn key={cat.id} delay={index * 40}>
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  card: {
    minHeight: 96,
    borderRadius: 16,
    padding: 12,
    justifyContent: "space-between",
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.65)",
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    color: "#FFFFFF",
    lineHeight: 18,
  },
});
