import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Card, LanguageSwitch, Text, useTheme, FadeIn } from "@mykaraikudi/ui";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/src/stores/auth-store";
import { useLocaleStore } from "@/src/stores/locale-store";

export default function ProfileScreen() {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const insets = useSafeAreaInsets();
  const locale = useLocaleStore((s) => s.locale);
  const toggleLocale = useLocaleStore((s) => s.toggleLocale);
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: t.colors.background,
          paddingTop: insets.top + t.spacing.xl,
          paddingHorizontal: t.spacing.xl,
        },
      ]}
    >
      <FadeIn>
        <Text size="xxl" display weight="semibold">
          {tr("profile.title")}
        </Text>

        <Card style={{ marginTop: t.spacing.xl }}>
          {accessToken ? (
            <>
              <Text size="md" weight="semibold">
                Signed in
              </Text>
              <Text size="sm" color="textSecondary" style={{ marginTop: t.spacing.xs }}>
                You can now register and post farmer utilities.
              </Text>
            </>
          ) : (
            <>
              <Text size="md" weight="semibold">
                {tr("profile.guest")}
              </Text>
              <Text size="sm" color="textSecondary" style={{ marginTop: t.spacing.xs }}>
                {tr("profile.loginHint")}
              </Text>

              <Pressable
                onPress={() => router.push("/login?redirectTo=/agri")}
                style={({ pressed }) => [
                  {
                    marginTop: t.spacing.lg,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: t.colors.accent,
                    paddingVertical: 12,
                    borderRadius: 14,
                    opacity: pressed ? 0.9 : 1,
                  },
                ]}
              >
                <Text size="sm" weight="semibold" color="textInverse">
                  Sign in with OTP
                </Text>
              </Pressable>
            </>
          )}
        </Card>

        <View style={{ marginTop: t.spacing.xl, alignItems: "flex-start" }}>
          <Text size="sm" color="textSecondary" style={{ marginBottom: t.spacing.sm }}>
            Language
          </Text>
          <LanguageSwitch locale={locale} onToggle={toggleLocale} />
        </View>
      </FadeIn>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
