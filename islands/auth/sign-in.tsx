import {
  PiDiscordLogo,
  PiGoogleLogo,
  PiPassword,
  PiSignIn,
  PiUser,
} from "@preact-icons/pi";
import { useEffect } from "preact/hooks";

export function SignIn(
  { error, pleaseWait }: { error: string | null; pleaseWait: boolean },
) {
  useEffect(() => {
    const checkAuth = () => {
      console.log("Checking auth");
      console.log(document.cookie);
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
          gap: "0.5rem",
          justifyContent: "center",
          textAlign: "center",
          marginBottom: "1.25rem",
        }}
      >
        <img
          src="/images/rr-star.png"
          alt="Retro Ranker"
          class="hero-sign-in-image"
          style={{
            transform: "scaleX(-1)",
          }}
        />Log In
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
              >
                <PiDiscordLogo size={32} />
              </a>
              <a
                href="/api/auth/google"
                role="button"
                class="auth-signin-btn auth-signin-btn--google"
                aria-label="Log in with Google"
                data-tooltip="Log in with Google"
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
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.5rem",
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
              marginBottom: "0.5rem",
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
          data-tooltip="Log in"
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
        {pleaseWait && (
          <a
            href="/auth/sign-up"
            role="button"
            class="outline"
          >
            Don't have an account? <br /> Sign up now!
          </a>
        )}
      </div>
    </article>
  );
}
