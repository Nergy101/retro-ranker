import { PiMoonStars, PiSun } from "@preact-icons/pi";
import { useEffect, useState } from "preact/hooks";

export function ThemeSwitcher(
  { showNames = true, showTooltip = true, tooltipLocation = "bottom" }: {
    showNames?: boolean;
    showTooltip?: boolean;
    tooltipLocation?: "left" | "bottom" | "right" | "top";
  },
) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [isAnimating, setIsAnimating] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme as "light" | "dark");
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      const prefersDark =
        globalThis.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
      document.documentElement.setAttribute("data-theme", theme);
    }
  });

  const toggleTheme = () => {
    if (isAnimating) return; // Prevent multiple clicks during animation

    setIsAnimating(true);

    // Start the morphing animation
    const icon = document.querySelector(".theme-icon");
    if (icon) {
      icon.classList.add("morphing");
    }

    // Change theme halfway through the animation
    setTimeout(() => {
      const newTheme = theme === "light" ? "dark" : "light";
      setTheme(newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
    }, 200);

    // Remove animation class and reset state after completion
    setTimeout(() => {
      if (icon) {
        icon.classList.remove("morphing");
      }
      setIsAnimating(false);
    }, 400);
  };

  return (
    <button
      type="button"
      id="theme-switcher"
      aria-label="auto"
      aria-live="polite"
      name="theme-switcher"
      class="outline"
      onClick={toggleTheme}
      disabled={isAnimating}
      style={{
        margin: "0",
        borderRadius: "0.5rem",
        cursor: isAnimating ? "not-allowed" : "pointer",
        transition:
          "all 0.3s ease-in-out, transform 0.5s ease-in-out, background-color 0.3s ease-in-out",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.25rem",
        minWidth: showNames ? "10em" : "2.5rem",
        opacity: isAnimating ? 0.8 : 1,
      }}
      data-tooltip={showTooltip
        ? `Switch to ${theme === "light" ? "dark" : "light"} theme`
        : undefined}
      data-placement={tooltipLocation}
    >
      {theme === null && (
        <div
          style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
        >
          <span id="theme-switcher-loader">
            <span aria-busy="true"></span>
          </span>
        </div>
      )}

      {theme === "dark" && (
        <div
          style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
        >
          <span
            class="theme-icon"
            style={{
              fontSize: "1.2rem",
            }}
          >
            <PiMoonStars />
          </span>
          {showNames && <span>Dark side</span>}
        </div>
      )}

      {theme === "light" && (
        <div
          style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
        >
          <span
            class="theme-icon"
            style={{
              fontSize: "1.2rem",
            }}
          >
            <PiSun />
          </span>
          {showNames && <span>Light side</span>}
        </div>
      )}
    </button>
  );
}
