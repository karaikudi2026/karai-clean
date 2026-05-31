export { colors } from "./colors";
export { spacing } from "./spacing";
export { radius } from "./radius";
export { fontFamily, fontSize, lineHeight, letterSpacing } from "./typography";
export { shadows } from "./shadows";
export { motion } from "./motion";

import { colors } from "./colors";
import { spacing } from "./spacing";
import { radius } from "./radius";
import { fontFamily, fontSize, lineHeight, letterSpacing } from "./typography";
import { shadows } from "./shadows";
import { motion } from "./motion";

export const theme = {
  colors,
  spacing,
  radius,
  fontFamily,
  fontSize,
  lineHeight,
  letterSpacing,
  shadows,
  motion,
} as const;

export type Theme = typeof theme;
