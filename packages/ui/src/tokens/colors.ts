export const colors = {
  background: "#FAF7F2",
  backgroundAlt: "#F5F0E8",
  backgroundElevated: "#FFFFFF",
  surfaceMuted: "#EDE8DF",

  accent: "#B84A4A",
  accentMuted: "#C96B6B",
  accentSoft: "rgba(184, 74, 74, 0.12)",
  accentDark: "#9A3D3D",

  textPrimary: "#1A1A1A",
  textSecondary: "#5C5C5C",
  textTertiary: "#8A8A8A",
  textInverse: "#FFFFFF",

  border: "rgba(26, 26, 26, 0.08)",
  borderStrong: "rgba(26, 26, 26, 0.14)",

  shadow: "rgba(26, 26, 26, 0.12)",
  overlay: "rgba(26, 26, 26, 0.45)",

  success: "#3D7A5A",
  warning: "#C4923A",

  heritageGold: "#C4A574",
  heritageTerracotta: "#B86B4A",
} as const;

export type ColorToken = keyof typeof colors;
