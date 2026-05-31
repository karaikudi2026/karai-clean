import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { Image, motion, useTheme } from "@mykaraikudi/ui";

import { brandAssets } from "../../assets/images";

type Props = {
  onComplete: () => void;
};

export function BrandSplash({ onComplete }: Props) {
  const t = useTheme();
  const containerOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.88);

  useEffect(() => {
    containerOpacity.value = withTiming(1, { duration: motion.duration.normal });
    logoScale.value = withTiming(1, { duration: motion.duration.slow });

    const timer = setTimeout(() => {
      containerOpacity.value = withTiming(
        0,
        { duration: motion.duration.normal },
        () => runOnJS(onComplete)()
      );
    }, motion.duration.cinematic + 600);

    return () => clearTimeout(timer);
  }, [containerOpacity, logoScale, onComplete]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  return (
    <View style={[styles.root, { backgroundColor: t.colors.background }]}>
      <Animated.View style={[styles.center, containerStyle]}>
        <Image
          source={brandAssets.logo}
          style={styles.logo}
          contentFit="contain"
          accessibilityLabel="myKaraikudi"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  logo: {
    width: "100%",
    maxWidth: 280,
    height: 120,
  },
});
