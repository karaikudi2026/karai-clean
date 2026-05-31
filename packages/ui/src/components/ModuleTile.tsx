import React, { memo } from "react";
import { View } from "react-native";
import { Card } from "./Card";
import { Text } from "../primitives/Text";
import { Box } from "../primitives/Box";
import { useTheme } from "../theme/ThemeContext";
import { StaggerItem } from "../motion/Stagger";

type Props = {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  index?: number;
  onPress?: () => void;
  accentColor?: string;
  locked?: boolean;
};

export const ModuleTile = memo(function ModuleTile({
  title,
  subtitle,
  icon,
  index = 0,
  onPress,
  accentColor,
  locked,
}: Props) {
  const t = useTheme();
  const accent = accentColor ?? t.colors.accentSoft;

  return (
    <StaggerItem index={index}>
      <Card onPress={onPress} padding="md" style={{ minHeight: 128, opacity: locked ? 0.65 : 1 }}>
        <Box gap="sm">
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: t.radius.sm,
              backgroundColor: accent,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </View>
          <Text size="md" weight="semibold" numberOfLines={2}>
            {title}
          </Text>
          {subtitle ? (
            <Text size="sm" color="textSecondary" numberOfLines={2}>
              {subtitle}
            </Text>
          ) : null}
          {locked ? (
            <Text size="xs" color="textTertiary">
              Coming soon
            </Text>
          ) : null}
        </Box>
      </Card>
    </StaggerItem>
  );
});
