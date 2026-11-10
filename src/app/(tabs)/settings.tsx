import { useClerk, useUser } from "@clerk/expo";
import { clsx } from "clsx";
import { useRouter } from "expo-router";
import { cssInterop } from "nativewind";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

cssInterop(SafeAreaView, { className: "style" });

const Settings = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const displayName =
    user?.fullName?.trim() ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    email.split("@")[0] ||
    "Recurrly member";

  const initials =
    [user?.firstName, user?.lastName]
      .filter(Boolean)
      .map((part) => part?.charAt(0).toUpperCase())
      .join("") ||
    email.charAt(0).toUpperCase() ||
    "R";

  const handleSignOut = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);
    setSignOutError(null);

    try {
      await signOut();
      router.replace("/sign-in");
    } catch {
      setSignOutError("We couldn't sign you out. Try again.");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-2xl font-sans-bold text-primary">Settings</Text>

      <Text className="settings-section-title">Account</Text>

      <View className="settings-account-card">
        {isLoaded && user?.hasImage ? (
          <Image source={{ uri: user.imageUrl }} className="settings-avatar" />
        ) : (
          <View className="settings-avatar-fallback">
            <Text className="settings-avatar-initials">
              {isLoaded ? initials : "R"}
            </Text>
          </View>
        )}

        <View className="settings-account-copy">
          <Text numberOfLines={1} className="settings-name">
            {isLoaded ? displayName : "Loading your account…"}
          </Text>

          {isLoaded && email ? (
            <Text numberOfLines={1} className="settings-email">
              {email}
            </Text>
          ) : null}
        </View>
      </View>

      {signOutError ? (
        <Text className="auth-error mt-3">{signOutError}</Text>
      ) : null}

      <Pressable
        onPress={() => {
          void handleSignOut();
        }}
        disabled={isSigningOut}
        accessibilityRole="button"
        accessibilityState={{ disabled: isSigningOut, busy: isSigningOut }}
        className={clsx(
          "settings-signout",
          isSigningOut && "settings-signout-disabled",
        )}
      >
        <Text
          className={clsx(
            "settings-signout-text",
            isSigningOut && "settings-signout-text-disabled",
          )}
        >
          {isSigningOut ? "Signing out…" : "Sign out"}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Settings;
