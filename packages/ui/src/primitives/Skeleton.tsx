import React, { useEffect } from "react";
import { type ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { useTheme } from "../theme/ThemeContext";
import { motion } from "../tokens/motion";

type Props = {
  width: number | `${number}%`;
  height: number;
  radius?: number;
  style?: ViewStyle;
};

export function Skeleton({ width, height, radius = 12, style }: Props) {
  const t = useTheme();
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: motion.duration.slow * 2 }),
      -1,
      true
    );
  }, [pulse]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0, 1], [0.45, 0.85]),
  }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: radius,
          backgroundColor: t.colors.surfaceMuted,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}
