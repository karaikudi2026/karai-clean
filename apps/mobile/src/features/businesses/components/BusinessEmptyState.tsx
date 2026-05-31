import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { AnimatedButton, FadeIn, Text, useTheme } from "@mykaraikudi/ui";

import { BUSINESS_CATEGORIES } from "../data/categories";

type Props = {
  onClearFilters: () => void;
  onSuggestCategory: (slug: string) => void;
};

export const BusinessEmptyState = memo(function BusinessEmptyState({
  onClearFilters,
  onSuggestCategory,
}: Props) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const suggestions = BUSINESS_CATEGORIES.slice(0, 4);

  return (
    <FadeIn style={styles.wrap}>
      <View
        style={[
          styles.illustration,
          { backgroundColor: t.colors.accentSoft },
        ]}
      >
        <Ionicons name="search" size={48} color={t.colors.accent} />
      </View>

      <Text size="xl" display weight="semibold" center>
        {tr("businesses.emptyTitle")}
      </Text>
      <Text
        size="md"
        color="textSecondary"
        center
        style={{ marginTop: t.spacing.sm, lineHeight: 24 }}
      >
        {tr("businesses.emptySubtitle")}
      </Text>

      <AnimatedButton
        label={tr("businesses.clearFilters")}
        variant="secondary"
        onPress={onClearFilters}
        style={{ marginTop: t.spacing.lg }}
      />

      <Text
        size="sm"
        weight="semibold"
        style={{ marginTop: t.spacing.xl, marginBottom: t.spacing.sm }}
      >
        {tr("businesses.tryCategories")}
      </Text>
      <View style={styles.chips}>
        {suggestions.map((cat) => (
          <AnimatedButton
            key={cat.id}
            label={tr(cat.titleKey)}
            variant="ghost"
            onPress={() => onSuggestCategory(cat.slug)}
            style={[
              styles.chip,
              {
                borderWidth: 1,
                borderColor: t.colors.border,
                backgroundColor: t.colors.backgroundElevated,
              },
            ]}
          />
        ))}
      </View>
    </FadeIn>
  );
});

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 8,
  },
  illustration: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  chip: {
    minHeight: 40,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
});
