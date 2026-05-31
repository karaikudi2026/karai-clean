import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { AnimatedButton, FadeIn, Text, useTheme } from "@mykaraikudi/ui";

import { JOB_CATEGORIES } from "../data/categories";

type Props = {
  onClearFilters: () => void;
  onSuggestCategory: (slug: string) => void;
};

export const JobEmptyState = memo(function JobEmptyState({
  onClearFilters,
  onSuggestCategory,
}: Props) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const suggestions = JOB_CATEGORIES.slice(0, 4);

  return (
    <FadeIn style={styles.wrap}>
      <View
        style={[styles.icon, { backgroundColor: t.colors.accentSoft }]}
      >
        <Ionicons name="briefcase-outline" size={44} color={t.colors.accent} />
      </View>
      <Text size="xl" display weight="semibold" center>
        {tr("jobs.emptyTitle")}
      </Text>
      <Text
        size="md"
        color="textSecondary"
        center
        style={{ marginTop: t.spacing.sm, lineHeight: 24 }}
      >
        {tr("jobs.emptySubtitle")}
      </Text>
      <AnimatedButton
        label={tr("jobs.clearFilters")}
        variant="secondary"
        onPress={onClearFilters}
        style={{ marginTop: t.spacing.lg }}
      />
      <Text
        size="sm"
        weight="semibold"
        style={{ marginTop: t.spacing.xl, marginBottom: t.spacing.sm }}
      >
        {tr("jobs.tryCategories")}
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
  wrap: { alignItems: "center", paddingVertical: 32 },
  icon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  chips: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8 },
  chip: { minHeight: 40, paddingVertical: 8, paddingHorizontal: 12 },
});
