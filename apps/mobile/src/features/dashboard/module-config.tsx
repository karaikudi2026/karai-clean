import type { ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";

export type DashboardModule = {
  id: string;
  titleKey: string;
  subtitleKey: string;
  icon: ComponentProps<typeof Ionicons>["name"];
  route?: string;
  locked?: boolean;
};

export const DASHBOARD_MODULES: DashboardModule[] = [
  {
    id: "mla-updates",
    titleKey: "dashboard.mlaUpdates",
    subtitleKey: "dashboard.mlaUpdatesSub",
    icon: "newspaper-outline",
  },
  {
    id: "sos",
    titleKey: "dashboard.sos",
    subtitleKey: "dashboard.sosSub",
    icon: "alert-circle-outline",
  },
  {
    id: "volunteers",
    titleKey: "dashboard.volunteers",
    subtitleKey: "dashboard.volunteersSub",
    icon: "heart-outline",
  },
  {
    id: "welfare",
    titleKey: "dashboard.welfare",
    subtitleKey: "dashboard.welfareSub",
    icon: "shield-checkmark-outline",
  },
  {
    id: "grievance",
    titleKey: "dashboard.grievance",
    subtitleKey: "dashboard.grievanceSub",
    icon: "chatbubble-ellipses-outline",
  },
  {
    id: "citizen-recognition",
    titleKey: "dashboard.citizenRecognition",
    subtitleKey: "dashboard.citizenRecognitionSub",
    icon: "ribbon-outline",
    locked: true,
  },
];
