import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import "@/global.css";

// Keep the splash screen visible until the fonts are ready.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "sans-regular": require("@/assets/fonts/PlusJakartaSans-Regular.ttf"),
    "sans-bold": require("@/assets/fonts/PlusJakartaSans-Bold.ttf"),
    "sans-medium": require("@/assets/fonts/PlusJakartaSans-Medium.ttf"),
    "sans-semibold": require("@/assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "sans-extrabold": require("@/assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "sans-light": require("@/assets/fonts/PlusJakartaSans-Light.ttf"),
  });

  useEffect(() => {
    // Hide the splash screen once fonts are ready, or if loading failed.
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Don't render the app until the fonts are ready.
  if (!fontsLoaded && !fontError) return null;

  return (
    <Stack>
      {/* The tab group is the Home screen; hide the Stack's "(tabs)" header. */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
