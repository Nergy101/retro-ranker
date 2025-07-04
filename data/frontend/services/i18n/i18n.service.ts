const cache = new Map<string, Record<string, string>>();

export async function getTranslations(
  lang: string,
): Promise<Record<string, string>> {
  if (cache.has(lang)) {
    return cache.get(lang)!;
  }

  try {
    const baseUrl = Deno.env.get("BASE_URL");
    const response = await fetch(`${baseUrl}/i18n/${lang}.json`);

    if (!response.ok) {
      throw new Error(`Failed to load translations for ${lang}`);
    }

    const data = await response.json() as Record<string, string>;

    cache.set(lang, data);
    return data;
  } catch {
    if (lang !== "en-US") {
      return await getTranslations("en-US");
    }
    return {};
  }
}

/**
 * Lookup a translation key in the given translation map.
 *
 * The function is named "TranslationPipe" so it can easily be imported and
 * reused across components without redefining the helper each time.
 */
export const TranslationPipe = (
  translations: Record<string, string>,
  key: string,
) => {
  return translations[key] ?? key;
};
