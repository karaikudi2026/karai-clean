import React, { memo } from "react";
import { Linking, Pressable, StyleSheet, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";

import { Card, FadeIn, Text, useTheme } from "@mykaraikudi/ui";

import { fetchAgriSchemes } from "../api/agri-api";

const DEFAULT_LIMIT = 5;

export const GovernmentSchemesSection = memo(function GovernmentSchemesSection() {
  const t = useTheme();

  const { data, isLoading } = useQuery({
    queryKey: ["agri", "schemes", "Tamil Nadu"],
    queryFn: () => fetchAgriSchemes({ stateName: "Tamil Nadu", limit: DEFAULT_LIMIT }),
    staleTime: 60_000,
    gcTime: 10 * 60_000,
    retry: 1,
  });

  return (
    <FadeIn>
      <View style={{ gap: 12 }}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIcon}>
            <Ionicons name="document-text-outline" size={18} color={t.colors.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text size="md" weight="semibold">
              Government Schemes
            </Text>
            <Text size="xs" color="textSecondary" style={{ marginTop: 2 }}>
              Clean, farmer-friendly eligibility cards
            </Text>
          </View>
        </View>

        {(isLoading ? [] : data ?? []).map((scheme) => (
          <Card key={scheme.id} style={styles.schemeCard}>
            <View style={styles.schemeBody}>
              <Text size="md" weight="semibold">
                {scheme.title}
              </Text>

              <Text size="sm" color="textSecondary" style={{ marginTop: 6, lineHeight: 20 }}>
                {scheme.summary}
              </Text>

              <View style={styles.metaRow}>
                <Text size="xs" color="textTertiary" style={styles.metaLabel}>
                  Eligibility
                </Text>
                <Text size="xs" color="textSecondary" style={{ flex: 1, lineHeight: 18 }}>
                  {scheme.eligibility}
                </Text>
              </View>

              {scheme.deadline ? (
                <View style={styles.metaRow}>
                  <Text size="xs" color="textTertiary" style={styles.metaLabel}>
                    Deadline
                  </Text>
                  <Text size="xs" color="textSecondary">
                    {new Date(scheme.deadline).toLocaleDateString("en-IN")}
                  </Text>
                </View>
              ) : null}

              <View style={styles.actionsRow}>
                {scheme.apply_url ? (
                  <Pressable
                    onPress={() => {
                      void Linking.openURL(scheme.apply_url ?? "");
                    }}
                    style={({ pressed }) => [
                      styles.actionBtn,
                      { opacity: pressed ? 0.85 : 1, backgroundColor: t.colors.accentSoft },
                    ]}
                  >
                    <Ionicons name="open-outline" size={16} color={t.colors.accent} />
                    <Text size="sm" weight="semibold" color="accent" style={{ marginLeft: 8 }}>
                      Apply
                    </Text>
                  </Pressable>
                ) : (
                  <View style={{ flex: 1 }} />
                )}

                {scheme.department_contact_phone ? (
                  <Pressable
                    onPress={() => {
                      const phone = scheme.department_contact_phone ?? "";
                      if (!phone) return;
                      void Linking.openURL(`tel:${phone.replace(/\s/g, "")}`);
                    }}
                    style={({ pressed }) => [
                      styles.actionBtn,
                      { opacity: pressed ? 0.85 : 1, backgroundColor: "rgba(26,26,26,0.03)" },
                    ]}
                  >
                    <Ionicons name="call-outline" size={16} color={t.colors.accent} />
                    <Text size="sm" weight="semibold" color="accent" style={{ marginLeft: 8 }}>
                      Call
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            </View>
          </Card>
        ))}

        {!isLoading && (!data || data.length === 0) ? (
          <Card style={styles.emptyCard}>
            <Text size="sm" color="textSecondary">
              No schemes found for Tamil Nadu right now. Please check later.
            </Text>
          </Card>
        ) : null}
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
  schemeCard: {
    borderRadius: 22,
  },
  schemeBody: {
    gap: 8,
  },
  metaRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
    marginTop: 4,
  },
  metaLabel: {
    width: 86,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    flex: 1,
  },
  emptyCard: {
    borderRadius: 22,
  },
});

