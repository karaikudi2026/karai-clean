import { useRouter } from "expo-router";
import { BrandSplash } from "@/src/features/splash/BrandSplash";

export default function SplashScreen() {
  const router = useRouter();

  return (
    <BrandSplash
      onComplete={() => router.replace("/(launch)/minister")}
    />
  );
}
