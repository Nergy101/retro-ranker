import { PiDiscordLogo, PiGoogleLogo, PiUserPlus } from "@preact-icons/pi";

export function SignUp({
  baseApiUrl: _baseApiUrl,
  csrfToken: _csrfToken,
}: {
  baseApiUrl: string;
  csrfToken: string;
}) {
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
        <PiUserPlus /> Sign Up
      </h1>

      <div
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          color: "var(--muted-color)",
        }}
      >
        <p>Join Retro Ranker using your existing account</p>
      </div>

      <div class="auth-signin-btn-row">
        <a
          href="/api/auth/discord"
          role="button"
          class="auth-signin-btn auth-signin-btn--discord"
          aria-label="Sign up with Discord"
          data-tooltip="Sign up with Discord"
        >
          <PiDiscordLogo size={32} />
        </a>
        <a
          href="/api/auth/google"
          role="button"
          class="auth-signin-btn auth-signin-btn--google"
          aria-label="Sign up with Google"
          data-tooltip="Sign up with Google"
        >
          <PiGoogleLogo size={32} />
        </a>
      </div>

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
          Already have an account? <br /> Log in instead
        </a>
      </div>
    </div>
  );
}
