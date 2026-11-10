export const PASSWORD_MIN_LENGTH = 15;
export const CODE_LENGTH = 6;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export interface AuthFieldErrors {
  email?: string | null;
  password?: string | null;
  confirm?: string | null;
  code?: string | null;
  form?: string | null;
}

export function validateEmail(value: string): string | null {
  const email = value.trim();

  if (!email) return "Enter your email address.";
  if (!EMAIL_PATTERN.test(email)) {
    return "Enter a valid email address, like you@example.com.";
  }

  return null;
}

export function validateRequiredPassword(value: string): string | null {
  if (!value) return "Enter your password.";
  return null;
}

export function validateNewPassword(value: string): string | null {
  if (!value) return "Choose a password.";
  if (value.length < PASSWORD_MIN_LENGTH) {
    return `Use at least ${PASSWORD_MIN_LENGTH} characters.`;
  }

  return null;
}

export function validateCode(value: string): string | null {
  const code = value.trim();

  if (!code) return "Enter the 6-digit code.";
  if (!new RegExp(`^\\d{${CODE_LENGTH}}$`).test(code)) {
    return "That code doesn't look right. Enter the 6 digits from your email.";
  }

  return null;
}

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  form_identifier_not_found:
    "We couldn't find an account with that email. Check it, or create an account.",
  form_password_incorrect:
    "That password doesn't match this account. Try again or reset it.",
  form_identifier_exists: "That email is already registered. Sign in instead.",
  form_password_length_too_short: `Use at least ${PASSWORD_MIN_LENGTH} characters.`,
  form_password_validation_failed:
    "That password doesn't meet the requirements. Try a longer one.",
  form_password_pwned:
    "That password has appeared in a data breach. Choose a different one.",
  form_password_not_strong_enough:
    "Choose a stronger password. A longer phrase you'll remember works well.",
  form_password_size_in_bytes_exceeded:
    "That password is too long. Try a shorter one.",
  form_param_format_invalid:
    "Some of those details don't look right. Check them and try again.",
  form_param_nil: "Fill in all required fields and try again.",
  form_code_incorrect: "That code isn't right. Check the email and try again.",
  form_code_expired: "That code has expired. Send a new one.",
  verification_expired: "That verification expired. Send a new code.",
  verification_failed: "We couldn't verify that code. Try again.",
  client_trust_verification_failed:
    "We couldn't verify this device. Start again to get a fresh code.",
  too_many_requests: "Too many attempts. Wait a minute, then try again.",
  captcha_invalid: "We couldn't verify this request. Please try again.",
  captcha_unavailable:
    "Verification is temporarily unavailable. Try again in a moment.",
  user_locked:
    "This account is temporarily locked. Try again later or reset your password.",
  session_exists: "You're already signed in on this device.",
  not_allowed_access:
    "This account can't sign in right now. Contact support if this keeps happening.",
  email_address_invalid: "Enter a valid email address.",
  email_address_exists: "That email is already registered. Sign in instead.",
  password_compromised:
    "That password has appeared in a data breach. Choose a different one.",
  sign_in_flow_mismatch: "That sign-in session expired. Start again.",
};

interface RawAuthError {
  code?: unknown;
  meta?: unknown;
  errors?: unknown;
}

export interface ParsedAuthError {
  code: string | null;
  field: string | null;
  message: string;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== "object" || value === null) return null;
  return value as Record<string, unknown>;
}

function pickString(...values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) return value;
  }

  return null;
}

function inferField(code: string | null): string | null {
  if (!code) return null;
  if (/identifier|email/.test(code)) return "email";
  if (/password/.test(code)) return "password";
  if (/code|verification/.test(code)) return "code";

  return null;
}

export function parseAuthError(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): ParsedAuthError {
  const root = asRecord(error) as RawAuthError | null;
  const errors = root && Array.isArray(root.errors) ? root.errors : [];
  const primary = asRecord(errors[0]) ?? root;
  const code = pickString(primary?.code, root?.code);
  const meta = asRecord(primary?.meta) ?? asRecord(root?.meta);
  const fieldName = pickString(meta?.paramName, meta?.param_name);
  const field = fieldName ?? inferField(code);
  const message =
    (code ? AUTH_ERROR_MESSAGES[code] : undefined) ?? fallback;

  return { code, field, message };
}

export function mapAuthErrorToForm(
  error: unknown,
  fallback?: string,
): AuthFieldErrors {
  const { field, message } = parseAuthError(error, fallback);

  switch (field) {
    case "email":
    case "email_address":
    case "emailAddress":
    case "identifier":
      return { email: message };
    case "password":
      return { password: message };
    case "code":
    case "otp_code":
      return { code: message };
    default:
      return { form: message };
  }
}
