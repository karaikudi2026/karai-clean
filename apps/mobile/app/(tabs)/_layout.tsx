import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import { PremiumTabBar } from "@/src/components/navigation/PremiumTabBar";

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      tabBar={(props) => <PremiumTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        lazy: true,
      }}
    >
      <Tabs.Screen name="index" options={{ title: t("tabs.home") }} />
      <Tabs.Screen name="businesses" options={{ title: t("tabs.business") }} />
      <Tabs.Screen name="agri" options={{ title: t("tabs.agri") }} />
      <Tabs.Screen name="jobs" options={{ title: t("tabs.jobs") }} />
      <Tabs.Screen name="profile" options={{ title: t("tabs.profile") }} />
      <Tabs.Screen name="events" options={{ href: null }} />
      <Tabs.Screen
        name="grievance"
        options={{ href: null, title: t("dashboard.grievance") }}
      />
      <Tabs.Screen
        name="mla-updates"
        options={{ href: null, title: t("dashboard.mlaUpdates") }}
      />
    </Tabs>
  );
}
