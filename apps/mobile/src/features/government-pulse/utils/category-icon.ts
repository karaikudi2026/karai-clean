import type { GovernmentUpdate } from "../types";

const CATEGORY_ICONS: Record<string, string> = {
  welfare: "heart-outline",
  education: "school-outline",
  healthcare: "medkit-outline",
  infrastructure: "construct-outline",
  scheme: "ribbon-outline",
};

export function getCategoryIcon(category?: string): string {
  if (!category) return "megaphone-outline";
  return CATEGORY_ICONS[category] ?? "newspaper-outline";
}

export function sortByPriority(updates: GovernmentUpdate[]): GovernmentUpdate[] {
  return [...updates].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
}
