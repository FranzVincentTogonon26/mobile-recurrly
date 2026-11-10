import AuthAlert from "@/components/auth/AuthAlert";
import AuthBrand from "@/components/auth/AuthBrand";
import AuthField from "@/components/auth/AuthField";
import AuthFooterLink from "@/components/auth/AuthFooterLink";
import AuthScreen from "@/components/auth/AuthScreen";
import AuthSubmitButton from "@/components/auth/AuthSubmitButton";
import {
  PASSWORD_MIN_LENGTH,
  mapAuthErrorToForm,
  parseAuthError,
  validateEmail,
  validateNewPassword,
  type AuthFieldErrors,
} from "@/lib/auth";
import { useSignUp } from "@clerk/expo";
import { useLocalSearchParams, useRouter, type Href } from "expo-router";
import { useRef, useState } from "react";
import { Text, type TextInputInstance, View } from "react-native";

const SignUpScreen = () => {
  const router = useRouter();
  const { email: emailParam } = useLocalSearchParams<{ email?: string }>();
  const { signUp } = useSignUp();

  const passwordRef = useRef<TextInputInstance>(null);
  const emailRef = useRef<TextInputInstance>(null);

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState(
    typeof emailParam === "string" ? emailParam : "",
  );
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const signInHref: Href = email.trim()
    ? { pathname: "/sign-in", params: { email: email.trim() } }
    : "/sign-in";

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const nextErrors: AuthFieldErrors = {
      email: validateEmail(email),
      password: validateNewPassword(password),
    };

    setFieldErrors(nextErrors);
    setFormError(null);

    if (nextErrors.email || nextErrors.password) return;

    setIsSubmitting(true);

    try {
      const { error } = await signUp.password({
        emailAddress: email.trim(),
        password,
        ...(firstName.trim() ? { firstName: firstName.trim() } : {}),
      });

      if (error) {
        const mapped = mapAuthErrorToForm(error);
        setFieldErrors(mapped);
        if (mapped.form) setFormError(mapped.form);
        return;
      }

      if (signUp.status === "complete") {
        const { error: finalizeError } = await signUp.finalize();

        if (finalizeError) {
          setFormError(parseAuthError(finalizeError).message);
          return;
        }

        router.replace("/");
        return;
      }

      if (signUp.status !== "missing_requirements") {
        setFormError("We couldn't start your account. Please try again.");
        return;
      }

      const { error: sendError } = await signUp.verifications.sendEmailCode();

      if (sendError) {
        setFormError(
          parseAuthError(
            sendError,
            "We couldn't send your verification code. Try again.",
          ).message,
        );
        return;
      }

      router.push({
        pathname: "/verify-email",
        params: { mode: "sign-up", email: email.trim() },
      });
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
            Create your account
          </Text>
          <Text className="auth-subtitle">
            One calm place for every subscription you pay for.
          </Text>
        </View>

        <View className="auth-form">
          {formError ? <AuthAlert message={formError} /> : null}

          <AuthField
            label="First name (optional)"
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Franz"
            autoCapitalize="words"
            autoComplete="given-name"
            textContentType="givenName"
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
            editable={!isSubmitting}
          />

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
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            inputRef={emailRef}
            error={fieldErrors.email}
            editable={!isSubmitting}
          />

          <AuthField
            label="Password"
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              setFieldErrors((current) => ({ ...current, password: null }));
              if (formError) setFormError(null);
            }}
            placeholder="At least 15 characters"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="new-password"
            textContentType="newPassword"
            passwordRules={`minlength: ${PASSWORD_MIN_LENGTH};`}
            returnKeyType="go"
            onSubmitEditing={handleSubmit}
            inputRef={passwordRef}
            error={fieldErrors.password}
            helper={`At least ${PASSWORD_MIN_LENGTH} characters. A phrase you'll remember works well.`}
            helperSuccess={password.length >= PASSWORD_MIN_LENGTH}
            editable={!isSubmitting}
            actionLabel={showPassword ? "Hide" : "Show"}
            onActionPress={() => setShowPassword((current) => !current)}
          />

          <AuthSubmitButton
            label="Create account"
            loadingLabel="Creating account…"
            loading={isSubmitting}
            onPress={() => {
              void handleSubmit();
            }}
          />

          <Text className="auth-trust">
            No card required. Set up in under a minute.
          </Text>
        </View>
      </View>

      <AuthFooterLink
        copy="Already have an account?"
        linkLabel="Sign in"
        href={signInHref}
      />
    </AuthScreen>
  );
};

export default SignUpScreen;
