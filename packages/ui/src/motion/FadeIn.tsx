import React from "react";
import { type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  FadeIn as ReanimatedFadeIn,
  FadeOut,
} from "react-native-reanimated";
import { motion } from "../tokens/motion";

type Props = {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  style?: StyleProp<ViewStyle>;
};

export function FadeIn({
  children,
  duration = motion.duration.normal,
  delay = 0,
  style,
}: Props) {
  return (
    <Animated.View
      entering={ReanimatedFadeIn.duration(duration).delay(delay)}
      exiting={FadeOut.duration(motion.duration.fast)}
      style={style}
    >
      {children}
    </Animated.View>
  );
}
