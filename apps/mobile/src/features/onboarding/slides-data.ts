import type { ImageSourcePropType } from "react-native";

import { onboardingAssets } from "../../assets/images";

export type OnboardingSlideData = {
  id: string;
  titleKey: string;
  subtitleKey: string;
  image: ImageSourcePropType;
};

export const ONBOARDING_SLIDES: OnboardingSlideData[] = [
  {
    id: "heritage",
    titleKey: "onboarding.slide1Title",
    subtitleKey: "onboarding.slide1Subtitle",
    image: onboardingAssets.heritage,
  },
  {
    id: "culture",
    titleKey: "onboarding.slide2Title",
    subtitleKey: "onboarding.slide2Subtitle",
    image: onboardingAssets.culture,
  },
  {
    id: "food",
    titleKey: "onboarding.slide3Title",
    subtitleKey: "onboarding.slide3Subtitle",
    image: onboardingAssets.food,
  },
  {
    id: "construction",
    titleKey: "onboarding.slide5Title",
    subtitleKey: "onboarding.slide5Subtitle",
    image: onboardingAssets.construction,
  },
];
