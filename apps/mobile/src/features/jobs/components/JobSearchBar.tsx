import React, { memo } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { SearchBar, Text, useTheme } from "@mykaraikudi/ui";

const LOCATIONS = ["karaikudi", "sivagangai", "nearby"] as const;

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress: () => void;
  hasActiveFilters?: boolean;
  selectedLocation: string;
  onLocationChange: (key: string) => void;
};

export const JobSearchBar = memo(function JobSearchBar({
  value,
  onChangeText,
  onFilterPress,
  hasActiveFilters,
  selectedLocation,
  onLocationChange,
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
            placeholder={tr("jobs.searchPlaceholder")}
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
          accessibilityLabel={tr("jobs.filter")}
        >
          <Ionicons
            name="options-outline"
            size={22}
            color={hasActiveFilters ? t.colors.accent : t.colors.textSecondary}
          />
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
      >
        {LOCATIONS.map((key) => {
          const active = selectedLocation === key;
          return (
            <Pressable
              key={key}
              onPress={() => onLocationChange(key)}
              style={[
                styles.chip,
                {
                  backgroundColor: active
                    ? t.colors.accent
                    : t.colors.backgroundElevated,
                  borderColor: active ? t.colors.accent : t.colors.border,
                },
              ]}
            >
              <Ionicons
                name="location-outline"
                size={14}
                color={active ? "#fff" : t.colors.textSecondary}
              />
              <Text
                size="xs"
                weight="semibold"
                style={{ marginLeft: 4, color: active ? "#fff" : undefined }}
              >
                {tr(`jobs.locations.${key}`)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  searchRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  searchFlex: { flex: 1 },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  chips: { gap: 8, paddingRight: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
});
