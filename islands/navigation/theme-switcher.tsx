import { PiMoonStars, PiSun } from "@preact-icons/pi";
import { useEffect, useState } from "preact/hooks";

export function ThemeSwitcher(
  {
    showNames = true,
    showTooltip = true,
    tooltipLocation = "bottom",
    compact = false,
    className,
  }: {
    showNames?: boolean;
    showTooltip?: boolean;
    tooltipLocation?: "left" | "bottom" | "right" | "top";
    compact?: boolean;
    className?: string;
  },
) {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Initialize theme from existing DOM attribute or storage once
  useEffect(() => {
    const initializeTheme = () => {
      const existing = document.documentElement.getAttribute("data-theme");
      if (existing === "light" || existing === "dark") {
        setTheme(existing);
        return;
      }
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "light" || savedTheme === "dark") {
        setTheme(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
        return;
      }
      const prefersDark = !!globalThis.matchMedia &&
        globalThis.matchMedia("(prefers-color-scheme: dark)").matches;
      const initial = prefersDark ? "dark" : "dark";
      setTheme(initial);
      document.documentElement.setAttribute("data-theme", initial);
    };

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(initializeTheme);

    // Listen for storage changes (theme changes from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === "theme" && (e.newValue === "light" || e.newValue === "dark")
      ) {
        setTheme(e.newValue);
        document.documentElement.setAttribute("data-theme", e.newValue);
      }
    };

    globalThis.addEventListener("storage", handleStorageChange);

    return () => {
      globalThis.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const toggleTheme = () => {
    if (isAnimating || theme === null) return; // Prevent multiple clicks during animation or before initialization

    setIsAnimating(true);

    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);

    // Reset animation state after a short delay
    setTimeout(() => {
      setIsAnimating(false);
    }, 150);
  };

  return (
    <button
      type="button"
      id="theme-switcher"
      aria-label="auto"
      aria-live="polite"
      name="theme-switcher"
      class={(compact ? "icon-button" : "outline") +
        (className ? ` ${className}` : "")}
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
        ...(compact ? {} : { minWidth: showNames ? "10em" : "2.5rem" }),
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
              color: "var(--pico-contrast)",
              fontSize: "1.2rem",
            }}
          >
            <PiMoonStars />
          </span>
          {!compact && showNames && <span>Dark side</span>}
        </div>
      )}

      {theme === "light" && (
        <div
          style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
        >
          <span
            class="theme-icon"
            style={{
              color: "var(--pico-contrast)",
              fontSize: "1.2rem",
            }}
          >
            <PiSun />
          </span>
          {!compact && showNames && <span>Light side</span>}
        </div>
      )}
    </button>
  );
}
