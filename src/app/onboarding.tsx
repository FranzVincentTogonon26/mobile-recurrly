import images from "@/constants/images";
import { useAuth } from "@clerk/expo";
import { Redirect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image, Pressable, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Onboarding = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isLoaded, isSignedIn } = useAuth({
    treatPendingAsSignedOut: false,
  });

  if (isLoaded && isSignedIn) {
    return <Redirect href="/" />;
  }

  return (
    <View className="onboarding-screen">
      <StatusBar style="light" />

      <Animated.View
        entering={FadeIn.duration(400)}
        className="onboarding-hero"
      >
        <Image
          source={images.splashPattern}
          className="onboarding-pattern"
          style={{ aspectRatio: 440 / 551 }}
          resizeMode="contain"
          accessible={false}
        />
      </Animated.View>

      <Animated.View
        entering={FadeInDown.duration(500).delay(120)}
        className="onboarding-footer"
        style={{ paddingBottom: Math.max(insets.bottom, 16) + 16 }}
      >
        <Text accessibilityRole="header" className="onboarding-title">
          Gain Financial Clarity
        </Text>

        <Text className="onboarding-subtitle">
          Track, analyze and cancel with ease
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Get started"
          onPress={() => router.push("/sign-up")}
          className="onboarding-cta"
          style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
        >
          <Text className="onboarding-cta-text">Get Started</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Already have an account? Sign in"
          onPress={() => router.push("/sign-in")}
          className="onboarding-signin"
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <Text className="onboarding-signin-text">
            Already have an account?{" "}
            <Text className="onboarding-signin-strong">Sign in</Text>
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
};

export default Onboarding;
