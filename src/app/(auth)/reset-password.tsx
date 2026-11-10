import AuthAlert from "@/components/auth/AuthAlert";
import AuthBackLink from "@/components/auth/AuthBackLink";
import AuthBrand from "@/components/auth/AuthBrand";
import AuthField from "@/components/auth/AuthField";
import AuthFooterLink from "@/components/auth/AuthFooterLink";
import AuthScreen from "@/components/auth/AuthScreen";
import AuthSubmitButton from "@/components/auth/AuthSubmitButton";
import { useCountdown } from "@/hooks/useCountdown";
import {
  CODE_LENGTH,
  PASSWORD_MIN_LENGTH,
  mapAuthErrorToForm,
  parseAuthError,
  validateCode,
  validateEmail,
  validateNewPassword,
  type AuthFieldErrors,
} from "@/lib/auth";
import { useSignIn } from "@clerk/expo";
import { useLocalSearchParams, useRouter, type Href } from "expo-router";
import { clsx } from "clsx";
import { useRef, useState } from "react";
import { Pressable, Text, type TextInputInstance, View } from "react-native";

type ResetStep = "request" | "verify" | "password";

const ResetPasswordScreen = () => {
  const router = useRouter();
  const { email: emailParam } = useLocalSearchParams<{ email?: string }>();
  const { signIn } = useSignIn();
  const { secondsLeft, start, reset: resetCountdown } = useCountdown();

  const confirmRef = useRef<TextInputInstance>(null);

  const [step, setStep] = useState<ResetStep>("request");
  const [email, setEmail] = useState(
    typeof emailParam === "string" ? emailParam : "",
  );
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const signInHref: Href = email.trim()
    ? { pathname: "/sign-in", params: { email: email.trim() } }
    : "/sign-in";

  const title =
    step === "request"
      ? "Reset your password"
      : step === "verify"
        ? "Check your inbox"
        : "Choose a new password";

  const subtitle =
    step === "request"
      ? "Enter the email on your account and we'll send a 6-digit code."
      : step === "verify"
        ? email
          ? `We sent a 6-digit code to ${email}.`
          : "We sent a 6-digit code to your email."
        : `Use at least ${PASSWORD_MIN_LENGTH} characters. A phrase you'll remember works well.`;

  const buttonLabel =
    step === "request"
      ? "Send reset code"
      : step === "verify"
        ? "Verify code"
        : "Update password";

  const loadingLabel =
    step === "request"
      ? "Sending code…"
      : step === "verify"
        ? "Verifying…"
        : "Updating…";

  const backLabel =
    step === "verify"
      ? "Change email"
      : step === "password"
        ? "Cancel"
        : "Back to sign in";

  const applyError = (error: unknown, fallback?: string) => {
    const mapped = mapAuthErrorToForm(error, fallback);
    setFieldErrors(mapped);
    if (mapped.form) setFormError(mapped.form);
  };

  const handleBack = () => {
    if (step === "verify") {
      void signIn.reset();
      resetCountdown();
      setStep("request");
      setCode("");
      setFieldErrors({});
      setFormError(null);
      setNotice(null);
      return;
    }

    if (step === "password") {
      void signIn.reset();
    }

    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/sign-in");
  };

  const handleRequest = async () => {
    if (isSubmitting) return;

    const emailError = validateEmail(email);
    setFieldErrors({ email: emailError });
    setFormError(null);
    setNotice(null);

    if (emailError) return;

    setIsSubmitting(true);

    try {
      const { error: createError } = await signIn.create({
        identifier: email.trim(),
      });

      if (createError) {
        applyError(createError);
        return;
      }

      const { error: sendError } =
        await signIn.resetPasswordEmailCode.sendCode();

      if (sendError) {
        applyError(
          sendError,
          "We couldn't send a reset code. Try again in a moment.",
        );
        return;
      }

      setStep("verify");
      setCode("");
      setFieldErrors({});
      start();
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

  const handleVerify = async () => {
    if (isSubmitting) return;

    const codeError = validateCode(code);
    setFieldErrors({ code: codeError });
    setFormError(null);
    setNotice(null);

    if (codeError) return;

    setIsSubmitting(true);

    try {
      const { error } =
        await signIn.resetPasswordEmailCode.verifyCode({ code });

      if (error) {
        applyError(error);
        return;
      }

      if (signIn.status !== "needs_new_password") {
        setFormError(
          "That code was accepted, but the reset session expired. Start again.",
        );
        return;
      }

      resetCountdown();
      setStep("password");
      setFieldErrors({});
      setPassword("");
      setConfirmPassword("");
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

  const handlePasswordSubmit = async () => {
    if (isSubmitting) return;

    const passwordError = validateNewPassword(password);
    let confirmError: string | null = null;

    if (!confirmPassword) {
      confirmError = "Re-enter your new password.";
    } else if (confirmPassword !== password) {
      confirmError = "Those passwords don't match.";
    }

    setFieldErrors({ password: passwordError, confirm: confirmError });
    setFormError(null);

    if (passwordError || confirmError) return;

    setIsSubmitting(true);

    try {
      const { error } =
        await signIn.resetPasswordEmailCode.submitPassword({
          password,
          signOutOfOtherSessions: true,
        });

      if (error) {
        applyError(error);
        return;
      }

      if (signIn.status === "complete") {
        const { error: finalizeError } = await signIn.finalize();

        if (finalizeError) {
          setFormError(parseAuthError(finalizeError).message);
          return;
        }

        router.replace("/");
        return;
      }

      if (
        signIn.status === "needs_client_trust" ||
        signIn.status === "needs_second_factor"
      ) {
        const canUseEmailCode = signIn.supportedSecondFactors.some(
          (factor) => factor.strategy === "email_code",
        );

        if (!canUseEmailCode) {
          setFormError(
            "Your password is updated, but this device still needs verification. Sign in again to continue.",
          );
          return;
        }

        const { error: sendError } = await signIn.mfa.sendEmailCode();

        if (sendError) {
          setFormError(parseAuthError(sendError).message);
          return;
        }

        router.push({
          pathname: "/verify-email",
          params: { mode: "sign-in", email: email.trim() },
        });
        return;
      }

      setFormError(
        "Your password was updated, but sign-in didn't finish. Sign in with your new password.",
      );
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
      const { error } = await signIn.resetPasswordEmailCode.sendCode();

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

  const handleSubmit = () => {
    if (step === "request") return handleRequest();
    if (step === "verify") return handleVerify();
    return handlePasswordSubmit();
  };

  return (
    <AuthScreen>
      <AuthBackLink label={backLabel} onPress={handleBack} />
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

          {step === "request" ? (
            <AuthField
              label="Email"
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                setFieldErrors((current) => ({ ...current, email: null }));
                if (formError) setFormError(null);
              }}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              inputMode="email"
              returnKeyType="go"
              onSubmitEditing={handleSubmit}
              error={fieldErrors.email}
              editable={!isSubmitting}
            />
          ) : null}

          {step === "verify" ? (
            <>
              <AuthField
                label="6-digit code"
                value={code}
                onChangeText={(value) => {
                  setCode(value.replace(/\D/g, "").slice(0, CODE_LENGTH));
                  setFieldErrors((current) => ({ ...current, code: null }));
                  if (formError) setFormError(null);
                  if (notice) setNotice(null);
                }}
                placeholder="000000"
                keyboardType="number-pad"
                inputMode="numeric"
                autoComplete="one-time-code"
                textContentType="oneTimeCode"
                maxLength={CODE_LENGTH}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
                inputClassName="auth-input-code"
                error={fieldErrors.code}
                editable={!isSubmitting}
              />
            </>
          ) : null}

          {step === "password" ? (
            <>
              <AuthField
                label="New password"
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                  setFieldErrors((current) => ({
                    ...current,
                    password: null,
                    confirm: null,
                  }));
                  if (formError) setFormError(null);
                }}
                placeholder="At least 15 characters"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="new-password"
                textContentType="newPassword"
                passwordRules={`minlength: ${PASSWORD_MIN_LENGTH};`}
                returnKeyType="next"
                onSubmitEditing={() => confirmRef.current?.focus()}
                autoFocus
                error={fieldErrors.password}
                helper={`At least ${PASSWORD_MIN_LENGTH} characters.`}
                helperSuccess={password.length >= PASSWORD_MIN_LENGTH}
                editable={!isSubmitting}
                actionLabel={showPassword ? "Hide" : "Show"}
                onActionPress={() =>
                  setShowPassword((current) => !current)
                }
              />

              <AuthField
                label="Confirm new password"
                value={confirmPassword}
                onChangeText={(value) => {
                  setConfirmPassword(value);
                  setFieldErrors((current) => ({
                    ...current,
                    confirm: null,
                  }));
                  if (formError) setFormError(null);
                }}
                placeholder="Re-enter your new password"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="new-password"
                textContentType="newPassword"
                passwordRules={`minlength: ${PASSWORD_MIN_LENGTH};`}
                returnKeyType="go"
                onSubmitEditing={handleSubmit}
                inputRef={confirmRef}
                error={fieldErrors.confirm}
                editable={!isSubmitting}
                actionLabel={showConfirmPassword ? "Hide" : "Show"}
                onActionPress={() =>
                  setShowConfirmPassword((current) => !current)
                }
              />

              <Text className="auth-trust">
                Updating your password signs you out on other devices.
              </Text>
            </>
          ) : null}

          <AuthSubmitButton
            label={buttonLabel}
            loadingLabel={loadingLabel}
            loading={isSubmitting}
            onPress={() => {
              void handleSubmit();
            }}
          />

          {step === "verify" ? (
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
                    (secondsLeft > 0 || isResending) &&
                      "auth-resend-disabled",
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
          ) : null}
        </View>
      </View>

      {step === "request" ? (
        <AuthFooterLink
          copy="Remembered your password?"
          linkLabel="Sign in"
          href={signInHref}
        />
      ) : null}
    </AuthScreen>
  );
};

export default ResetPasswordScreen;
