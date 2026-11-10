import { clsx } from "clsx";
import { Text, View } from "react-native";

type AuthAlertVariant = "error" | "info" | "success";

interface AuthAlertProps {
  message: string;
  variant?: AuthAlertVariant;
}

const VARIANTS: Record<
  AuthAlertVariant,
  { container: string; dot: string; text: string }
> = {
  error: {
    container: "auth-banner-error",
    dot: "auth-banner-dot-error",
    text: "auth-banner-text-error",
  },
  info: {
    container: "auth-banner-info",
    dot: "auth-banner-dot-info",
    text: "auth-banner-text-info",
  },
  success: {
    container: "auth-banner-success",
    dot: "auth-banner-dot-success",
    text: "auth-banner-text-success",
  },
};

const AuthAlert = ({ message, variant = "error" }: AuthAlertProps) => {
  const styles = VARIANTS[variant];

  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      className={clsx("auth-banner", styles.container)}
    >
      <View className={clsx("auth-banner-dot", styles.dot)} />
      <Text className={clsx("auth-banner-text", styles.text)}>{message}</Text>
    </View>
  );
};

export default AuthAlert;
