import React, { memo } from "react";
import { Linking, Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import {
  AnimatedButton,
  Card,
  Image,
  ScalePress,
  Text,
  useTheme,
} from "@mykaraikudi/ui";

import type { Job } from "../types";

type Variant = "featured" | "vertical";

type Props = {
  job: Job;
  variant?: Variant;
  onApply?: () => void;
};

export const JobCard = memo(function JobCard({
  job,
  variant = "vertical",
  onApply,
}: Props) {
  const t = useTheme();
  const { t: tr } = useTranslation();

  const handleApply = () => {
    if (onApply) {
      onApply();
      return;
    }
    void Linking.openURL("mailto:careers@mykaraikudi.app?subject=Job%20Application");
  };

  if (variant === "featured") {
    return (
      <ScalePress style={styles.featuredWrap}>
        <Card elevated padding="sm" style={styles.featuredCard}>
          <View style={styles.featuredTop}>
            {job.imageUrl ? (
              <Image
                source={{ uri: job.imageUrl }}
                style={styles.logo}
                contentFit="cover"
                radius={12}
              />
            ) : (
              <View
                style={[
                  styles.logoFallback,
                  { backgroundColor: t.colors.surfaceMuted },
                ]}
              >
                <Ionicons name="business" size={24} color={t.colors.accent} />
              </View>
            )}
            <View style={styles.featuredHead}>
              <Text size="md" weight="semibold" numberOfLines={2}>
                {job.title}
              </Text>
              <Text size="sm" color="textSecondary" numberOfLines={1}>
                {job.company}
              </Text>
              {job.isVerified ? (
                <View style={styles.verifiedRow}>
                  <Ionicons
                    name="shield-checkmark"
                    size={12}
                    color={t.colors.heritageGold}
                  />
                  <Text size="xs" color="accent" style={{ marginLeft: 4 }}>
                    {tr("jobs.verified")}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          <View style={styles.metaGrid}>
            {job.salary ? (
              <MetaChip icon="cash-outline" label={job.salary} />
            ) : null}
            <MetaChip icon="location-outline" label={job.location} />
            {job.employmentType ? (
              <MetaChip icon="time-outline" label={job.employmentType} />
            ) : null}
            {job.experience ? (
              <MetaChip icon="ribbon-outline" label={job.experience} />
            ) : null}
          </View>

          {job.postedAt ? (
            <Text size="xs" color="textTertiary" style={{ marginTop: 8 }}>
              {job.postedAt}
            </Text>
          ) : null}

          <AnimatedButton
            label={tr("jobs.quickApply")}
            onPress={handleApply}
            style={{ marginTop: 12 }}
            fullWidth
          />
        </Card>
      </ScalePress>
    );
  }

  return (
    <ScalePress style={styles.verticalWrap}>
      <Card elevated padding="md" style={styles.verticalCard}>
        <View style={styles.verticalRow}>
          {job.imageUrl ? (
            <Image
              source={{ uri: job.imageUrl }}
              style={styles.logoSm}
              contentFit="cover"
              radius={10}
            />
          ) : null}
          <View style={{ flex: 1 }}>
            <Text size="md" weight="semibold" numberOfLines={1}>
              {job.title}
            </Text>
            <Text size="sm" color="textSecondary">
              {job.company} · {job.location}
            </Text>
            {job.salary ? (
              <Text size="sm" weight="semibold" style={{ marginTop: 4 }}>
                {job.salary}
              </Text>
            ) : null}
          </View>
          <Pressable onPress={handleApply} hitSlop={8}>
            <Ionicons
              name="arrow-forward-circle"
              size={28}
              color={t.colors.accent}
            />
          </Pressable>
        </View>
      </Card>
    </ScalePress>
  );
});

function MetaChip({ icon, label }: { icon: string; label: string }) {
  const t = useTheme();
  return (
    <View
      style={[styles.chip, { backgroundColor: t.colors.surfaceMuted }]}
    >
      <Ionicons
        name={icon as keyof typeof Ionicons.glyphMap}
        size={12}
        color={t.colors.textSecondary}
      />
      <Text size="xs" color="textSecondary" numberOfLines={1} style={{ marginLeft: 4, flex: 1 }}>
        {label}
      </Text>
    </View>
  );
}

const FEATURED_WIDTH = 300;

const styles = StyleSheet.create({
  featuredWrap: { width: FEATURED_WIDTH, marginRight: 14 },
  featuredCard: { overflow: "hidden" },
  featuredTop: { flexDirection: "row", gap: 12 },
  logo: { width: 56, height: 56 },
  logoFallback: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  logoSm: { width: 48, height: 48, marginRight: 12 },
  featuredHead: { flex: 1 },
  verifiedRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  metaGrid: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 12 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    maxWidth: "48%",
  },
  verticalWrap: { marginBottom: 12 },
  verticalCard: {},
  verticalRow: { flexDirection: "row", alignItems: "center" },
});

export const FEATURED_JOB_WIDTH = FEATURED_WIDTH;
