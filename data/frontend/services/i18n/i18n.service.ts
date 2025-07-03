const cache = new Map<string, Record<string, string>>();

export async function getTranslations(
  lang: string,
): Promise<Record<string, string>> {
  if (cache.has(lang)) return cache.get(lang)!;
  try {
    const module = await import(`../../../../static/i18n/${lang}.json`, {
      assert: { type: "json" },
    });
    const data = module.default as Record<string, string>;
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
export function TranslationPipe(
  translations: Record<string, string>,
  key: string,
): string {
  return translations[key] ?? key;
}
