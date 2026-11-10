import { useRouter } from "expo-router";
import { Pressable, Text } from "react-native";

interface AuthBackLinkProps {
  label?: string;
  onPress?: () => void;
}

const AuthBackLink = ({ label = "Back", onPress }: AuthBackLinkProps) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }

    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/sign-in");
  };

  return (
    <Pressable
      onPress={handlePress}
      className="auth-back"
      accessibilityRole="button"
      hitSlop={8}
    >
      <Text className="auth-back-text">← {label}</Text>
    </Pressable>
  );
};

export default AuthBackLink;
