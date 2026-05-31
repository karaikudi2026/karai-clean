import React from "react";
import { type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  FadeInUp,
  FadeOutDown,
} from "react-native-reanimated";
import { motion } from "../tokens/motion";

type Props = {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  style?: StyleProp<ViewStyle>;
};

export function SlideUp({
  children,
  duration = motion.duration.normal,
  delay = 0,
  style,
}: Props) {
  return (
    <Animated.View
      entering={FadeInUp.duration(duration)
        .delay(delay)
        .springify()
        .damping(18)}
      exiting={FadeOutDown.duration(motion.duration.fast)}
      style={style}
    >
      {children}
    </Animated.View>
  );
}
