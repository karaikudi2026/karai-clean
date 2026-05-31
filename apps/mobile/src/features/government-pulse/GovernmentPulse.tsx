import React, { memo, useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import type { Locale } from "@mykaraikudi/constants";
import { Text } from "@mykaraikudi/ui";

import { GOVERNMENT_UPDATES } from "./data/mock-updates";
import type { GovernmentUpdate } from "./types";
import { getCategoryIcon, sortByPriority } from "./utils/category-icon";
import { getUpdateTitle } from "./utils/get-update-title";

const NEWS_COLORS = {
  navy: "#1A2332",
  charcoal: "#242B38",
  gold: "#C4A574",
  goldSoft: "rgba(196, 165, 116, 0.25)",
  text: "rgba(255,255,255,0.92)",
  textMuted: "rgba(255,255,255,0.65)",
} as const;

const AUTO_ADVANCE_MS = 9000;
const MANUAL_PAUSE_MS = 14_000;

type Props = {
  updates?: GovernmentUpdate[];
  locale: Locale;
};

function NewsItem({ item, locale }: { item: GovernmentUpdate; locale: Locale }) {
  const { t: tr } = useTranslation();
  const icon = getCategoryIcon(item.category);

  return (
    <View style={styles.newsItem}>
      <View style={styles.itemIconWrap}>
        <Ionicons
          name={icon as keyof typeof Ionicons.glyphMap}
          size={16}
          color={NEWS_COLORS.gold}
        />
      </View>
      {item.isBreaking ? (
        <View style={styles.breakingPill}>
          <Text size="xs" weight="bold" style={styles.breakingText}>
            {tr("dashboard.newsBreaking")}
          </Text>
        </View>
      ) : null}
      <Text size="sm" weight="medium" style={styles.itemTitle} numberOfLines={3}>
        {getUpdateTitle(item, locale)}
      </Text>
    </View>
  );
}

function NavArrow({
  direction,
  onPress,
  disabled,
  label,
}: {
  direction: "prev" | "next";
  onPress: () => void;
  disabled: boolean;
  label: string;
}) {
  const icon = direction === "prev" ? "chevron-back" : "chevron-forward";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.arrowBtn,
        disabled && styles.arrowDisabled,
        pressed && !disabled && styles.arrowPressed,
      ]}
    >
      <Ionicons
        name={icon}
        size={22}
        color={disabled ? NEWS_COLORS.textMuted : NEWS_COLORS.gold}
      />
    </Pressable>
  );
}

export const GovernmentPulse = memo(function GovernmentPulse({
  updates = GOVERNMENT_UPDATES,
  locale,
}: Props) {
  const { t: tr } = useTranslation();
  const sorted = sortByPriority(updates);
  const count = sorted.length;
  const [index, setIndex] = useState(0);
  const [autoPausedUntil, setAutoPausedUntil] = useState(0);

  const goNext = useCallback(() => {
    if (count <= 1) return;
    setIndex((i) => (i + 1) % count);
    setAutoPausedUntil(Date.now() + MANUAL_PAUSE_MS);
  }, [count]);

  const goPrev = useCallback(() => {
    if (count <= 1) return;
    setIndex((i) => (i - 1 + count) % count);
    setAutoPausedUntil(Date.now() + MANUAL_PAUSE_MS);
  }, [count]);

  useEffect(() => {
    if (count <= 1) return;
    const id = setInterval(() => {
      if (Date.now() < autoPausedUntil) return;
      setIndex((i) => (i + 1) % count);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [count, autoPausedUntil]);

  const item = sorted[index];
  const arrowsDisabled = count <= 1;

  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={[NEWS_COLORS.navy, NEWS_COLORS.charcoal, "#1E2636"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.capsule}
      >
        <View style={styles.glowOrb} />

        <View style={styles.headerRow}>
          <View style={styles.badge}>
            <Ionicons
              name="newspaper-outline"
              size={14}
              color={NEWS_COLORS.gold}
            />
            <Text size="xs" weight="semibold" style={styles.badgeText}>
              {tr("dashboard.news")}
            </Text>
          </View>
          {count > 1 ? (
            <Text size="xs" style={styles.counter}>
              {index + 1} / {count}
            </Text>
          ) : null}
        </View>

        <View style={styles.carouselRow}>
          <NavArrow
            direction="prev"
            onPress={goPrev}
            disabled={arrowsDisabled}
            label={tr("dashboard.newsPrevious")}
          />

          <View
            style={styles.track}
            accessibilityRole="text"
            accessibilityLabel={item ? getUpdateTitle(item, locale) : ""}
          >
            {item ? (
              <Animated.View
                key={item.id}
                entering={FadeIn.duration(400)}
                exiting={FadeOut.duration(280)}
                style={styles.trackInner}
              >
                <NewsItem item={item} locale={locale} />
              </Animated.View>
            ) : null}
          </View>

          <NavArrow
            direction="next"
            onPress={goNext}
            disabled={arrowsDisabled}
            label={tr("dashboard.newsNext")}
          />
        </View>
      </LinearGradient>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    shadowColor: "#0A0F18",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 8,
  },
  capsule: {
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(196, 165, 116, 0.18)",
  },
  glowOrb: {
    position: "absolute",
    top: -30,
    right: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: NEWS_COLORS.goldSoft,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeText: {
    color: NEWS_COLORS.gold,
    letterSpacing: 0.4,
  },
  counter: {
    color: NEWS_COLORS.textMuted,
  },
  carouselRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  arrowBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(196, 165, 116, 0.22)",
  },
  arrowPressed: {
    backgroundColor: "rgba(196, 165, 116, 0.2)",
  },
  arrowDisabled: {
    opacity: 0.35,
  },
  track: {
    flex: 1,
    minHeight: 52,
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  trackInner: {
    flex: 1,
    justifyContent: "center",
  },
  newsItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  itemIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    marginTop: 2,
  },
  breakingPill: {
    backgroundColor: NEWS_COLORS.gold,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 8,
    marginTop: 2,
  },
  breakingText: {
    color: NEWS_COLORS.navy,
    fontSize: 10,
  },
  itemTitle: {
    color: NEWS_COLORS.text,
    flex: 1,
    lineHeight: 20,
  },
});
