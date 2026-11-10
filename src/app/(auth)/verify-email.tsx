import AuthAlert from "@/components/auth/AuthAlert";
import AuthBrand from "@/components/auth/AuthBrand";
import AuthField from "@/components/auth/AuthField";
import AuthScreen from "@/components/auth/AuthScreen";
import AuthSubmitButton from "@/components/auth/AuthSubmitButton";
import { useCountdown } from "@/hooks/useCountdown";
import {
  CODE_LENGTH,
  mapAuthErrorToForm,
  parseAuthError,
  validateCode,
  type AuthFieldErrors,
} from "@/lib/auth";
import { useSignIn, useSignUp } from "@clerk/expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import { clsx } from "clsx";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

const VerifyEmailScreen = () => {
  const router = useRouter();
  const { mode: modeParam, email: emailParam } = useLocalSearchParams<{
    mode?: string;
    email?: string;
  }>();

  const mode = modeParam === "sign-in" ? "sign-in" : "sign-up";
  const email = typeof emailParam === "string" ? emailParam : "";

  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const { secondsLeft, start } = useCountdown();

  const [code, setCode] = useState("");
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    start();
  }, [start]);

  const isFlowActive =
    mode === "sign-up"
      ? signUp.status === "missing_requirements" ||
        signUp.status === "complete"
      : signIn.status === "needs_client_trust" ||
        signIn.status === "needs_second_factor" ||
        signIn.status === "complete";

  const title =
    mode === "sign-up" ? "Check your inbox" : "Verify this device";

  const subtitle = email
    ? mode === "sign-up"
      ? `We sent a 6-digit code to ${email}. Enter it below to finish creating your account.`
      : `For your safety, we sent a 6-digit code to ${email} to confirm this device.`
    : "We sent a 6-digit code to your email.";

  const handleCodeChange = (value: string) => {
    setCode(value.replace(/\D/g, "").slice(0, CODE_LENGTH));
    setFieldErrors((current) => ({ ...current, code: null }));
    if (formError) setFormError(null);
    if (notice) setNotice(null);
  };

  const finishSignUp = async () => {
    const { error: finalizeError } = await signUp.finalize();

    if (finalizeError) {
      setFormError(parseAuthError(finalizeError).message);
      return;
    }

    router.replace("/");
  };

  const finishSignIn = async () => {
    const { error: finalizeError } = await signIn.finalize();

    if (finalizeError) {
      setFormError(parseAuthError(finalizeError).message);
      return;
    }

    router.replace("/");
  };

  const handleVerify = async () => {
    if (isSubmitting) return;

    const codeError = validateCode(code);
    setFieldErrors({ code: codeError });
    setFormError(null);
    setNotice(null);

    if (codeError) return;

    setIsSubmitting(true);

    try {
      if (mode === "sign-up") {
        // If a previous finalize attempt failed, retry it instead of
        // re-verifying a sign-up that is already complete.
        if (signUp.status === "complete") {
          await finishSignUp();
          return;
        }

        const { error } = await signUp.verifications.verifyEmailCode({ code });

        if (error) {
          const mapped = mapAuthErrorToForm(error);
          setFieldErrors(mapped);
          if (mapped.form) setFormError(mapped.form);
          return;
        }

        const signUpStatus: string = signUp.status;
        if (signUpStatus !== "complete") {
          setFormError(
            "Your email is verified, but we still need a little more information. Go back and finish the form.",
          );
          return;
        }

        await finishSignUp();
        return;
      }

      // If a previous finalize attempt failed, retry it instead of
      // re-verifying a sign-in that is already complete.
      if (signIn.status === "complete") {
        await finishSignIn();
        return;
      }

      const { error } = await signIn.mfa.verifyEmailCode({ code });

      if (error) {
        const mapped = mapAuthErrorToForm(error);
        setFieldErrors(mapped);
        if (mapped.form) setFormError(mapped.form);
        return;
      }

      const signInStatus: string = signIn.status;
      if (signInStatus !== "complete") {
        setFormError(
          "That code was accepted, but sign-in isn't complete. Start again.",
        );
        return;
      }

      await finishSignIn();
    } catch (error) {
      setFormError(
        parseAuthError(
          error,
          "We couldn't reach Recurrly. Check your connection and try again.",
        ).message,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (isResending || secondsLeft > 0) return;

    setIsResending(true);
    setFormError(null);
    setNotice(null);

    try {
      const { error } =
        mode === "sign-up"
          ? await signUp.verifications.sendEmailCode()
          : await signIn.mfa.sendEmailCode();

      if (error) {
        setFormError(
          parseAuthError(
            error,
            "We couldn't send a new code. Try again in a moment.",
          ).message,
        );
        return;
      }

      start();
      setNotice("A new code is on its way.");
    } catch (error) {
      setFormError(
        parseAuthError(
          error,
          "We couldn't send a new code. Try again in a moment.",
        ).message,
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleStartOver = async () => {
    if (mode === "sign-up") {
      await signUp.reset();
    } else {
      await signIn.reset();
    }

    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace(mode === "sign-up" ? "/sign-up" : "/sign-in");
  };

  if (!isFlowActive) {
    return (
      <AuthScreen>
        <AuthBrand />

        <View className="auth-card">
          <View className="auth-card-header">
            <Text accessibilityRole="header" className="auth-title">
              This code expired
            </Text>
            <Text className="auth-subtitle">
              Start again and we’ll send a fresh verification code.
            </Text>
          </View>

          <View className="auth-form">
            <AuthSubmitButton
              label="Start again"
              onPress={() => {
                void handleStartOver();
              }}
            />
          </View>
        </View>
      </AuthScreen>
    );
  }

  return (
    <AuthScreen>
      <AuthBrand />

      <View className="auth-card">
        <View className="auth-card-header">
          <Text accessibilityRole="header" className="auth-title">
            {title}
          </Text>
          <Text className="auth-subtitle">{subtitle}</Text>
        </View>

        <View className="auth-form">
          {formError ? <AuthAlert message={formError} /> : null}
          {notice ? <AuthAlert variant="success" message={notice} /> : null}

          <AuthField
            label="6-digit code"
            value={code}
            onChangeText={handleCodeChange}
            placeholder="000000"
            keyboardType="number-pad"
            inputMode="numeric"
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
            maxLength={CODE_LENGTH}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleVerify}
            inputClassName="auth-input-code"
            error={fieldErrors.code}
            editable={!isSubmitting}
          />

          <AuthSubmitButton
            label={mode === "sign-up" ? "Verify email" : "Verify and sign in"}
            loadingLabel="Verifying…"
            loading={isSubmitting}
            onPress={() => {
              void handleVerify();
            }}
          />

          <View className="auth-resend-row">
            <Text className="auth-link-copy">Didn’t get the code?</Text>

            <Pressable
              onPress={() => {
                void handleResend();
              }}
              disabled={secondsLeft > 0 || isResending}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityState={{
                disabled: secondsLeft > 0 || isResending,
              }}
            >
              <Text
                className={clsx(
                  "auth-resend",
                  (secondsLeft > 0 || isResending) && "auth-resend-disabled",
                )}
              >
                {isResending
                  ? "Sending…"
                  : secondsLeft > 0
                    ? `Resend in ${secondsLeft}s`
                    : "Resend code"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      <Pressable
        onPress={() => {
          void handleStartOver();
        }}
        className="auth-link-row"
        accessibilityRole="button"
        hitSlop={8}
      >
        <Text className="auth-link-copy">Wrong email?</Text>
        <Text className="auth-link">Start over</Text>
      </Pressable>
    </AuthScreen>
  );
};

export default VerifyEmailScreen;
