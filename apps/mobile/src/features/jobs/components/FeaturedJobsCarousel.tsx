import React, { memo } from "react";
import { FlatList, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { FadeIn, Text, useTheme } from "@mykaraikudi/ui";

import type { Job } from "../types";
import { FEATURED_JOB_WIDTH, JobCard } from "./JobCard";

type Props = {
  jobs: Job[];
};

export const FeaturedJobsCarousel = memo(function FeaturedJobsCarousel({
  jobs,
}: Props) {
  const t = useTheme();
  const { t: tr } = useTranslation();

  if (jobs.length === 0) return null;

  return (
    <FadeIn>
      <Text size="lg" weight="semibold" style={{ marginBottom: t.spacing.md }}>
        {tr("jobs.featuredTitle")}
      </Text>
      <FlatList
        data={jobs}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        snapToInterval={FEATURED_JOB_WIDTH + 14}
        decelerationRate="fast"
        renderItem={({ item }) => <JobCard job={item} variant="featured" />}
      />
    </FadeIn>
  );
});

const styles = StyleSheet.create({
  list: { paddingRight: 20 },
});
