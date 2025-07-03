export const languages = [
  "en-US",
  "en-GB",
  "de-DE",
  "fr-FR",
  "es-ES",
  "nl-NL",
  "pt-PT",
] as const;

export const languageNames: Record<string, string> = {
  "en-US": "English (US)",
  "en-GB": "English (UK)",
  "de-DE": "Deutsch",
  "fr-FR": "Français",
  "es-ES": "Español",
  "nl-NL": "Nederlands",
  "pt-PT": "Português",
};

export const flagEmojis: Record<string, string> = {
  "en-US": "🇺🇸",
  "en-GB": "🇬🇧",
  "de-DE": "🇩🇪",
  "fr-FR": "🇫🇷",
  "es-ES": "🇪🇸",
  "nl-NL": "🇳🇱",
  "pt-PT": "🇵🇹",
};
