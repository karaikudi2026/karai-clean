import React, { useCallback, useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  useWindowDimensions,
  type ViewToken,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import {
  AnimatedButton,
  Image,
  Text,
  useTheme,
  FadeIn,
} from "@mykaraikudi/ui";

import { ONBOARDING_SLIDES, type OnboardingSlideData } from "./slides-data";

/** Hero takes most of the slide; copy + footer sit below the image area. */
const HERO_HEIGHT_RATIO = 0.72;

type Props = {
  onComplete: () => void;
  onSkip?: () => void;
  showSkip?: boolean;
};

export function OnboardingPager({
  onComplete,
  onSkip,
  showSkip = true,
}: Props) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const listRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);
  const [listHeight, setListHeight] = useState(0);

  const footerEstimate = 128 + insets.bottom;
  const slideHeight =
    listHeight > 0 ? listHeight : Math.max(0, screenHeight - footerEstimate);
  const heroHeight = Math.round(slideHeight * HERO_HEIGHT_RATIO);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0]?.index != null) {
        setIndex(viewableItems[0].index);
      }
    },
    []
  );

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 60,
  }).current;

  const goNext = () => {
    if (index < ONBOARDING_SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
    } else {
      onComplete();
    }
  };

  const renderSlide = ({ item }: { item: OnboardingSlideData }) => (
    <View
      style={[
        styles.slide,
        { width: screenWidth, height: slideHeight },
      ]}
    >
      <View style={[styles.hero, { height: heroHeight }]}>
        <Image
          source={item.image}
          style={[styles.heroImage, { width: screenWidth, height: heroHeight }]}
          contentFit="contain"
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.35)"]}
          style={styles.heroOverlay}
        />
      </View>
      <View style={styles.copy}>
        <Text size="xxl" display weight="semibold">
          {tr(item.titleKey)}
        </Text>
        <Text
          size="md"
          color="textSecondary"
          style={{ marginTop: t.spacing.sm, lineHeight: 24 }}
        >
          {tr(item.subtitleKey)}
        </Text>
      </View>
    </View>
  );

  const isLast = index === ONBOARDING_SLIDES.length - 1;

  return (
    <View style={[styles.root, { backgroundColor: t.colors.background }]}>
      {showSkip ? (
        <FadeIn style={[styles.skip, { top: insets.top + 8 }]}>
          <AnimatedButton
            label={tr("common.skip")}
            variant="ghost"
            onPress={onSkip ?? onComplete}
          />
        </FadeIn>
      ) : null}

      <FlatList
        ref={listRef}
        style={styles.list}
        data={ONBOARDING_SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onLayout={(e) => setListHeight(e.nativeEvent.layout.height)}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, i) => ({
          length: screenWidth,
          offset: screenWidth * i,
          index: i,
        })}
      />

      <View
        style={[
          styles.footer,
          { paddingBottom: insets.bottom + t.spacing.lg },
        ]}
      >
        <View style={styles.dots}>
          {ONBOARDING_SLIDES.map((slide, i) => (
            <View
              key={slide.id}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    i === index ? t.colors.accent : t.colors.surfaceMuted,
                  width: i === index ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        <AnimatedButton
          label={isLast ? tr("common.getStarted") : tr("common.next")}
          onPress={goNext}
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  skip: {
    position: "absolute",
    right: 8,
    zIndex: 10,
  },
  slide: {
    flexDirection: "column",
  },
  hero: {
    width: "100%",
    overflow: "hidden",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    backgroundColor: "#E8E0D4",
  },
  heroImage: {
    flex: 1,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  copy: {
    flexShrink: 0,
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 8,
  },
  footer: {
    paddingHorizontal: 24,
    gap: 20,
  },
  dots: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});
