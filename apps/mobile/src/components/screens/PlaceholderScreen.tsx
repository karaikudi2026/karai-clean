import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, useTheme, FadeIn } from "@mykaraikudi/ui";

type Props = {
  title: string;
  subtitle?: string;
};

export const PlaceholderScreen = memo(function PlaceholderScreen({
  title,
  subtitle,
}: Props) {
  const t = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: t.colors.background,
          paddingTop: insets.top + t.spacing.xl,
          paddingHorizontal: t.spacing.xl,
        },
      ]}
    >
      <FadeIn>
        <Text size="xxl" display weight="semibold">
          {title}
        </Text>
        {subtitle ? (
          <Text
            size="md"
            color="textSecondary"
            style={{ marginTop: t.spacing.sm }}
          >
            {subtitle}
          </Text>
        ) : null}
        <Text
          size="sm"
          color="textTertiary"
          style={{ marginTop: t.spacing.xl }}
        >
          Module screens ship in Phase 2.
        </Text>
      </FadeIn>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
