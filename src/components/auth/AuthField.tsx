import { colors } from "@/constants/theme";
import { clsx } from "clsx";
import type { RefObject } from "react";
import {
  Pressable,
  Text,
  TextInput,
  View,
  type TextInputInstance,
  type TextInputProps,
} from "react-native";

interface AuthFieldProps extends Omit<TextInputProps, "className"> {
  label: string;
  error?: string | null;
  helper?: string;
  helperSuccess?: boolean;
  labelAction?: {
    label: string;
    onPress: () => void;
  };
  actionLabel?: string;
  onActionPress?: () => void;
  inputRef?: RefObject<TextInputInstance | null>;
  inputClassName?: string;
}

const AuthField = ({
  label,
  error,
  helper,
  helperSuccess = false,
  labelAction,
  actionLabel,
  onActionPress,
  inputRef,
  inputClassName,
  ...inputProps
}: AuthFieldProps) => {
  return (
    <View className="auth-field">
      <View className="auth-label-row">
        <Text className="auth-label">{label}</Text>

        {labelAction ? (
          <Pressable
            onPress={labelAction.onPress}
            hitSlop={8}
            accessibilityRole="button"
          >
            <Text className="auth-label-action">{labelAction.label}</Text>
          </Pressable>
        ) : null}
      </View>

      <View
        className={clsx(
          "auth-input-wrap",
          error ? "auth-input-wrap-error" : null,
        )}
      >
        <TextInput
          ref={inputRef}
          className={inputClassName ?? "auth-input"}
          placeholderTextColor={colors.mutedForeground}
          selectionColor={colors.accent}
          underlineColorAndroid="transparent"
          accessibilityLabel={label}
          {...inputProps}
        />

        {actionLabel && onActionPress ? (
          <Pressable
            onPress={onActionPress}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={actionLabel}
          >
            <Text className="auth-input-action">{actionLabel}</Text>
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <Text className="auth-error" accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : helper ? (
        <Text
          className={clsx(
            "auth-helper",
            helperSuccess ? "auth-helper-good" : null,
          )}
          accessibilityLiveRegion="polite"
        >
          {helper}
        </Text>
      ) : null}
    </View>
  );
};

export default AuthField;
