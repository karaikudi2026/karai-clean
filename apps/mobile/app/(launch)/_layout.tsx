import { Stack } from "expo-router";

export default function LaunchLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
      <Stack.Screen name="splash" />
      <Stack.Screen name="minister" />
    </Stack>
  );
}
