import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import type { Locale } from "@mykaraikudi/constants";

import en from "../../locales/en.json";
import ta from "../../locales/ta.json";

const deviceLocale = Localization.getLocales()[0]?.languageCode;
const defaultLocale: Locale = deviceLocale === "ta" ? "ta" : "en";

void i18n.use(initReactI18next).init({
  compatibilityJSON: "v4",
  resources: {
    en: { translation: en },
    ta: { translation: ta },
  },
  lng: defaultLocale,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export { i18n };
export default i18n;
