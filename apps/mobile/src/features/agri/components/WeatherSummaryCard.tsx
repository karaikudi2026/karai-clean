import React, { memo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";

import { Card, Text, useTheme, FadeIn } from "@mykaraikudi/ui";

import { fetchAgriWeatherSummary } from "../api/agri-api";

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export const WeatherSummaryCard = memo(function WeatherSummaryCard() {
  const t = useTheme();
  const insets = useSafeAreaInsets();

  const { data, isLoading, error } = useQuery({
    queryKey: ["agri", "weather", "Karaikudi"],
    queryFn: () => fetchAgriWeatherSummary("Karaikudi"),
    staleTime: 60_000,
    gcTime: 10 * 60_000,
    retry: 1,
  });

  const temp = data?.temperature_c;
  const humidity = data?.humidity_percent;
  const rain = data?.rain_probability;

  const lastUpdatedText = data?.last_updated_at
    ? `Last updated ${formatTime(data.last_updated_at)}`
    : error
      ? "Last updated —"
      : null;

  return (
    <FadeIn>
      <Card style={[styles.card, { marginTop: insets.top ? 0 : 0 }]}>
        <View style={styles.headerRow}>
          <View style={styles.iconPill}>
            <Ionicons
              name="cloudy-outline"
              size={20}
              color={t.colors.accent}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text size="md" weight="semibold">
              Karaikudi Weather
            </Text>
            <Text size="xs" color="textSecondary" style={{ marginTop: 2 }}>
              {data?.has_today ? "Local forecast" : "Loading forecast..."}
            </Text>
          </View>
          {lastUpdatedText ? (
            <Pressable
              onPress={() => {
                // Optional: could open a detailed weather screen later.
                void 0;
              }}
            >
              <Text size="xs" color="textTertiary">
                {lastUpdatedText}
              </Text>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.mainRow}>
          <View style={styles.bigStat}>
            <Text size="xxl" weight="semibold">
              {typeof temp === "number" ? `${Math.round(temp)}°C` : "—"}
            </Text>
            <Text size="xs" color="textSecondary">
              Temperature
            </Text>
          </View>

          <View style={styles.chips}>
            <View style={styles.chip}>
              <Text size="xs" color="textSecondary">
                Rain Chance
              </Text>
              <Text size="md" weight="semibold" style={{ marginTop: 4 }}>
                {typeof rain === "number" ? `${Math.round(rain)}%` : "—"}
              </Text>
            </View>
            <View style={styles.chip}>
              <Text size="xs" color="textSecondary">
                Humidity
              </Text>
              <Text size="md" weight="semibold" style={{ marginTop: 4 }}>
                {typeof humidity === "number" ? `${Math.round(humidity)}%` : "—"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.adviceRow}>
          <Ionicons name="sparkles-outline" size={16} color={t.colors.accent} />
          <Text size="sm" color="textSecondary" style={{ flex: 1 }}>
            {data?.tomorrow_evening_advice ?? "Rain expected tomorrow evening — check again shortly."}
          </Text>
        </View>
      </Card>
    </FadeIn>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 0,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconPill: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(184,74,74,0.12)",
  },
  mainRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginTop: 14,
    gap: 14,
  },
  bigStat: { flex: 1 },
  chips: {
    gap: 10,
    alignItems: "flex-end",
  },
  chip: {
    minWidth: 120,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: "rgba(26,26,26,0.03)",
  },
  adviceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(26,26,26,0.08)",
  },
});

