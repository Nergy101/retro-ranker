import { useEffect, useState } from "preact/hooks";
import { languageNames, languages } from "@data/frontend/languages.ts";

export function LanguageSwitcher() {
  const [lang, setLang] = useState<string>("en-US");

  useEffect(() => {
    const saved = localStorage.getItem("language");
    if (saved) {
      setLang(saved);
    } else if (document.documentElement.lang) {
      setLang(document.documentElement.lang);
    }
  }, []);

  const change = (e: Event) => {
    const value = (e.currentTarget as HTMLSelectElement).value;
    setLang(value);
    localStorage.setItem("language", value);
    document.cookie = `lang=${value}; path=/; max-age=3600`;
    location.reload();
  };

  return (
    <select value={lang} onChange={change} aria-label="Select language">
      {languages.map((code) => (
        <option value={code}>{languageNames[code]}</option>
      ))}
    </select>
  );
}
