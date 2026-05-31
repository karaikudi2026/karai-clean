import React, { memo } from "react";
import { ActivityIndicator, type ViewStyle } from "react-native";
import { ScalePress } from "../motion/ScalePress";
import { Text } from "../primitives/Text";
import { useTheme } from "../theme/ThemeContext";

type Variant = "primary" | "secondary" | "ghost";

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
};

export const AnimatedButton = memo(function AnimatedButton({
  label,
  onPress,
  variant = "primary",
  loading,
  disabled,
  fullWidth,
  style,
}: Props) {
  const t = useTheme();

  const variants: Record<Variant, ViewStyle> = {
    primary: {
      backgroundColor: t.colors.accent,
    },
    secondary: {
      backgroundColor: t.colors.accentSoft,
      borderWidth: 1,
      borderColor: t.colors.accent,
    },
    ghost: {
      backgroundColor: "transparent",
    },
  };

  const textColor =
    variant === "primary" ? "textInverse" : variant === "secondary" ? "accent" : "textPrimary";

  return (
    <ScalePress
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        {
          paddingVertical: t.spacing.md,
          paddingHorizontal: t.spacing.xl,
          borderRadius: t.radius.md,
          alignItems: "center",
          justifyContent: "center",
          minHeight: 52,
          opacity: disabled ? 0.5 : 1,
          ...(fullWidth && { width: "100%" }),
        },
        variants[variant],
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#fff" : t.colors.accent} />
      ) : (
        <Text size="md" color={textColor} weight="semibold">
          {label}
        </Text>
      )}
    </ScalePress>
  );
});
