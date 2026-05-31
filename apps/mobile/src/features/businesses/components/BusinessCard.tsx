import React, { memo } from "react";
import { Linking, Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Card, Image, ScalePress, Text, useTheme } from "@mykaraikudi/ui";

import type { Business } from "../types";

type Variant = "featured" | "vertical";

type Props = {
  business: Business;
  variant?: Variant;
  onPress?: () => void;
};

function openPhone(phone?: string) {
  if (!phone) return;
  void Linking.openURL(`tel:${phone.replace(/\s/g, "")}`);
}

function openDirections(address?: string) {
  if (!address) return;
  const q = encodeURIComponent(address);
  void Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${q}`);
}

export const BusinessCard = memo(function BusinessCard({
  business,
  variant = "vertical",
  onPress,
}: Props) {
  const t = useTheme();
  const { t: tr } = useTranslation();

  if (variant === "featured") {
    return (
      <ScalePress onPress={onPress} style={styles.featuredWrap}>
        <Card elevated padding="sm" style={styles.featuredCard}>
          <View style={styles.featuredImageWrap}>
            <Image
              source={{ uri: business.imageUrl }}
              style={styles.featuredImage}
              contentFit="cover"
            />
            {business.isOpen ? (
              <View style={[styles.openBadge, { backgroundColor: t.colors.success }]}>
                <Text size="xs" weight="semibold" style={{ color: "#fff" }}>
                  {tr("businesses.open")}
                </Text>
              </View>
            ) : null}
            {business.isVerified ? (
              <View style={[styles.verifiedBadge, { backgroundColor: t.colors.heritageGold }]}>
                <Ionicons name="shield-checkmark" size={12} color="#fff" />
              </View>
            ) : null}
          </View>

          <View style={styles.featuredBody}>
            <Text size="xs" color="accent" weight="semibold">
              {business.category}
            </Text>
            <Text size="md" weight="semibold" numberOfLines={1}>
              {business.name}
            </Text>
            <Text size="sm" color="textSecondary" numberOfLines={2}>
              {business.tagline}
            </Text>

            <View style={styles.metaRow}>
              {business.rating != null ? (
                <View style={styles.rating}>
                  <Ionicons name="star" size={14} color={t.colors.heritageGold} />
                  <Text size="sm" weight="semibold" style={{ marginLeft: 4 }}>
                    {business.rating.toFixed(1)}
                  </Text>
                </View>
              ) : null}
            </View>

            <View style={styles.actionRow}>
              <Pressable
                onPress={() => openPhone(business.phone)}
                style={[styles.actionBtn, { backgroundColor: t.colors.accentSoft }]}
              >
                <Ionicons name="call" size={18} color={t.colors.accent} />
              </Pressable>
              <Pressable
                onPress={() => openDirections(business.address)}
                style={[styles.actionBtn, { backgroundColor: t.colors.surfaceMuted }]}
              >
                <Ionicons name="navigate" size={18} color={t.colors.textPrimary} />
              </Pressable>
            </View>
          </View>
        </Card>
      </ScalePress>
    );
  }

  return (
    <ScalePress onPress={onPress} style={styles.verticalWrap}>
      <Card elevated padding="sm" style={styles.verticalCard}>
        <Image
          source={{ uri: business.imageUrl }}
          style={styles.verticalImage}
          contentFit="cover"
          radius={12}
        />
        <View style={styles.verticalBody}>
          <View style={styles.verticalTop}>
            <View style={{ flex: 1 }}>
              <Text size="xs" color="accent" weight="semibold">
                {business.category}
              </Text>
              <Text size="md" weight="semibold" numberOfLines={1}>
                {business.name}
              </Text>
              <Text size="sm" color="textSecondary" numberOfLines={2}>
                {business.tagline}
              </Text>
            </View>
            {business.rating != null ? (
              <View style={[styles.ratingPill, { backgroundColor: t.colors.surfaceMuted }]}>
                <Ionicons name="star" size={12} color={t.colors.heritageGold} />
                <Text size="xs" weight="semibold" style={{ marginLeft: 2 }}>
                  {business.rating.toFixed(1)}
                </Text>
              </View>
            ) : null}
          </View>

          <View style={styles.verticalFooter}>
            {business.isOpen ? (
              <Text size="xs" color="success" weight="semibold">
                {tr("businesses.open")}
              </Text>
            ) : (
              <Text size="xs" color="textTertiary">
                {tr("businesses.closed")}
              </Text>
            )}
            <View style={styles.actionRow}>
              <Pressable onPress={() => openPhone(business.phone)} hitSlop={8}>
                <Ionicons name="call-outline" size={20} color={t.colors.accent} />
              </Pressable>
              <Pressable
                onPress={() => openDirections(business.address)}
                hitSlop={8}
                style={{ marginLeft: 12 }}
              >
                <Ionicons name="navigate-outline" size={20} color={t.colors.textSecondary} />
              </Pressable>
            </View>
          </View>
        </View>
      </Card>
    </ScalePress>
  );
});

const FEATURED_WIDTH = 280;

const styles = StyleSheet.create({
  featuredWrap: {
    width: FEATURED_WIDTH,
    marginRight: 14,
  },
  featuredCard: {
    overflow: "hidden",
    padding: 0,
  },
  featuredImageWrap: {
    height: 148,
    position: "relative",
  },
  featuredImage: {
    width: "100%",
    height: "100%",
  },
  openBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  verifiedBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  featuredBody: {
    padding: 14,
    gap: 4,
  },
  metaRow: {
    flexDirection: "row",
    marginTop: 4,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  verticalWrap: {
    marginBottom: 14,
  },
  verticalCard: {
    flexDirection: "row",
    gap: 12,
    overflow: "hidden",
  },
  verticalImage: {
    width: 108,
    height: 108,
  },
  verticalBody: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  verticalTop: {
    flexDirection: "row",
    gap: 8,
  },
  ratingPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    height: 28,
  },
  verticalFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
});

export const FEATURED_CARD_WIDTH = FEATURED_WIDTH;
