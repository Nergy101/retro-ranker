import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

export function ThemeSwitcher(
  { showNames = true, showTooltip = true, tooltipLocation = "bottom" }: {
    showNames?: boolean;
    showTooltip?: boolean;
    tooltipLocation?: "left" | "bottom" | "right" | "top";
  },
) {
  const theme = useSignal<"light" | "dark">("dark");

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      theme.value = savedTheme as "light" | "dark";
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      const prefersDark =
        globalThis.matchMedia("(prefers-color-scheme: dark)").matches;
      theme.value = prefersDark ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", theme.value);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme.value === "light" ? "dark" : "light";
    theme.value = newTheme;
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <button
      class="outline"
      onClick={toggleTheme}
      style={{
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
      aria-label={showTooltip
        ? `Switch to ${theme.value === "light" ? "dark" : "light"} theme`
        : undefined}
      data-tooltip={showTooltip
        ? `Switch to ${theme.value === "light" ? "dark" : "light"} theme`
        : undefined}
      data-placement={tooltipLocation}
    >
      {theme.value === "light"
        ? (
          <>
            <i
              class="ph ph-moon"
              style={{
                fontSize: "1.2rem",
                transition: "transform 500ms ease-in-out",
                transform: "rotate(0deg)",
              }}
            >
            </i>
            {showNames && <span>Dark theme</span>}
          </>
        )
        : (
          <>
            <i
              class="ph ph-sun"
              style={{
                fontSize: "1.2rem",
                transition: "transform 500ms ease-in-out",
                transform: "rotate(180deg)",
              }}
            >
            </i>
            {showNames && <span>Light theme</span>}
          </>
        )}
    </button>
  );
}
