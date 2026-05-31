import React, { memo } from "react";
import { Linking, Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Card, FadeIn, Text, useTheme } from "@mykaraikudi/ui";

export const AgriSupportSection = memo(function AgriSupportSection() {
  const t = useTheme();

  const helplinePhone = "1800-000-0000";

  return (
    <FadeIn>
      <View style={{ gap: 12 }}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIcon}>
            <Ionicons name="help-circle-outline" size={18} color={t.colors.accent} />
          </View>
          <Text size="md" weight="semibold">
            Help & Support
          </Text>
        </View>

        <Card style={styles.card}>
          <View style={styles.row}>
            <Ionicons name="notifications-outline" size={18} color={t.colors.accent} />
            <View style={{ flex: 1 }}>
              <Text size="sm" weight="semibold">
                Water Release Alert
              </Text>
              <Text size="xs" color="textSecondary" style={{ marginTop: 4, lineHeight: 18 }}>
                Canal water release expected Friday evening. Plan irrigation schedule accordingly.
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Ionicons name="bug-outline" size={18} color={t.colors.accent} />
            <View style={{ flex: 1 }}>
              <Text size="sm" weight="semibold">
                Pest / Disease Watch
              </Text>
              <Text size="xs" color="textSecondary" style={{ marginTop: 4, lineHeight: 18 }}>
                Paddy pest activity reported nearby. Inspect fields and follow safe guidance.
              </Text>
            </View>
          </View>
        </Card>

        <Pressable
          onPress={() => {
            void Linking.openURL(`tel:${helplinePhone.replace(/\s/g, "")}`);
          }}
        >
          <Card style={styles.callCard}>
            <View style={styles.callRow}>
              <Ionicons name="call-outline" size={18} color={t.colors.accent} />
              <View style={{ flex: 1 }}>
                <Text size="sm" weight="semibold">
                  Agriculture Helpline
                </Text>
                <Text size="xs" color="textSecondary" style={{ marginTop: 4 }}>
                  Tap to call: {helplinePhone}
                </Text>
              </View>
              <Ionicons name="open-outline" size={18} color={t.colors.accent} />
            </View>
          </Card>
        </Pressable>
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
  card: { borderRadius: 22 },
  row: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: "rgba(26,26,26,0.08)", marginVertical: 14 },
  callCard: { borderRadius: 22 },
  callRow: { flexDirection: "row", gap: 12, alignItems: "center" },
});

