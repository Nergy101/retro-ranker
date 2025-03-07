import { useSignal } from "@preact/signals";
export default function SignUp() {
  const error = useSignal<string | null>(null);

  // Track both validation state and whether field has been touched
  const nicknameTouched = useSignal<boolean>(false);
  const emailTouched = useSignal<boolean>(false);
  const passwordTouched = useSignal<boolean>(false);
  const confirmPasswordTouched = useSignal<boolean>(false);

  const nicknameValid = useSignal<boolean | null>(null);
  const emailValid = useSignal<boolean | null>(null);
  const passwordValid = useSignal<boolean | null>(null);
  const confirmPasswordValid = useSignal<boolean | null>(null);

  const validateNickname = (e: Event) => {
    const input = e.target as HTMLInputElement;
    nicknameTouched.value = true;

    // Reset validation state if field is empty
    if (!input.value.trim()) {
      nicknameValid.value = null;
      return;
    }

    nicknameValid.value = input.value.trim().length >= 3;
  };

  const validateEmail = (e: Event) => {
    const input = e.target as HTMLInputElement;
    emailTouched.value = true;

    // Reset validation state if field is empty
    if (!input.value.trim()) {
      emailValid.value = null;
      return;
    }

    emailValid.value = input.validity.valid;
  };

  const validatePassword = (e: Event) => {
    const input = e.target as HTMLInputElement;
    passwordTouched.value = true;

    // Reset validation state if field is empty
    if (!input.value) {
      passwordValid.value = null;
      return;
    }

    passwordValid.value = input.value.length >= 8;

    // Only validate confirm password if it's been touched and has a value
    if (confirmPasswordTouched.value) {
      const confirmInput = document.getElementById(
        "confirmPassword",
      ) as HTMLInputElement;

      if (!confirmInput.value) {
        confirmPasswordValid.value = null;
      } else {
        confirmPasswordValid.value = confirmInput.value.length >= 8 &&
          confirmInput.value === input.value;
      }
    }
  };

  const validateConfirmPassword = (e: Event) => {
    const input = e.target as HTMLInputElement;
    confirmPasswordTouched.value = true;

    // Reset validation state if field is empty
    if (!input.value) {
      confirmPasswordValid.value = null;
      return;
    }

    const passwordInput = document.getElementById(
      "password",
    ) as HTMLInputElement;
    const passwordsMatch = input.value === passwordInput.value;
    confirmPasswordValid.value = input.value.length >= 8 && passwordsMatch;
  };

  // Handle input changes to reset validation when field is emptied
  const handleInputChange = (e: Event, validateFn: (e: Event) => void) => {
    const input = e.target as HTMLInputElement;

    // If the field is empty and has been touched, reset its validation state
    if (!input.value.trim()) {
      validateFn(e);
    } else {
      // Otherwise, validate normally
      validateFn(e);
    }
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    // Mark all fields as touched
    nicknameTouched.value = true;
    emailTouched.value = true;
    passwordTouched.value = true;
    confirmPasswordTouched.value = true;

    // Validate all fields
    const nicknameInput = document.getElementById(
      "nickname",
    ) as HTMLInputElement;
    const emailInput = document.getElementById("email") as HTMLInputElement;
    const passwordInput = document.getElementById(
      "password",
    ) as HTMLInputElement;
    const confirmInput = document.getElementById(
      "confirmPassword",
    ) as HTMLInputElement;

    // Reset validation for empty fields
    nicknameValid.value = nicknameInput.value.trim()
      ? nicknameInput.value.trim().length >= 3
      : null;
    emailValid.value = emailInput.value.trim()
      ? emailInput.validity.valid
      : null;
    passwordValid.value = passwordInput.value
      ? passwordInput.value.length >= 8
      : null;

    if (confirmInput.value) {
      confirmPasswordValid.value = confirmInput.value.length >= 8 &&
        confirmInput.value === passwordInput.value;
    } else {
      confirmPasswordValid.value = null;
    }

    // Check if any fields are invalid (false) or empty (null)
    const hasInvalidFields = nicknameValid.value === false ||
      emailValid.value === false ||
      passwordValid.value === false ||
      confirmPasswordValid.value === false;

    const hasEmptyRequiredFields = nicknameValid.value === null ||
      emailValid.value === null ||
      passwordValid.value === null ||
      confirmPasswordValid.value === null;

    if (hasInvalidFields || hasEmptyRequiredFields) {
      error.value = "Please fill in all required fields correctly";
    } else {
      (e.target as HTMLFormElement).submit();
    }
  };

  // Helper function to determine aria-invalid state
  const getAriaInvalid = (
    touched: boolean,
    valid: boolean | null,
  ): boolean | undefined => {
    if (!touched || valid === null) return undefined; // Field not touched or empty, no aria-invalid
    return valid === false ? true : false;
  };

  return (
    <div
      style={{ maxWidth: "25rem", margin: "2.5rem auto", padding: "1.25rem" }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "1.25rem" }}>Sign Up</h1>

      {error.value && (
        <div
          role="alert"
          style={{
            backgroundColor: "#ffebee",
            color: "#c62828",
            padding: "0.625rem",
            marginBottom: "1.25rem",
            borderRadius: "0.25rem",
          }}
        >
          {error.value}
        </div>
      )}

      <form
        method="POST"
        action="/api/auth/sign-up"
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        onSubmit={handleSubmit}
      >
        <div>
          <label
            for="nickname"
            style={{ display: "block", marginBottom: "0.5rem" }}
          >
            Nickname
          </label>
          <input
            id="nickname"
            name="nickname"
            type="text"
            required
            aria-required="true"
            aria-invalid={getAriaInvalid(
              nicknameTouched.value,
              nicknameValid.value,
            )}
            onBlur={validateNickname}
            onChange={(e) => handleInputChange(e, validateNickname)}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: `0.0625rem solid ${
                !nicknameTouched.value || nicknameValid.value !== false
                  ? "#ccc"
                  : "#c62828"
              }`,
              borderRadius: "0.25rem",
            }}
          />
          {nicknameTouched.value && nicknameValid.value === false && (
            <div
              role="alert"
              style={{
                color: "#c62828",
                fontSize: "1rem",
                marginTop: "0.5rem",
              }}
            >
              Nickname must be at least 3 characters
            </div>
          )}
        </div>

        <div>
          <label
            for="email"
            style={{ display: "block", marginBottom: "0.5rem" }}
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            aria-required="true"
            aria-invalid={getAriaInvalid(emailTouched.value, emailValid.value)}
            onBlur={validateEmail}
            onChange={(e) => handleInputChange(e, validateEmail)}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: `0.0625rem solid ${
                !emailTouched.value || emailValid.value !== false
                  ? "#ccc"
                  : "#c62828"
              }`,
              borderRadius: "0.25rem",
            }}
          />
          {emailTouched.value && emailValid.value === false && (
            <div
              role="alert"
              style={{
                color: "#c62828",
                fontSize: "0.875rem",
                marginTop: "0.3125rem",
              }}
            >
              Please enter a valid email address
            </div>
          )}
        </div>

        <div>
          <label
            for="password"
            style={{ display: "block", marginBottom: "0.5rem" }}
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            aria-required="true"
            aria-invalid={getAriaInvalid(
              passwordTouched.value,
              passwordValid.value,
            )}
            onBlur={validatePassword}
            onChange={(e) => handleInputChange(e, validatePassword)}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: `0.0625rem solid ${
                !passwordTouched.value || passwordValid.value !== false
                  ? "#ccc"
                  : "#c62828"
              }`,
              borderRadius: "0.25rem",
            }}
          />
          {passwordTouched.value && passwordValid.value === false && (
            <div
              role="alert"
              style={{
                color: "#c62828",
                fontSize: "0.875rem",
                marginTop: "0.3125rem",
              }}
            >
              Password must be at least 8 characters
            </div>
          )}
        </div>

        <div>
          <label
            for="confirmPassword"
            style={{ display: "block", marginBottom: "0.5rem" }}
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            aria-required="true"
            aria-invalid={getAriaInvalid(
              confirmPasswordTouched.value,
              confirmPasswordValid.value,
            )}
            onBlur={validateConfirmPassword}
            onChange={(e) => handleInputChange(e, validateConfirmPassword)}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: `0.0625rem solid ${
                !confirmPasswordTouched.value ||
                  confirmPasswordValid.value !== false
                  ? "#ccc"
                  : "#c62828"
              }`,
              borderRadius: "0.25rem",
            }}
          />
          {confirmPasswordTouched.value &&
            confirmPasswordValid.value === false && (
            <div
              role="alert"
              style={{
                color: "#c62828",
                fontSize: "0.875rem",
                marginTop: "0.3125rem",
              }}
            >
              {document.getElementById("confirmPassword")?.nodeValue ===
                  document.getElementById("password")?.nodeValue
                ? "Password must be at least 8 characters"
                : "Passwords do not match"}
            </div>
          )}
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: "#4caf50",
            color: "white",
            padding: "0.625rem",
            border: "none",
            borderRadius: "0.25rem",
            cursor: "pointer",
            marginTop: "0.625rem",
          }}
        >
          Sign Up
        </button>
      </form>

      <div style={{ textAlign: "center", marginTop: "1.25rem" }}>
        <a
          href="/auth/sign-in"
          style={{ textDecoration: "none" }}
        >
          Already have an account? Sign in
        </a>
      </div>
    </div>
  );
}
