import { colors } from "@/constants/theme";
import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";
import { View } from "react-native";

const AuthLayout = () => {
  const { isLoaded, isSignedIn } = useAuth({
    treatPendingAsSignedOut: false,
  });

  if (!isLoaded) {
    return <View className="flex-1 bg-background" />;
  }

  if (isSignedIn) {
    return <Redirect href="/" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        animationTypeForReplace: "push",
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
};

export default AuthLayout;
