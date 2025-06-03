import { IS_BROWSER } from "fresh/runtime";
import { PiUser, PiUserPlus } from "@preact-icons/pi";
import { useEffect, useState } from "preact/hooks";

export function SignUp({ baseApiUrl }: { baseApiUrl: string }) {
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Track both validation state and whether field has been touched
  const [nicknameTouched, setNicknameTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  const [nicknameValid, setNicknameValid] = useState<boolean | null>(null);
  const [passwordValid, setPasswordValid] = useState<boolean | null>(null);
  const [confirmPasswordValid, setConfirmPasswordValid] = useState<
    boolean | null
  >(null);
  const [capSolution, setCapSolution] = useState<
    { success: boolean; token: string } | null
  >(
    null,
  );

  // Initialize Cap widget only once when component mounts
  useEffect(() => {
    if (IS_BROWSER && !mounted) {
      setMounted(true);
      import("@cap.js/widget").then(async ({ default: Cap }) => {
        const capInstance = new Cap({
          apiEndpoint: baseApiUrl + "/captcha/",
        });

        setCapSolution(
          await capInstance.solve() as {
            success: boolean;
            token: string;
          },
        );
      });
    }
  });

  const validateNickname = (e: Event) => {
    const input = e.target as HTMLInputElement;
    setNicknameTouched(true);

    // Reset validation state if field is empty
    if (!input.value.trim()) {
      setNicknameValid(null);
      return;
    }

    setNicknameValid(input.value.trim().length >= 3);
  };

  const validatePassword = (e: Event) => {
    const input = e.target as HTMLInputElement;
    setPasswordTouched(true);

    // Reset validation state if field is empty
    if (!input.value) {
      setPasswordValid(null);
      return;
    }

    const isValid = input.value.length >= 8;
    setPasswordValid(isValid);

    // Only validate confirm password if it's been touched and has a value
    if (confirmPasswordTouched) {
      const confirmInput = document.getElementById(
        "confirmPassword",
      ) as HTMLInputElement;

      if (!confirmInput.value) {
        setConfirmPasswordValid(null);
      } else {
        setConfirmPasswordValid(
          confirmInput.value.length >= 8 &&
            confirmInput.value === input.value,
        );
      }
    }
  };

  const validateConfirmPassword = (e: Event) => {
    const input = e.target as HTMLInputElement;
    setConfirmPasswordTouched(true);

    // Reset validation state if field is empty
    if (!input.value) {
      setConfirmPasswordValid(null);
      return;
    }

    const passwordInput = document.getElementById(
      "password",
    ) as HTMLInputElement;
    const isValid = input.value.length >= 8 &&
      input.value === passwordInput.value;
    setConfirmPasswordValid(isValid);
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
    setNicknameTouched(true);
    setPasswordTouched(true);
    setConfirmPasswordTouched(true);

    // Validate all fields
    const nicknameInput = document.getElementById(
      "nickname",
    ) as HTMLInputElement;
    const passwordInput = document.getElementById(
      "password",
    ) as HTMLInputElement;
    const confirmInput = document.getElementById(
      "confirmPassword",
    ) as HTMLInputElement;

    // Reset validation for empty fields
    setNicknameValid(
      nicknameInput.value.trim()
        ? nicknameInput.value.trim().length >= 3
        : null,
    );
    setPasswordValid(
      passwordInput.value ? passwordInput.value.length >= 8 : null,
    );

    if (confirmInput.value) {
      setConfirmPasswordValid(
        confirmInput.value.length >= 8 &&
          confirmInput.value === passwordInput.value,
      );
    } else {
      setConfirmPasswordValid(null);
    }

    // Check if any fields are invalid (false) or empty (null)
    const hasInvalidFields = nicknameValid === false ||
      passwordValid === false ||
      confirmPasswordValid === false;

    const hasEmptyRequiredFields = nicknameValid === null ||
      passwordValid === null ||
      confirmPasswordValid === null;

    if (hasInvalidFields || hasEmptyRequiredFields) {
      setError("Please fill in all required fields correctly");
      return;
    }

    // check if cap was successful
    if (capSolution?.success === false) {
      setError("Please solve the captcha");
      return;
    }

    const form = e.target as HTMLFormElement;

    const hidden = document.createElement("input");
    hidden.type = "hidden";
    hidden.name = "capToken";
    hidden.value = capSolution?.token ?? "";
    form.appendChild(hidden);

    form.submit();
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
      class="auth-form"
      style={{ maxWidth: "25rem", margin: "2.5rem auto", padding: "1.25rem" }}
    >
      <h1
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          justifyContent: "center",
          textAlign: "center",
          marginBottom: "1.25rem",
        }}
      >
        <PiUser /> Sign up
      </h1>

      {error && (
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
          {error}
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
              nicknameTouched,
              nicknameValid,
            )}
            onBlur={validateNickname}
            onChange={(e) => handleInputChange(e, validateNickname)}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: `0.0625rem solid ${
                !nicknameTouched || nicknameValid !== false ? "none" : "#c62828"
              }`,
              borderRadius: "0.25rem",
            }}
          />
          {nicknameTouched && nicknameValid === false && (
            <div
              role="alert"
              style={{
                color: "#c62828",
                fontSize: "1rem",
                marginTop: "0.5rem",
              }}
            >
              Nickname must be at least 3 characters.
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
              passwordTouched,
              passwordValid,
            )}
            onBlur={validatePassword}
            onChange={(e) => handleInputChange(e, validatePassword)}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: `0.0625rem solid ${
                !passwordTouched || passwordValid === null
                  ? "none"
                  : passwordValid === false
                  ? "#c62828"
                  : "#4caf50"
              }`,
              borderRadius: "0.25rem",
            }}
          />
          {passwordTouched && passwordValid === false && (
            <div
              role="alert"
              style={{
                color: "#c62828",
                fontSize: "0.875rem",
                marginTop: "0.3125rem",
              }}
            >
              Password must be at least 8 characters.
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
              confirmPasswordTouched,
              confirmPasswordValid,
            )}
            onBlur={validateConfirmPassword}
            onChange={(e) => handleInputChange(e, validateConfirmPassword)}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: `0.0625rem solid ${
                !confirmPasswordTouched ||
                  confirmPasswordValid === null
                  ? "none"
                  : confirmPasswordValid === false
                  ? "#c62828"
                  : "#4caf50"
              }`,
              borderRadius: "0.25rem",
            }}
          />
          {confirmPasswordTouched &&
            confirmPasswordValid === false && (
            <div
              role="alert"
              style={{
                color: "#c62828",
                fontSize: "0.875rem",
                marginTop: "0.3125rem",
              }}
            >
              {passwordValid === false
                ? "Password must be at least 8 characters."
                : "Passwords do not match."}
            </div>
          )}
        </div>

        <button
          type="submit"
          class="bg-rr-primary"
          style={{
            padding: "0.625rem",
            border: "none",
            borderRadius: "0.25rem",
            cursor: "pointer",
            marginTop: "0.625rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            justifyContent: "center",
          }}
        >
          <PiUserPlus /> Sign up
        </button>
      </form>

      <div
        style={{ textAlign: "center", marginTop: "1.25rem" }}
        class="auth-form-footer"
      >
        <a
          href="/auth/sign-in"
          style={{ textDecoration: "none" }}
          role="button"
          class="outline"
        >
          Already have an account? <br /> Sign in instead.
        </a>
      </div>
    </div>
  );
}
