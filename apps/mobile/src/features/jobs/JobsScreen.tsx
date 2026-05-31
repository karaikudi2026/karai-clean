import React, { memo, useCallback } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { FadeIn, Text, useTheme } from "@mykaraikudi/ui";

import {
  FeaturedJobsCarousel,
  JobCategoryGrid,
  JobEmptyState,
  JobSearchBar,
  PostJobCTA,
  TrendingJobs,
} from "./components";
import { useJobDiscovery } from "./hooks/use-job-discovery";

const H_PADDING = 20;

export const JobsScreen = memo(function JobsScreen() {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const {
    searchQuery,
    setSearchQuery,
    selectedCategorySlug,
    selectedLocation,
    setSelectedLocation,
    toggleCategory,
    clearFilters,
    hasActiveFilters,
    featured,
    urgent,
    remote,
    fresher,
    government,
    womenFocused,
    isEmpty,
    filtered,
  } = useJobDiscovery();

  const featuredIds = new Set(featured.map((j) => j.id));
  const withoutFeatured = (items: typeof filtered) =>
    items.filter((j) => !featuredIds.has(j.id));

  const goPostJob = useCallback(() => {
    router.push("/jobs/post");
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
            {tr("jobs.pageTitle")}
          </Text>
          <Text
            size="md"
            color="textSecondary"
            style={{ marginTop: t.spacing.xs, lineHeight: 24 }}
          >
            {tr("jobs.pageSubtitle")}
          </Text>
        </FadeIn>

        <View style={{ marginTop: t.spacing.lg }}>
          <JobSearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFilterPress={() => {
              if (hasActiveFilters) clearFilters();
            }}
            hasActiveFilters={hasActiveFilters}
            selectedLocation={selectedLocation}
            onLocationChange={setSelectedLocation}
          />
        </View>

        <View style={{ marginTop: t.spacing.lg }}>
          <PostJobCTA onPress={goPostJob} />
        </View>

        <View style={{ marginTop: t.spacing.xl }}>
          <JobCategoryGrid
            selectedSlug={selectedCategorySlug}
            onSelect={toggleCategory}
          />
        </View>

        {isEmpty ? (
          <JobEmptyState
            onClearFilters={clearFilters}
            onSuggestCategory={toggleCategory}
          />
        ) : (
          <>
            <View style={{ marginTop: t.spacing.xl }}>
              <FeaturedJobsCarousel jobs={featured} />
            </View>

            <View style={{ marginTop: t.spacing.xl }}>
              <TrendingJobs
                urgent={withoutFeatured(urgent)}
                remote={withoutFeatured(remote)}
                fresher={withoutFeatured(fresher)}
                government={withoutFeatured(government)}
                womenFocused={withoutFeatured(womenFocused)}
              />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  root: { flex: 1 },
});
