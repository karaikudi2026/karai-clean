import React, { memo } from "react";
import { View, Pressable, StyleSheet, Platform } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Text, useTheme } from "@mykaraikudi/ui";
import * as Haptics from "expo-haptics";

const VISIBLE_TABS = ["index", "businesses", "agri", "jobs", "profile"] as const;

const TAB_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  index: "home-outline",
  businesses: "storefront-outline",
  jobs: "briefcase-outline",
  agri: "leaf-outline",
  profile: "person-outline",
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function TabItem({
  label,
  icon,
  focused,
  onPress,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  onPress: () => void;
}) {
  const t = useTheme();

  const pillStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withSpring(focused ? 1 : 0.92, { damping: 14, stiffness: 200 }),
      },
    ],
    backgroundColor: focused ? t.colors.accentSoft : "transparent",
  }));

  return (
    <AnimatedPressable
      onPress={() => {
        if (Platform.OS === "ios") {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress();
      }}
      style={styles.tab}
    >
      <Animated.View style={[styles.pill, pillStyle]}>
        <Ionicons
          name={icon}
          size={22}
          color={focused ? t.colors.accent : t.colors.textTertiary}
        />
      </Animated.View>
      <Text
        size="xs"
        weight={focused ? "semibold" : "regular"}
        color={focused ? "accent" : "textTertiary"}
        style={{ marginTop: 2 }}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}

export const PremiumTabBar = memo(function PremiumTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const t = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bar,
        {
          paddingBottom: Math.max(insets.bottom, 8),
          backgroundColor: t.colors.backgroundElevated,
          borderTopColor: t.colors.border,
          ...t.shadows.lg,
        },
      ]}
    >
      {state.routes
        .filter((route) =>
          VISIBLE_TABS.includes(route.name.split("/")[0] as (typeof VISIBLE_TABS)[number])
        )
        .map((route) => {
          const routeIndex = state.routes.findIndex((r) => r.key === route.key);
          const { options } = descriptors[route.key];
          const routeKey = route.name.split("/")[0];
          const label =
            typeof options.title === "string" ? options.title : routeKey;
          const focused = state.index === routeIndex;
          const icon = TAB_ICONS[routeKey] ?? "ellipse-outline";

          return (
            <TabItem
              key={route.key}
              label={label}
              icon={icon}
              focused={focused}
              onPress={() => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!focused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
            />
          );
        })}
    </View>
  );
});

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 8,
    paddingHorizontal: 4,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pill: {
    width: 44,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
