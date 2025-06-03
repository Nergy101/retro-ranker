import { PiMoonStars, PiSun } from "@preact-icons/pi";
import { useEffect, useState } from "preact/hooks";

export default function ThemeSwitcher(
  { showNames = true, showTooltip = true, tooltipLocation = "bottom" }: {
    showNames?: boolean;
    showTooltip?: boolean;
    tooltipLocation?: "left" | "bottom" | "right" | "top";
  },
) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

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
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
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
      style={{
        margin: "0",
        padding: "0.5rem",
        borderRadius: "0.5rem",
        cursor: "pointer",
        transition:
          "all 0.3s ease-in-out, transform 0.5s ease-in-out, background-color 0.3s ease-in-out",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.25rem",
        minWidth: showNames ? "10em" : "2.5rem",
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
            id="theme-switcher-dark"
            style={{
              fontSize: "1.2rem",
              transition: "transform 500ms ease-in-out",
              transform: "rotate(0deg)",
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
            id="theme-switcher-light"
            style={{
              fontSize: "1.2rem",
              transition: "transform 500ms ease-in-out",
              transform: "rotate(180deg)",
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
