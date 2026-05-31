import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { Image, Text, motion, useTheme } from "@mykaraikudi/ui";
import { useTranslation } from "react-i18next";

import { brandAssets } from "../../assets/images";

type Props = {
  onComplete: () => void;
};

export function MinisterSplash({ onComplete }: Props) {
  const t = useTheme();
  const { t: tr } = useTranslation();

  const imageOpacity = useSharedValue(0);
  const imageScale = useSharedValue(0.92);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);
  const screenOpacity = useSharedValue(1);

  useEffect(() => {
    imageOpacity.value = withTiming(1, { duration: motion.duration.slow });
    imageScale.value = withTiming(1, { duration: motion.duration.slow });

    textOpacity.value = withDelay(
      motion.duration.normal,
      withTiming(1, { duration: motion.duration.slow })
    );
    textTranslateY.value = withDelay(
      motion.duration.normal,
      withTiming(0, { duration: motion.duration.slow })
    );

    const timer = setTimeout(() => {
      screenOpacity.value = withTiming(
        0,
        { duration: motion.duration.normal },
        () => runOnJS(onComplete)()
      );
    }, motion.duration.cinematic + 800);

    return () => clearTimeout(timer);
  }, [
    imageOpacity,
    imageScale,
    textOpacity,
    textTranslateY,
    screenOpacity,
    onComplete,
  ]);

  const screenStyle = useAnimatedStyle(() => ({ opacity: screenOpacity.value }));
  const imageStyle = useAnimatedStyle(() => ({
    opacity: imageOpacity.value,
    transform: [{ scale: imageScale.value }],
  }));
  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  return (
    <Animated.View
      style={[styles.root, { backgroundColor: t.colors.background }, screenStyle]}
    >
      <View style={styles.content}>
        <Animated.View style={[styles.portraitWrap, imageStyle]}>
          <Image
            source={brandAssets.drPrabhu}
            style={styles.portrait}
            contentFit="cover"
            accessibilityLabel={tr("splash.ministerCredit")}
          />
          <View
            style={[
              styles.portraitRing,
              { borderColor: t.colors.accentSoft },
            ]}
          />
        </Animated.View>

        <Animated.View style={[styles.creditWrap, textStyle]}>
          <Text size="xl" cursive center color="accent">
            {tr("splash.ministerCredit")}
          </Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  portraitWrap: {
    marginBottom: 40,
  },
  portrait: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  portraitRing: {
    position: "absolute",
    top: -6,
    left: -6,
    right: -6,
    bottom: -6,
    borderRadius: 86,
    borderWidth: 2,
  },
  creditWrap: {
    maxWidth: 320,
  },
});
