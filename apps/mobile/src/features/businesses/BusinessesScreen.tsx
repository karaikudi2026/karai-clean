import React, { memo, useCallback } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { FadeIn, Text, useTheme } from "@mykaraikudi/ui";

import {
  BusinessCategoryGrid,
  BusinessEmptyState,
  BusinessSearchBar,
  FeaturedBusinessCarousel,
  RegisterBusinessCTA,
  TrendingBusinesses,
} from "./components";
import { useBusinessDiscovery } from "./hooks/use-business-discovery";

const H_PADDING = 20;

export const BusinessesScreen = memo(function BusinessesScreen() {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const {
    searchQuery,
    setSearchQuery,
    selectedCategorySlug,
    toggleCategory,
    clearFilters,
    hasActiveFilters,
    featured,
    trending,
    recent,
    verified,
    isEmpty,
    filtered,
  } = useBusinessDiscovery();

  const featuredIds = new Set(featured.map((b) => b.id));
  const listWithoutFeatured = (items: typeof filtered) =>
    items.filter((b) => !featuredIds.has(b.id));

  const goRegister = useCallback(() => {
    router.push("/businesses/register");
  }, [router]);

  return (
    <View style={[styles.root, { backgroundColor: t.colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + t.spacing.md,
          paddingBottom: insets.bottom + 120,
          paddingHorizontal: H_PADDING,
        }}
      >
        <FadeIn>
          <Text size="xxl" display weight="semibold">
            {tr("businesses.pageTitle")}
          </Text>
          <Text
            size="md"
            color="textSecondary"
            style={{ marginTop: t.spacing.xs, lineHeight: 24 }}
          >
            {tr("businesses.pageSubtitle")}
          </Text>
        </FadeIn>

        <View style={{ marginTop: t.spacing.lg }}>
          <BusinessSearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFilterPress={() => {
              if (hasActiveFilters) clearFilters();
            }}
            hasActiveFilters={hasActiveFilters}
          />
        </View>

        {hasActiveFilters && selectedCategorySlug ? (
          <FadeIn style={{ marginTop: t.spacing.sm }}>
            <Text size="sm" color="accent">
              {tr("businesses.filterActive")}
            </Text>
          </FadeIn>
        ) : null}

        <View style={{ marginTop: t.spacing.xl }}>
          <BusinessCategoryGrid
            selectedSlug={selectedCategorySlug}
            onSelect={toggleCategory}
          />
        </View>

        {isEmpty ? (
          <BusinessEmptyState
            onClearFilters={clearFilters}
            onSuggestCategory={toggleCategory}
          />
        ) : (
          <>
            <View style={{ marginTop: t.spacing.xl }}>
              <FeaturedBusinessCarousel businesses={featured} />
            </View>

            <View style={{ marginTop: t.spacing.xl }}>
              <TrendingBusinesses
                trending={listWithoutFeatured(trending)}
                recent={listWithoutFeatured(recent)}
                verified={listWithoutFeatured(verified)}
              />
            </View>
          </>
        )}

        <View style={{ marginTop: t.spacing.xl }}>
          <RegisterBusinessCTA onPress={goRegister} />
        </View>
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
