import { useEffect, useState } from "preact/hooks";
import {
  flagEmojis,
  languageNames,
  languages,
} from "@data/frontend/languages.ts";
import { TranslationPipe } from "@data/frontend/services/i18n/i18n.service.ts";

export function LanguageSwitcher({
  translations,
}: {
  translations: Record<string, string>;
}) {
  const [lang, setLang] = useState<string>("en-US");

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
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("refresh", "true");
    window.location.href = currentUrl.toString();
  };

  return (
    <select
      value={lang}
      onChange={change}
      aria-label={TranslationPipe(translations, "navigation.selectLanguage")}
    >
      {languages.map((code) => (
        <option value={code}>
          {flagEmojis[code]} {languageNames[code]}
        </option>
      ))}
    </select>
  );
}
