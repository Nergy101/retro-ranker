import {
  PiDiscordLogo,
  PiGoogleLogo,
  PiPassword,
  PiSignIn,
  PiUser,
} from "@preact-icons/pi";
import { useEffect } from "preact/hooks";

export function SignIn(
  { error, pleaseWait, csrfToken }: {
    error: string | null;
    pleaseWait: boolean;
    csrfToken: string;
  },
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
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  });

  const getSignInText = () => {
    const texts = [
      "Press Start",
      "Insert Cartridge",
      "Boot Up",
      "Load Save",
      "Continue Game",
      "Join Party",
      "Enter Dungeon",
      "Link Up",
      "Power On",
      "Select Player",
      "Unlock Console",
      "Konami Code",
    ];
    return texts[Math.floor(Math.random() * texts.length)];
  };

  const getLoggingInText = () => {
    const texts = [
      "Pressing Start",
      "Inserting Cartridge",
      "Booting Up",
      "Loading Save",
      "Continuing Game",
      "Joining Party",
      "Entering Dungeon",
    ];
    return texts[Math.floor(Math.random() * texts.length)];
  };

  return (
    <article class="auth-form">
      <h1
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          margin: 0,
          padding: 0,
        }}
      >
        <img
          src="/images/rr-star.png"
          alt="Retro Ranker"
          class="hero-sign-in-image"
          style={{
            transform: "scaleX(-1)",
          }}
        />
        Log In
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
              <PiDiscordLogo /> {getLoggingInText()}...
            </article>
          )
          : (
            <div class="auth-signin-btn-row">
              <a
                href="/api/auth/discord"
                role="button"
                class="auth-signin-btn auth-signin-btn--discord"
                aria-label="Log in with Discord"
                data-tooltip="Log in with Discord"
                data-placement="left"
              >
                <PiDiscordLogo size={32} />
              </a>
              <a
                href="/api/auth/google"
                role="button"
                class="auth-signin-btn auth-signin-btn--google"
                aria-label="Log in with Google"
                data-tooltip="Log in with Google"
                data-placement="right"
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
        <input type="hidden" name="csrf_token" value={csrfToken} />
        <div>
          <label
            for="nickname"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <PiUser /> Nickname
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
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <PiPassword /> Password
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
          class="primary"
          style={{
            margin: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}
          disabled={pleaseWait}
          data-tooltip="Log In"
        >
          <PiSignIn /> {getSignInText()}
        </button>
      </form>
      {error && (
        <div class="auth-form-error" role="alert">
          Invalid credentials
        </div>
      )}
      <div class="auth-form-footer">
        {!pleaseWait && (
          <a
            href="/auth/sign-up"
            role="button"
            class="outline"
          >
            No account? <br /> Sign up now
          </a>
        )}
      </div>
    </article>
  );
}
