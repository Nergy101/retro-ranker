import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

export function ThemeSwitcher({ showNames = true, tooltipLocation = "bottom" }: { showNames?: boolean, tooltipLocation?: "left" | "bottom" | "right" | "top" }) {
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
      onClick={toggleTheme}
      style={{
        padding: "0.5rem",
        borderRadius: "0.5rem",
        cursor: "pointer",
        transition: "all 0.5s ease-in-out",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.25rem",
        minWidth: showNames ? "5rem" : "2.5rem",
      }}
      aria-label={`Switch to ${
        theme.value === "light" ? "dark" : "light"
      } theme`}
      data-tooltip={`Switch to ${
        theme.value === "light" ? "dark" : "light"
      } theme`}
      data-placement={tooltipLocation}
    >
      {theme.value === "light"
        ? (
          <>
            <i class="ph ph-moon" style={{ fontSize: "1.2rem" }}></i>
            {showNames && <span>Dark</span>}
          </>
        )
        : (
          <>
            <i class="ph ph-sun" style={{ fontSize: "1.2rem" }}></i>
            {showNames && <span>Light</span>}
          </>
        )}
    </button>
  );
}
