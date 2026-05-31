import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { AnimatedButton, FadeIn, Text } from "@mykaraikudi/ui";

type Props = {
  onPress: () => void;
};

export const PostJobCTA = memo(function PostJobCTA({ onPress }: Props) {
  const { t: tr } = useTranslation();

  return (
    <FadeIn>
      <LinearGradient
        colors={["#1A2332", "#2D3A52", "#B84A4A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.glow} />
        <View style={styles.iconCircle}>
          <Ionicons name="briefcase" size={28} color="#C4A574" />
        </View>
        <Text size="lg" weight="semibold" style={styles.title}>
          {tr("jobs.postTitle")}
        </Text>
        <Text size="sm" style={styles.subtitle}>
          {tr("jobs.postSubtitle")}
        </Text>
        <AnimatedButton
          label={tr("jobs.postCta")}
          onPress={onPress}
          style={styles.button}
          fullWidth
        />
      </LinearGradient>
    </FadeIn>
  );
});

const styles = StyleSheet.create({
  gradient: {
    borderRadius: 22,
    padding: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(196, 165, 116, 0.2)",
    shadowColor: "#0A0F18",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 8,
  },
  glow: {
    position: "absolute",
    top: -24,
    right: -16,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(196, 165, 116, 0.15)",
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  title: { color: "#FFFFFF", marginBottom: 6 },
  subtitle: { color: "rgba(255,255,255,0.88)", lineHeight: 22, marginBottom: 18 },
  button: {
    backgroundColor: "#C4A574",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
});
