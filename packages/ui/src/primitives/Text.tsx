import React, { memo } from "react";
import { Text as RNText, type TextProps, type TextStyle } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import type { fontSize } from "../tokens/typography";

type SizeKey = keyof typeof fontSize;

type Props = TextProps & {
  size?: SizeKey;
  color?: keyof ReturnType<typeof useTheme>["colors"];
  weight?: "regular" | "medium" | "semibold" | "bold";
  display?: boolean;
  cursive?: boolean;
  center?: boolean;
};

export const Text = memo(function Text({
  size = "md",
  color = "textPrimary",
  weight = "regular",
  display = false,
  cursive = false,
  center,
  style,
  ...props
}: Props) {
  const t = useTheme();

  const fontMap = {
    regular: t.fontFamily.sans,
    medium: t.fontFamily.sansMedium,
    semibold: t.fontFamily.sansSemiBold,
    bold: t.fontFamily.sansBold,
  };

  const textStyle: TextStyle = {
    fontSize: t.fontSize[size],
    color: t.colors[color],
    fontFamily: cursive
      ? t.fontFamily.cursive
      : display
        ? t.fontFamily.display
        : fontMap[weight],
    ...(center && { textAlign: "center" }),
  };

  return <RNText style={[textStyle, style]} {...props} />;
});
