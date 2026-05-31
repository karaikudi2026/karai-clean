import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { FadeIn, Text, useTheme } from "@mykaraikudi/ui";

import type { Job } from "../types";
import { JobCard } from "./JobCard";

type Props = {
  urgent: Job[];
  remote: Job[];
  fresher: Job[];
  government: Job[];
  womenFocused: Job[];
};

function Section({
  titleKey,
  items,
}: {
  titleKey: string;
  items: Job[];
}) {
  const { t: tr } = useTranslation();
  const t = useTheme();

  if (items.length === 0) return null;

  return (
    <FadeIn style={styles.section}>
      <Text size="md" weight="semibold" style={{ marginBottom: t.spacing.sm }}>
        {tr(titleKey)}
      </Text>
      {items.map((job) => (
        <JobCard key={job.id} job={job} variant="vertical" />
      ))}
    </FadeIn>
  );
}

export const TrendingJobs = memo(function TrendingJobs(props: Props) {
  const { t: tr } = useTranslation();
  const t = useTheme();

  const hasAny =
    props.urgent.length > 0 ||
    props.remote.length > 0 ||
    props.fresher.length > 0 ||
    props.government.length > 0 ||
    props.womenFocused.length > 0;

  if (!hasAny) return null;

  return (
    <View>
      <Text size="lg" weight="semibold" style={{ marginBottom: t.spacing.md }}>
        {tr("jobs.trendingTitle")}
      </Text>
      <Section titleKey="jobs.urgentTitle" items={props.urgent} />
      <Section titleKey="jobs.remoteTitle" items={props.remote} />
      <Section titleKey="jobs.fresherTitle" items={props.fresher} />
      <Section titleKey="jobs.governmentTitle" items={props.government} />
      <Section titleKey="jobs.womenTitle" items={props.womenFocused} />
    </View>
  );
});

const styles = StyleSheet.create({
  section: { marginBottom: 20 },
});
