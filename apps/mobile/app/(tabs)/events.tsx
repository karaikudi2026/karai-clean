import { useTranslation } from "react-i18next";
import { PlaceholderScreen } from "@/src/components/screens/PlaceholderScreen";

export default function EventsScreen() {
  const { t } = useTranslation();
  return (
    <PlaceholderScreen
      title={t("tabs.events")}
      subtitle={t("dashboard.eventsSub")}
    />
  );
}
