import AuthAlert from "@/components/auth/AuthAlert";
import AuthBrand from "@/components/auth/AuthBrand";
import AuthField from "@/components/auth/AuthField";
import AuthFooterLink from "@/components/auth/AuthFooterLink";
import AuthScreen from "@/components/auth/AuthScreen";
import AuthSubmitButton from "@/components/auth/AuthSubmitButton";
import {
  mapAuthErrorToForm,
  parseAuthError,
  validateEmail,
  validateRequiredPassword,
  type AuthFieldErrors,
} from "@/lib/auth";
import { useSignIn } from "@clerk/expo";
import { useLocalSearchParams, useRouter, type Href } from "expo-router";
import { useRef, useState } from "react";
import { Text, type TextInputInstance, View } from "react-native";

const SignInScreen = () => {
  const router = useRouter();
  const { email: emailParam } = useLocalSearchParams<{ email?: string }>();
  const { signIn } = useSignIn();

  const passwordRef = useRef<TextInputInstance>(null);

  const [email, setEmail] = useState(
    typeof emailParam === "string" ? emailParam : "",
  );
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const signUpHref: Href = email.trim()
    ? { pathname: "/sign-up", params: { email: email.trim() } }
    : "/sign-up";

  const resetHref: Href = email.trim()
    ? { pathname: "/reset-password", params: { email: email.trim() } }
    : "/reset-password";

  const clearFieldError = (field: keyof AuthFieldErrors) => {
    setFieldErrors((current) => ({ ...current, [field]: null }));
    if (formError) setFormError(null);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const nextErrors: AuthFieldErrors = {
      email: validateEmail(email),
      password: validateRequiredPassword(password),
    };

    setFieldErrors(nextErrors);
    setFormError(null);

    if (nextErrors.email || nextErrors.password) return;

    setIsSubmitting(true);

    try {
      const { error } = await signIn.password({
        identifier: email.trim(),
        password,
      });

      if (error) {
        const mapped = mapAuthErrorToForm(error);
        setFieldErrors(mapped);
        if (mapped.form) setFormError(mapped.form);
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
            "This account needs a different verification method. Try again or reset your password.",
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

      if (signIn.status === "needs_new_password") {
        setFormError(
          "You need to choose a new password. Use “Forgot password?” below to continue.",
        );
        return;
      }

      setFormError("We couldn't finish signing you in. Please try again.");
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

  return (
    <AuthScreen>
      <AuthBrand />

      <View className="auth-card">
        <View className="auth-card-header">
          <Text accessibilityRole="header" className="auth-title">
            Welcome back
          </Text>
          <Text className="auth-subtitle">
            Sign in to see what’s renewing next.
          </Text>
        </View>

        <View className="auth-form">
          {formError ? <AuthAlert message={formError} /> : null}

          <AuthField
            label="Email"
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              clearFieldError("email");
            }}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            inputMode="email"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            error={fieldErrors.email}
            editable={!isSubmitting}
          />

          <AuthField
            label="Password"
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              clearFieldError("password");
            }}
            placeholder="Your password"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="current-password"
            textContentType="password"
            returnKeyType="go"
            onSubmitEditing={handleSubmit}
            inputRef={passwordRef}
            error={fieldErrors.password}
            editable={!isSubmitting}
            labelAction={{
              label: "Forgot password?",
              onPress: () => router.push(resetHref),
            }}
            actionLabel={showPassword ? "Hide" : "Show"}
            onActionPress={() => setShowPassword((current) => !current)}
          />

          <AuthSubmitButton
            label="Sign in"
            loadingLabel="Signing in…"
            loading={isSubmitting}
            onPress={() => {
              void handleSubmit();
            }}
          />

          <Text className="auth-trust">
            Your details are encrypted and never shared.
          </Text>
        </View>
      </View>

      <AuthFooterLink
        copy="New to Recurrly?"
        linkLabel="Create an account"
        href={signUpHref}
      />
    </AuthScreen>
  );
};

export default SignInScreen;
