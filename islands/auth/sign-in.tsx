import {
  PiDiscordLogo,
  PiSignIn,
  PiUserCheck
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

  return (
    <div class="auth-form">
      {pleaseWait && (
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
          }}
        >
          <PiDiscordLogo /> Logging in...
        </article>
      )}
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
          <PiSignIn /> Sign in
        </button>
      </form>
      {error && (
        <div class="auth-form-error" role="alert">
          Invalid nickname and password combination
        </div>
      )}
      <div>
        <a
          href="/api/auth/discord"
          role="button"
          class="outline"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          <PiDiscordLogo /> Login with Discord
        </a>
      </div>
      <div class="auth-form-footer">
        <a href="/auth/sign-up" role="button" class="outline">
          Don't have an account? <br /> Sign up now!
        </a>
      </div>
    </div>
  );
}
