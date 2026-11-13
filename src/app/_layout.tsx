import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { colors } from "@/constants/theme";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { View } from "react-native";

import "@/global.css";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

if (!publishableKey) {
  throw new Error(
    [
      "Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Add your key to .env.local.",
      "Run: 1) clerk auth login  2) clerk link  3) clerk env pull — then restart the dev server.",
    ].join("\n"),
  );
}

// Keep the splash screen visible until the fonts are ready.
SplashScreen.preventAutoHideAsync();

// Unauthenticated cold starts land on the onboarding screen.
export const unstable_settings = {
  anchor: "onboarding",
};

function RootNavigator() {
  const { isLoaded, isSignedIn } = useAuth({
    treatPendingAsSignedOut: false,
  });

  // Wait for Clerk before choosing the first screen so authenticated users
  // don't briefly see the onboarding flow.
  if (!isLoaded) {
    return <View className="flex-1 bg-background" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Protected guard={isSignedIn} redirectTo="/onboarding">
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>

      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen
          name="onboarding"
          options={{
            animation: "fade",
            contentStyle: { backgroundColor: colors.accent },
          }}
        />
        <Stack.Screen
          name="(auth)"
          options={{
            animation: "slide_from_right",
            animationTypeForReplace: "push",
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}

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
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <RootNavigator />
    </ClerkProvider>
  );
}
