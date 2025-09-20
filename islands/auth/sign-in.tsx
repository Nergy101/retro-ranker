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
            <div>
              <h2 style={{ textAlign: "center" }}>Continue with</h2>
              <div class="auth-signin-btn-row">
                <a
                  href="/api/auth/discord"
                  role="button"
                  class="auth-signin-btn auth-signin-btn--discord"
                  aria-label="Continue with Discord"
                  data-tooltip="Continue with Discord"
                  data-placement="left"
                >
                  <PiDiscordLogo size={32} />
                </a>
                <a
                  href="/api/auth/google"
                  role="button"
                  class="auth-signin-btn auth-signin-btn--google"
                  aria-label="Continue with Google"
                  data-tooltip="Continue with Google"
                  data-placement="right"
                >
                  <PiGoogleLogo size={32} />
                </a>
              </div>
            </div>
          )}
      </div>
    </article>
  );
}
