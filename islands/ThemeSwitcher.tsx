import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

export function ThemeSwitcher({ showNames = true }: { showNames?: boolean }) {
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
        backgroundColor: "var(--pico-primary)",
        border: "1px solid var(--pico-primary)",
        color: "white",
        padding: "0.5rem",
        borderRadius: "0.5rem",
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
      }}
      aria-label={`Switch to ${
        theme.value === "light" ? "dark" : "light"
      } theme`}
      data-tooltip={`Switch to ${
        theme.value === "light" ? "dark" : "light"
      } theme`}
      data-placement="bottom"
    >
      {theme.value === "light"
        ? (
          <>
            <i class="ph ph-moon"></i>
            {showNames && <span>&nbsp;Dark</span>}
          </>
        )
        : (
          <>
            <i class="ph ph-sun"></i>
            {showNames && <span>&nbsp;Light</span>}
          </>
        )}
    </button>
  );
}
