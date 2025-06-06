import { PiSignOut } from "@preact-icons/pi";

interface SignOutProps {
  redirectTo?: string;
  className?: string;
  buttonText?: string;
  onSignOut?: () => void;
}

export function SignOut({
  className = "sign-out-button",
  buttonText = "Sign Out",
}: SignOutProps) {
  const handleSignOut = async () => {
    try {
      // Make a request to your sign-out endpoint
      const response = await fetch("/api/auth/sign-out", {
        method: "GET",
        credentials: "same-origin", // Include cookies in the request
      });

      if (!response.ok) {
        throw new Error("Failed to sign out");
      }

      globalThis.location.href = "/auth/sign-in";
    } catch (error) {
      // deno-lint-ignore no-console
      console.error("Sign out error:", error);
    }
  };

  return (
    <button
      class={`${className} outline delete-btn`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.25rem",
        cursor: "pointer",
        color: "var(--pico-del-color)",
        border: "1px solid var(--pico-del-color)",
      }}
      onClick={handleSignOut}
      type="button"
    >
      <PiSignOut />
      {buttonText}
    </button>
  );
}
