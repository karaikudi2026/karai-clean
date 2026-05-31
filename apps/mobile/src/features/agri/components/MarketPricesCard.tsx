import React, { memo, useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";

import { Card, FadeIn, Skeleton, Text, useTheme } from "@mykaraikudi/ui";

import { fetchAgriMandiPrices, type AgriMandiPrice } from "../api/agri-api";

function getKolkataDate(): string {
  const dt = new Date();
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(dt);
}

function formatPrice(v: AgriMandiPrice["price_per_unit"]) {
  const n = typeof v === "string" ? Number.parseFloat(v) : v;
  if (!Number.isFinite(n)) return "—";
  return `₹${Math.round(n)}`;
}

export const MarketPricesCard = memo(function MarketPricesCard() {
  const t = useTheme();
  const today = useMemo(() => getKolkataDate(), []);

  const { data, isLoading } = useQuery({
    queryKey: ["agri", "market-prices", today],
    queryFn: () => fetchAgriMandiPrices({ date: today }),
    staleTime: 30_000,
    gcTime: 10 * 60_000,
    retry: 1,
  });

  const top = (data ?? []).slice(0, 4);

  return (
    <FadeIn>
      <View style={{ gap: 12 }}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIcon}>
            <Ionicons name="stats-chart-outline" size={18} color={t.colors.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text size="md" weight="semibold">
              Today’s Market Prices
            </Text>
            <Text size="xs" color="textSecondary" style={{ marginTop: 2 }}>
              Latest cached mandi data (Karaikudi / Sivaganga region)
            </Text>
          </View>
        </View>

        <Card style={styles.card}>
          {isLoading ? (
            <View style={styles.skeletonGrid}>
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} width="100%" height={78} radius={16} />
              ))}
            </View>
          ) : top.length === 0 ? (
            <Text size="sm" color="textSecondary">
              Market prices will appear here once the backend cache is populated.
            </Text>
          ) : (
            <View style={styles.grid}>
              {top.map((item) => (
                <Pressable
                  key={`${item.crop_name}-${item.id}`}
                  onPress={() => {
                    // Detailed screen can be added in Phase 2.
                    void 0;
                  }}
                  style={({ pressed }) => [
                    styles.priceCard,
                    { opacity: pressed ? 0.9 : 1 },
                  ]}
                >
                  <View style={styles.priceRow}>
                    <Text size="sm" weight="semibold" style={{ flex: 1 }}>
                      {item.crop_name}
                    </Text>
                    <Ionicons name="chevron-forward-outline" size={16} color={t.colors.textTertiary} />
                  </View>
                  <Text size="md" weight="semibold" style={{ marginTop: 6 }}>
                    {formatPrice(item.price_per_unit)} <Text size="xs" color="textSecondary">{item.unit}</Text>
                  </Text>
                  <Text size="xs" color="textTertiary" style={{ marginTop: 6 }}>
                    {item.market_name}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </Card>
      </View>
    </FadeIn>
  );
});

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 2,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(184,74,74,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  card: { borderRadius: 22, paddingHorizontal: 0 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  priceCard: {
    width: "47%",
    borderRadius: 16,
    backgroundColor: "rgba(26,26,26,0.03)",
    padding: 12,
  },
  priceRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  skeletonGrid: { gap: 10 },
});

