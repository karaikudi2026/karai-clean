export const fontFamily = {
  sans: "Inter_400Regular",
  sansMedium: "Inter_500Medium",
  sansSemiBold: "Inter_600SemiBold",
  sansBold: "Inter_700Bold",
  display: "Cormorant_600SemiBold",
  displayItalic: "Cormorant_500Medium_Italic",
  cursive: "Cormorant_500Medium_Italic",
} as const;

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  display: 32,
  hero: 40,
} as const;

export const lineHeight = {
  tight: 1.15,
  normal: 1.4,
  relaxed: 1.6,
} as const;

export const letterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 0.8,
  wider: 1.2,
} as const;
