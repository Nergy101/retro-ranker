export const languages = [
  "en-US",
  "en-GB",
  "nl-NL",
  "de-DE",
  "fr-FR",
  "es-ES",
  "pt-PT",
] as const;

export const languageNames: Record<string, string> = {
  "en-US": "English (US)",
  "en-GB": "English (UK)",
  "nl-NL": "Nederlands",
  "de-DE": "Deutsch",
  "fr-FR": "Français",
  "es-ES": "Español",
  "pt-PT": "Português",
};

export const flagEmojis: Record<string, string> = {
  "en-US": "🇺🇸",
  "en-GB": "🇬🇧",
  "nl-NL": "🇳🇱",
  "de-DE": "🇩🇪",
  "fr-FR": "🇫🇷",
  "es-ES": "🇪🇸",
  "pt-PT": "🇵🇹",
};
