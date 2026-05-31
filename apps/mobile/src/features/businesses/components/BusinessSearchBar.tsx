import React, { memo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SearchBar, Text, useTheme } from "@mykaraikudi/ui";
import { useTranslation } from "react-i18next";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress: () => void;
  hasActiveFilters?: boolean;
};

export const BusinessSearchBar = memo(function BusinessSearchBar({
  value,
  onChangeText,
  onFilterPress,
  hasActiveFilters,
}: Props) {
  const t = useTheme();
  const { t: tr } = useTranslation();

  return (
    <View style={styles.wrap}>
      <View style={styles.searchRow}>
        <View style={styles.searchFlex}>
          <SearchBar
            value={value}
            onChangeText={onChangeText}
            placeholder={tr("businesses.searchPlaceholder")}
          />
        </View>
        <Pressable
          onPress={onFilterPress}
          style={({ pressed }) => [
            styles.filterBtn,
            {
              backgroundColor: hasActiveFilters
                ? t.colors.accentSoft
                : t.colors.backgroundElevated,
              borderColor: hasActiveFilters
                ? t.colors.accent
                : t.colors.border,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
          accessibilityLabel={tr("businesses.filter")}
        >
          <Ionicons
            name="options-outline"
            size={22}
            color={hasActiveFilters ? t.colors.accent : t.colors.textSecondary}
          />
        </Pressable>
      </View>

      <View style={styles.locationRow}>
        <Ionicons name="location" size={16} color={t.colors.accent} />
        <Text size="sm" color="textSecondary" style={{ marginLeft: 6 }}>
          {tr("businesses.location")}
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    gap: 10,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchFlex: {
    flex: 1,
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 4,
  },
});
