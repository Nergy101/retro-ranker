import {
  PiDiscordLogo,
  PiGoogleLogo,
  PiSignIn,
  PiUserCheck,
} from "@preact-icons/pi";
import { useEffect } from "preact/hooks";

export default function SignIn(
  { error, pleaseWait }: { error: string | null; pleaseWait: boolean },
) {
  useEffect(() => {
    const checkAuth = () => {
      // Simple cookie parser
      const cookies = document.cookie.split(";").reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);

      if (cookies["pb_auth"] && cookies["pb_auth"].length > 0) {
        clearInterval(interval);

        // simulate click to /profile
        const profileLink = document.createElement("a");
        profileLink.href = "/profile";
        profileLink.click();
      }
    };
    const interval = setInterval(checkAuth, 500);
    return () => clearInterval(interval);
  }, []);

  const getSignInText = () => {
    const texts = [
      "Press Start",
      "Insert Cartridge",
      "Boot Up",
      "Load Save",
      "Continue Game",
      "Join the Party",
      "Enter the Dungeon",
      "Link Up",
      "Power On",
      "Select Player",
      "Unlock Console",
      "UpUpDownDownLeftRightLeftRightBA",
    ];
    return texts[Math.floor(Math.random() * texts.length)];
  };

  return (
    <article class="auth-form">
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
        <PiUserCheck /> Sign in
      </h1>
      <div>
        {pleaseWait
          ? (
            <article
              class="auth-form-wait"
              aria-busy="true"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                textAlign: "center",
                width: "100%",
                height: "100%",
                border: "1px solid var(--pico-primary)",
                borderRadius: "var(--pico-border-radius)",
                boxShadow: "0 0 1rem 0 var(--pico-primary)",
              }}
            >
              <PiDiscordLogo /> Logging in...
            </article>
          )
          : (
            <div class="auth-signin-btn-row">
              <a
                href="/api/auth/discord"
                role="button"
                class="auth-signin-btn auth-signin-btn--discord"
                aria-label="Sign in with Discord"
                data-tooltip="Sign in with Discord"
              >
                <PiDiscordLogo size={32} />
              </a>
              <a
                href="/api/auth/google"
                role="button"
                class="auth-signin-btn auth-signin-btn--google"
                aria-label="Sign in with Google"
                data-tooltip="Sign in with Google"
              >
                <PiGoogleLogo size={32} />
              </a>
            </div>
          )}
      </div>
      <form
        method="POST"
        action="/api/auth/sign-in"
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
            disabled={pleaseWait}
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
            disabled={pleaseWait}
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
            border: "none",
          }}
          disabled={pleaseWait}
          data-tooltip="Sign in"
        >
          <PiSignIn />{" "}
          <span
            style={{ color: "var(--pico-color)" }}
          >
            {getSignInText()}
          </span>
        </button>
      </form>
      {error && (
        <div class="auth-form-error" role="alert">
          Invalid nickname and password combination
        </div>
      )}
      <div class="auth-form-footer">
        <a
          href="/auth/sign-up"
          role="button"
          class="outline"
          disabled={pleaseWait}
        >
          Don't have an account? <br /> Sign up now!
        </a>
      </div>
    </article>
  );
}
