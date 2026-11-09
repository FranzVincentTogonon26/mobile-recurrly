import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-xl font-bold text-success">
        Welcome to Nativewind!h
      </Text>

      <Link href={"/subscriptions/spotify"}>Spotify</Link>
    </View>
  );
}
