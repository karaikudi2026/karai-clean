import React, { memo } from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Box } from "../primitives/Box";
import { Text } from "../primitives/Text";
import { FadeIn } from "../motion/FadeIn";
import { useTheme } from "../theme/ThemeContext";

type Props = {
  title: string;
  subtitle?: string;
  badge?: string;
};

export const HeroBanner = memo(function HeroBanner({
  title,
  subtitle,
  badge,
}: Props) {
  const t = useTheme();

  return (
    <FadeIn duration={t.motion.duration.slow}>
      <View
        style={{
          borderRadius: t.radius.lg,
          overflow: "hidden",
          ...t.shadows.md,
        }}
      >
        <LinearGradient
          colors={[t.colors.accent, t.colors.accentDark, "#7A3535"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ padding: t.spacing.xl, minHeight: 160 }}
        >
          {badge ? (
            <Box
              style={{
                alignSelf: "flex-start",
                backgroundColor: "rgba(255,255,255,0.2)",
                paddingHorizontal: t.spacing.sm,
                paddingVertical: t.spacing.xxs,
                borderRadius: t.radius.full,
                marginBottom: t.spacing.sm,
              }}
            >
              <Text size="xs" color="textInverse" weight="medium">
                {badge}
              </Text>
            </Box>
          ) : null}
          <Text size="xxl" color="textInverse" display weight="semibold">
            {title}
          </Text>
          {subtitle ? (
            <Text
              size="md"
              color="textInverse"
              style={{ marginTop: t.spacing.xs, opacity: 0.9 }}
            >
              {subtitle}
            </Text>
          ) : null}
        </LinearGradient>
      </View>
    </FadeIn>
  );
});
