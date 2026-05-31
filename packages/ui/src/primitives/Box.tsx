import React, { memo } from "react";
import { View, type ViewProps, type ViewStyle } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import type { SpacingToken } from "../tokens/spacing";
import type { RadiusToken } from "../tokens/radius";

type Props = ViewProps & {
  p?: SpacingToken;
  px?: SpacingToken;
  py?: SpacingToken;
  m?: SpacingToken;
  bg?: keyof ReturnType<typeof useTheme>["colors"];
  radius?: RadiusToken;
  shadow?: keyof ReturnType<typeof useTheme>["shadows"];
  flex?: number;
  row?: boolean;
  center?: boolean;
  gap?: SpacingToken;
};

export const Box = memo(function Box({
  p,
  px,
  py,
  m,
  bg,
  radius: radiusKey,
  shadow,
  flex,
  row,
  center,
  gap,
  style,
  ...props
}: Props) {
  const t = useTheme();

  const boxStyle: ViewStyle = {
    ...(p !== undefined && { padding: t.spacing[p] }),
    ...(px !== undefined && { paddingHorizontal: t.spacing[px] }),
    ...(py !== undefined && { paddingVertical: t.spacing[py] }),
    ...(m !== undefined && { margin: t.spacing[m] }),
    ...(bg !== undefined && { backgroundColor: t.colors[bg] }),
    ...(radiusKey !== undefined && { borderRadius: t.radius[radiusKey] }),
    ...(shadow !== undefined && t.shadows[shadow]),
    ...(flex !== undefined && { flex }),
    ...(row && { flexDirection: "row" }),
    ...(center && { alignItems: "center", justifyContent: "center" }),
    ...(gap !== undefined && { gap: t.spacing[gap] }),
  };

  return <View style={[boxStyle, style]} {...props} />;
});
