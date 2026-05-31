import React, { memo } from "react";
import { TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeContext";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export const SearchBar = memo(function SearchBar({
  value,
  onChangeText,
  placeholder = "Search...",
}: Props) {
  const t = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: t.colors.backgroundElevated,
        borderRadius: t.radius.md,
        paddingHorizontal: t.spacing.md,
        paddingVertical: t.spacing.sm,
        borderWidth: 1,
        borderColor: t.colors.border,
        ...t.shadows.sm,
      }}
    >
      <Ionicons
        name="search-outline"
        size={20}
        color={t.colors.textTertiary}
        style={{ marginRight: t.spacing.sm }}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={t.colors.textTertiary}
        style={{
          flex: 1,
          fontSize: t.fontSize.md,
          fontFamily: t.fontFamily.sans,
          color: t.colors.textPrimary,
          paddingVertical: 0,
        }}
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
    </View>
  );
});
