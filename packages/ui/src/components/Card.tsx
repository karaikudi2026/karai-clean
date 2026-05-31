import React, { memo } from "react";
import { type ViewProps } from "react-native";
import { Box } from "../primitives/Box";
import { ScalePress } from "../motion/ScalePress";

type Props = ViewProps & {
  children: React.ReactNode;
  onPress?: () => void;
  elevated?: boolean;
  padding?: "sm" | "md" | "lg";
};

const paddingMap = { sm: "sm" as const, md: "md" as const, lg: "lg" as const };

export const Card = memo(function Card({
  children,
  onPress,
  elevated = true,
  padding = "md",
  style,
  ...props
}: Props) {
  const content = (
    <Box
      bg="backgroundElevated"
      radius="md"
      p={paddingMap[padding]}
      shadow={elevated ? "card" : undefined}
      style={[
        {
          borderWidth: 1,
          borderColor: "rgba(26, 26, 26, 0.05)",
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Box>
  );

  if (onPress) {
    return <ScalePress onPress={onPress}>{content}</ScalePress>;
  }

  return content;
});
