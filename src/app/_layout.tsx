import { Stack } from "expo-router";

import "@/global.css";

export default function RootLayout() {
  return (
    <Stack>
      {/* The tab group is the Home screen; hide the Stack's "(tabs)" header. */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
