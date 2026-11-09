import { Tabs } from "expo-router";

const TabLayout = () => (
  <Tabs screenOptions={{ headerShown: false }}>
    <Tabs.Screen name="index" options={{ title: "Home" }} />
    <Tabs.Screen name="subscription" options={{ title: "Subscriptions" }} />
    <Tabs.Screen name="insights" options={{ title: "Insights" }} />
    <Tabs.Screen name="setting" options={{ title: "Settings" }} />
    <Tabs.Screen name="subscriptions/[id]" options={{ href: null }} />
  </Tabs>
);

export default TabLayout;
