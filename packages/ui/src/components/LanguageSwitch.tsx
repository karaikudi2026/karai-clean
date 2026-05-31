import React, { memo } from "react";
import { View } from "react-native";
import { ScalePress } from "../motion/ScalePress";
import { Text } from "../primitives/Text";
import { useTheme } from "../theme/ThemeContext";

type Props = {
  locale: "ta" | "en";
  onToggle: () => void;
};

export const LanguageSwitch = memo(function LanguageSwitch({
  locale,
  onToggle,
}: Props) {
  const t = useTheme();

  return (
    <ScalePress onPress={onToggle}>
      <View
        style={{
          flexDirection: "row",
          backgroundColor: t.colors.backgroundElevated,
          borderRadius: t.radius.full,
          padding: 3,
          borderWidth: 1,
          borderColor: t.colors.border,
          ...t.shadows.sm,
        }}
      >
        {(["ta", "en"] as const).map((lang) => {
          const active = locale === lang;
          return (
            <View
              key={lang}
              style={{
                paddingHorizontal: t.spacing.sm,
                paddingVertical: t.spacing.xxs,
                borderRadius: t.radius.full,
                backgroundColor: active ? t.colors.accent : "transparent",
              }}
            >
              <Text
                size="xs"
                weight="semibold"
                color={active ? "textInverse" : "textSecondary"}
              >
                {lang === "ta" ? "தமிழ்" : "EN"}
              </Text>
            </View>
          );
        })}
      </View>
    </ScalePress>
  );
});
