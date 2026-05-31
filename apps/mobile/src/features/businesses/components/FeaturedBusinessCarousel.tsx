import React, { memo } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { FadeIn, Text, useTheme } from "@mykaraikudi/ui";

import type { Business } from "../types";
import { BusinessCard, FEATURED_CARD_WIDTH } from "./BusinessCard";

type Props = {
  businesses: Business[];
};

export const FeaturedBusinessCarousel = memo(function FeaturedBusinessCarousel({
  businesses,
}: Props) {
  const t = useTheme();
  const { t: tr } = useTranslation();

  if (businesses.length === 0) return null;

  return (
    <FadeIn>
      <Text size="lg" weight="semibold" style={{ marginBottom: t.spacing.md }}>
        {tr("businesses.featuredTitle")}
      </Text>
      <FlatList
        data={businesses}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        snapToInterval={FEATURED_CARD_WIDTH + 14}
        decelerationRate="fast"
        renderItem={({ item }) => (
          <BusinessCard business={item} variant="featured" />
        )}
      />
    </FadeIn>
  );
});

const styles = StyleSheet.create({
  list: {
    paddingRight: 20,
  },
});
