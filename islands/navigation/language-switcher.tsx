import { flagEmojis, languages } from "@data/frontend/languages.ts";
import { TranslationPipe } from "@data/frontend/services/i18n/i18n.service.ts";
import { useEffect, useState } from "preact/hooks";

export function LanguageSwitcher({
  translations,
}: {
  translations: Record<string, string>;
}) {
  const [lang, setLang] = useState<string>("en-US");
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);

  useEffect(() => {
    // Check if dark theme is active
    const checkTheme = () => {
      const isDark =
        document.documentElement.getAttribute("data-theme") === "dark" ||
        document.documentElement.classList.contains("dark") ||
        globalThis.matchMedia("(prefers-color-scheme: dark)").matches ||
        localStorage.getItem("theme") === "dark";
      setIsDarkTheme(isDark);
    };

    checkTheme();

    // Listen for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class"],
    });

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", checkTheme);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", checkTheme);
    };
  }, []);

  useEffect(() => {
    // First check localStorage
    const saved = localStorage.getItem("language");
    if (saved && languages.includes(saved as any)) {
      setLang(saved);
      return;
    }

    // Then check document lang attribute
    if (
      document.documentElement.lang &&
      languages.includes(document.documentElement.lang as any)
    ) {
      setLang(document.documentElement.lang);
      return;
    }

    // Finally, check cookies
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "lang" && value && languages.includes(value as any)) {
        setLang(value);
        return;
      }
    }

    // Default to en-US if nothing found
    setLang("en-US");
  }, []);

  const change = async (e: Event) => {
    const value = (e.currentTarget as HTMLSelectElement).value;
    setLang(value);

    // Set localStorage
    localStorage.setItem("language", value);

    // Set cookie with proper attributes to ensure it's saved
    document.cookie = `lang=${value}; path=/; max-age=31536000; SameSite=Lax`;

    // Add a small delay to ensure the cookie is properly set before reload
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Force a hard reload with cache-busting parameter to ensure fresh translations
    const currentUrl = new URL(globalThis.location.href);
    currentUrl.searchParams.set("refresh", "true");
    globalThis.location.href = currentUrl.toString();
  };

  return (
    <select
      value={lang}
      onChange={change}
      aria-label={TranslationPipe(translations, "navigation.selectLanguage")}
      style={{
        margin: "0",
        borderRadius: "0.5rem",
        cursor: "pointer",
        transition: "all 0.3s ease-in-out",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "2.5rem",
        height: "2.5rem",
        padding: "0.5rem",
        border: "1px solid var(--pico-primary)",
        backgroundColor: "var(--pico-background-color)",
        color: "var(--pico-color)",
        fontSize: "1.2rem",
        textAlign: "center",
        appearance: "none",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 0.5rem center",
        backgroundSize: "1rem",
        paddingRight: "2rem",
        lineHeight: "1",
        verticalAlign: "middle",
      }}
    >
      {languages.map((code) => (
        <option
          value={code}
          style={{
            textAlign: "center",
            lineHeight: "1.5",
            padding: "0.25rem 0",
            fontSize: "1.2rem",
          }}
        >
          {flagEmojis[code]}
        </option>
      ))}
    </select>
  );
}
