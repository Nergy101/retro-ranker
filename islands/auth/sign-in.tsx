import {
  PiDiscordLogo,
  PiGoogleLogo,
  PiPassword,
  PiSignIn,
  PiUser,
} from "@preact-icons/pi";
import { useEffect } from "preact/hooks";
import { TranslationPipe } from "@data/frontend/services/i18n/i18n.service.ts";

export function SignIn(
  { error, pleaseWait, csrfToken, translations }: {
    error: string | null;
    pleaseWait: boolean;
    csrfToken: string;
    translations: Record<string, string>;
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
      TranslationPipe(translations, "auth.pressStart"),
      TranslationPipe(translations, "auth.insertCartridge"),
      TranslationPipe(translations, "auth.bootUp"),
      TranslationPipe(translations, "auth.loadSave"),
      TranslationPipe(translations, "auth.continueGame"),
      TranslationPipe(translations, "auth.joinParty"),
      TranslationPipe(translations, "auth.enterDungeon"),
      TranslationPipe(translations, "auth.linkUp"),
      TranslationPipe(translations, "auth.powerOn"),
      TranslationPipe(translations, "auth.selectPlayer"),
      TranslationPipe(translations, "auth.unlockConsole"),
      TranslationPipe(translations, "auth.konamiCode"),
    ];
    return texts[Math.floor(Math.random() * texts.length)];
  };

  const getLoggingInText = () => {
    const texts = [
      TranslationPipe(translations, "auth.pressingStart"),
      TranslationPipe(translations, "auth.insertingCartridge"),
      TranslationPipe(translations, "auth.bootingUp"),
      TranslationPipe(translations, "auth.loadingSave"),
      TranslationPipe(translations, "auth.continuingGame"),
      TranslationPipe(translations, "auth.joiningParty"),
      TranslationPipe(translations, "auth.enteringDungeon"),
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
        />
        {TranslationPipe(translations, "auth.logIn")}
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
                aria-label={TranslationPipe(
                  translations,
                  "auth.logInWithDiscord",
                )}
                data-tooltip={TranslationPipe(
                  translations,
                  "auth.logInWithDiscord",
                )}
              >
                <PiDiscordLogo size={32} />
              </a>
              <a
                href="/api/auth/google"
                role="button"
                class="auth-signin-btn auth-signin-btn--google"
                aria-label={TranslationPipe(
                  translations,
                  "auth.logInWithGoogle",
                )}
                data-tooltip={TranslationPipe(
                  translations,
                  "auth.logInWithGoogle",
                )}
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
              marginBottom: "0.5rem",
            }}
          >
            <PiUser /> {TranslationPipe(translations, "auth.nickname")}
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
            <PiPassword /> {TranslationPipe(translations, "auth.password")}
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
          data-tooltip={TranslationPipe(translations, "auth.logIn")}
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
          {TranslationPipe(translations, "auth.invalidCredentials")}
        </div>
      )}
      <div class="auth-form-footer">
        {pleaseWait && (
          <a
            href="/auth/sign-up"
            role="button"
            class="outline"
          >
            {TranslationPipe(translations, "auth.noAccount")} <br />{" "}
            {TranslationPipe(translations, "auth.signUpNow")}
          </a>
        )}
      </div>
    </article>
  );
}
