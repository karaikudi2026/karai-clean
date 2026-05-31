import type { Locale } from "@mykaraikudi/constants";

import type { GovernmentUpdate } from "../types";

export function getUpdateTitle(
  item: GovernmentUpdate,
  locale: Locale
): string {
  return locale === "ta" ? item.title_ta : item.title_en;
}
