import { StatusBar } from "expo-status-bar";
import { cssInterop } from "nativewind";
import type { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

cssInterop(SafeAreaView, { className: "style" });

interface AuthScreenProps {
  children: ReactNode;
}

const AuthScreen = ({ children }: AuthScreenProps) => {
  return (
    <SafeAreaView className="auth-safe-area">
      <StatusBar style="dark" />

      <Animated.View entering={FadeIn.duration(240)} style={{ flex: 1 }}>

        <KeyboardAvoidingView
          className="auth-screen"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            className="auth-scroll"
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="auth-content">{children}</View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Animated.View>
    </SafeAreaView>
  );
};

export default AuthScreen;
