import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { AnimatedButton, FadeIn, Text, useTheme } from "@mykaraikudi/ui";

type Props = {
  onPress: () => void;
};

export const RegisterBusinessCTA = memo(function RegisterBusinessCTA({
  onPress,
}: Props) {
  const t = useTheme();
  const { t: tr } = useTranslation();

  return (
    <FadeIn>
      <LinearGradient
        colors={["#C4A574", "#B84A4A", "#9A3D3D"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.glow} />
        <View style={styles.iconCircle}>
          <Ionicons name="storefront" size={32} color="#FFFFFF" />
        </View>
        <Text size="lg" weight="semibold" style={styles.title}>
          {tr("businesses.registerTitle")}
        </Text>
        <Text size="sm" style={styles.subtitle}>
          {tr("businesses.registerSubtitle")}
        </Text>
        <AnimatedButton
          label={tr("businesses.registerCta")}
          onPress={onPress}
          style={[
            styles.button,
            {
              backgroundColor: t.colors.heritageGold,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.35)",
            },
          ]}
          fullWidth
        />
      </LinearGradient>
    </FadeIn>
  );
});

const styles = StyleSheet.create({
  gradient: {
    borderRadius: 24,
    padding: 24,
    overflow: "hidden",
    position: "relative",
  },
  glow: {
    position: "absolute",
    top: -40,
    right: -20,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    color: "rgba(255,255,255,0.9)",
    lineHeight: 22,
    marginBottom: 20,
  },
  button: {
    marginTop: 4,
  },
});
