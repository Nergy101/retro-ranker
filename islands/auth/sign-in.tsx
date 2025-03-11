import { useSignal } from "@preact/signals";
import { PiSignIn, PiUserCheck } from "@preact-icons/pi";

export default function SignIn() {
  const error = useSignal<string | null>(null);

  return (
    <div class="auth-form">
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
        <PiUserCheck /> Sign In
      </h1>

      {error.value && (
        <div class="auth-form-error" role="alert">
          {error.value}
        </div>
      )}

      <form
        method="POST"
        action="/api/auth/sign-in"
      >
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
          />
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
          />
        </div>

        <button
          type="submit"
          class="bg-rr-primary"
          style={{
            marginTop: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          <PiSignIn /> Sign In
        </button>
      </form>

      <div class="auth-form-footer">
        <a href="/auth/sign-up">
          Don't have an account? Sign up
        </a>
      </div>
    </div>
  );
}
