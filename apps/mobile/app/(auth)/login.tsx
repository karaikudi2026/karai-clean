import React, { memo, useMemo, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { supabase } from "@/src/lib/supabase";
import { useAuthStore } from "@/src/stores/auth-store";
import { Card, Text, useTheme, FadeIn } from "@mykaraikudi/ui";

function normalizePhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  // Assume India (myKaraikudi is Tamil Nadu).
  if (digits.startsWith("91") && digits.length >= 12) return `+${digits}`;
  if (digits.length === 10) return `+91${digits}`;
  // If user already typed country code without '+'.
  if (digits.length > 10 && digits.startsWith("0")) return `+${digits.slice(1)}`;
  return `+${digits}`;
}

export default memo(function LoginScreen() {
  const t = useTheme();
  const router = useRouter();
  const { redirectTo } = useLocalSearchParams<{ redirectTo?: string }>();
  const accessToken = useAuthStore((s) => s.accessToken);

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [mode, setMode] = useState<"phone" | "otp">("phone");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const normalizedPhone = useMemo(() => normalizePhone(phone), [phone]);

  const canSend = normalizedPhone.length >= 10 && !sending;
  const canVerify = otp.trim().length >= 4 && !verifying;

  if (accessToken) {
    // Already authenticated.
    const target = typeof redirectTo === "string" ? redirectTo : "/agri";
    router.replace(target);
    return null;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: t.colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.root, { paddingTop: t.spacing.xl, paddingHorizontal: t.spacing.xl }]}>
        <FadeIn>
          <Text size="xxl" display weight="semibold">
            Sign in
          </Text>
          <Text size="sm" color="textSecondary" style={{ marginTop: t.spacing.xs, lineHeight: 20 }}>
            OTP login via phone number.
          </Text>
        </FadeIn>

        <Card style={{ marginTop: t.spacing.xl, borderRadius: 24 }}>
          <View style={styles.form}>
            <View style={styles.field}>
              <View style={styles.labelRow}>
                <Ionicons name="call-outline" size={18} color={t.colors.accent} />
                <Text size="sm" weight="semibold">
                  Phone number
                </Text>
              </View>

              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="e.g. 9876543210"
                keyboardType="phone-pad"
                style={[styles.input, { color: t.colors.textPrimary }]}
                autoComplete="tel"
              />
            </View>

            {mode === "otp" ? (
              <View style={styles.field}>
                <View style={styles.labelRow}>
                  <Ionicons name="shield-checkmark-outline" size={18} color={t.colors.accent} />
                  <Text size="sm" weight="semibold">
                    Enter OTP
                  </Text>
                </View>
                <TextInput
                  value={otp}
                  onChangeText={setOtp}
                  placeholder="4-6 digits"
                  keyboardType="number-pad"
                  style={[styles.input, { color: t.colors.textPrimary }]}
                />
              </View>
            ) : null}

            <Pressable
              disabled={mode === "phone" ? !canSend : !canVerify}
              onPress={async () => {
                const phoneToUse = normalizedPhone;
                if (!phoneToUse) {
                  Alert.alert("Invalid phone", "Please enter a valid phone number.");
                  return;
                }

                if (mode === "phone") {
                  setSending(true);
                  try {
                    const { error } = await supabase.auth.signInWithOtp({
                      phone: phoneToUse,
                    });
                    if (error) throw error;
                    setMode("otp");
                    Alert.alert("OTP sent", "Check your SMS for the verification code.");
                  } catch (err: any) {
                    Alert.alert("OTP failed", err?.message ?? "Could not send OTP. Try again.");
                  } finally {
                    setSending(false);
                  }
                  return;
                }

                // verify OTP
                setVerifying(true);
                try {
                  const { error } = await supabase.auth.verifyOtp({
                    phone: phoneToUse,
                    token: otp.trim(),
                    type: "sms",
                  });
                  if (error) throw error;

                  const target = typeof redirectTo === "string" ? redirectTo : "/agri";
                  router.replace(target);
                } catch (err: any) {
                  Alert.alert("Verification failed", err?.message ?? "OTP verification failed.");
                } finally {
                  setVerifying(false);
                }
              }}
              style={({ pressed }) => [
                styles.primaryBtn,
                { opacity: pressed ? 0.9 : 1, backgroundColor: t.colors.accent },
              ]}
            >
              <Text size="sm" weight="semibold" color="textInverse">
                {mode === "phone" ? (sending ? "Sending..." : "Send OTP") : verifying ? "Verifying..." : "Verify OTP"}
              </Text>
            </Pressable>

            {mode === "otp" ? (
              <Pressable
                onPress={() => {
                  setMode("phone");
                  setOtp("");
                }}
                style={{ marginTop: 12, alignItems: "center" }}
              >
                <Text size="sm" color="textSecondary">
                  Change phone
                </Text>
              </Pressable>
            ) : null}
          </View>
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
});

const styles = StyleSheet.create({
  root: { flex: 1 },
  form: { gap: 16 },
  field: { gap: 10 },
  labelRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  input: {
    borderWidth: 1,
    borderColor: "rgba(26,26,26,0.12)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  primaryBtn: {
    marginTop: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});

