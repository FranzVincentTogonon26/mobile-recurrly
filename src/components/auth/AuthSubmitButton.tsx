import { colors } from "@/constants/theme";
import { clsx } from "clsx";
import { ActivityIndicator, Pressable, Text } from "react-native";

interface AuthSubmitButtonProps {
  label: string;
  loadingLabel?: string;
  loading?: boolean;
  disabled?: boolean;
  onPress: () => void;
}

const AuthSubmitButton = ({
  label,
  loadingLabel,
  loading = false,
  disabled = false,
  onPress,
}: AuthSubmitButtonProps) => {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      className={clsx("auth-button", isDisabled ? "auth-button-disabled" : null)}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.background} />
      ) : null}

      <Text className="auth-button-text">
        {loading ? (loadingLabel ?? label) : label}
      </Text>
    </Pressable>
  );
};

export default AuthSubmitButton;
