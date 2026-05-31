import { Platform, type ViewStyle } from "react-native";
import { colors } from "./colors";

type ShadowStyle = Pick<
  ViewStyle,
  "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "elevation"
>;

export const shadows = {
  sm: Platform.select<ShadowStyle>({
    ios: {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    android: { elevation: 2 },
    default: {},
  })!,
  md: Platform.select<ShadowStyle>({
    ios: {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
    },
    android: { elevation: 6 },
    default: {},
  })!,
  lg: Platform.select<ShadowStyle>({
    ios: {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.14,
      shadowRadius: 28,
    },
    android: { elevation: 10 },
    default: {},
  })!,
  card: Platform.select<ShadowStyle>({
    ios: {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 20,
    },
    android: { elevation: 4 },
    default: {},
  })!,
} as const;

export type ShadowToken = keyof typeof shadows;
