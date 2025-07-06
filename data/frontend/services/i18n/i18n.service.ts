import { logJson } from "../../../tracing/tracer.ts";

// Supported languages
const LANGS = [
  "en-US",
  "en-GB",
  "de-DE",
  "fr-FR",
  "es-ES",
  "nl-NL",
  "pt-PT",
] as const;

// In-memory cache for translations - loaded at startup
const translations: Record<string, Record<string, string>> = {};
const loadingPromises: Record<string, Promise<Record<string, string>>> = {};

/**
 * Load a single language translation file using direct file system access
 * This is much faster than HTTP requests for server-side rendering
 */
async function loadTranslationFile(
  lang: string,
): Promise<Record<string, string>> {
  const startTime = performance.now();
  try {
    logJson("info", "Loading translation file", { lang });

    // Use direct file system access for better performance
    const filePath = `./static/i18n/${lang}.json`;

    const readStart = performance.now();
    const content = await Deno.readTextFile(filePath);
    const readEnd = performance.now();

    const parseStart = performance.now();
    const data = JSON.parse(content) as Record<string, string>;
    const parseEnd = performance.now();

    const totalTime = performance.now() - startTime;

    logJson("info", "Translation file loaded", {
      lang,
      filePath,
      readTime: `${(readEnd - readStart).toFixed(2)}ms`,
      parseTime: `${(parseEnd - parseStart).toFixed(2)}ms`,
      totalTime: `${totalTime.toFixed(2)}ms`,
      keyCount: Object.keys(data).length,
    });

    return data;
  } catch (error) {
    const totalTime = performance.now() - startTime;
    logJson("error", "Failed to load translation file", {
      lang,
      error: error instanceof Error ? error.message : String(error),
      totalTime: `${totalTime.toFixed(2)}ms`,
    });
    throw error;
  }
}

/**
 * Get translations for a specific language with intelligent caching
 * Only loads the requested language, not all languages
 */
export async function getTranslations(
  lang: string,
): Promise<Record<string, string>> {
  const startTime = performance.now();

  // Return cached translations immediately if available
  if (translations[lang]) {
    const totalTime = performance.now() - startTime;
    logJson("info", "getTranslations - Cache Hit", {
      lang,
      totalTime: `${totalTime.toFixed(2)}ms`,
      keyCount: Object.keys(translations[lang]).length,
    });
    return translations[lang];
  }

  // If already loading this language, wait for that promise
  if (loadingPromises[lang] !== undefined) {
    logJson("info", "getTranslations - Waiting for existing load", { lang });
    const result = await loadingPromises[lang];
    const totalTime = performance.now() - startTime;
    logJson("info", "getTranslations - Existing load completed", {
      lang,
      totalTime: `${totalTime.toFixed(2)}ms`,
    });
    return result;
  }

  logJson("info", "getTranslations - Starting new load", { lang });

  // Start loading the translation file
  const loadPromise = loadTranslationFile(lang).then((data) => {
    translations[lang] = data;
    delete loadingPromises[lang]; // Clean up the loading promise
    return data;
  }).catch((error) => {
    delete loadingPromises[lang]; // Clean up on error
    throw error;
  });

  // Store the loading promise to prevent duplicate requests
  loadingPromises[lang] = loadPromise;

  try {
    const result = await loadPromise;
    const totalTime = performance.now() - startTime;
    logJson("info", "getTranslations - New load completed", {
      lang,
      totalTime: `${totalTime.toFixed(2)}ms`,
      keyCount: Object.keys(result).length,
    });
    return result;
  } catch (error) {
    // Fallback to en-US if requested language not found
    if (lang !== "en-US") {
      logJson("warn", "getTranslations - Falling back to en-US", {
        requestedLang: lang,
        error: error instanceof Error ? error.message : String(error),
      });
      return await getTranslations("en-US");
    }

    // Last resort: return empty object
    logJson("error", "getTranslations - No translations available", { lang });
    return {};
  }
}

/**
 * Optimized translation lookup with memoization for frequently used keys
 * This reduces repeated object property lookups
 */
const translationMemo = new Map<string, string>();

export const TranslationPipe = (
  translations: Record<string, string>,
  key: string,
): string => {
  // Handle empty or undefined translations
  if (!translations || Object.keys(translations).length === 0) {
    return key;
  }

  // Create a memo key combining language and translation key
  const memoKey = `${Object.keys(translations)[0] || "default"}:${key}`;

  // Check memo first for frequently used keys
  if (translationMemo.has(memoKey)) {
    return translationMemo.get(memoKey)!;
  }

  // Look up translation
  const result = translations[key] ?? key;

  // Memoize the result (limit memo size to prevent memory leaks)
  if (translationMemo.size < 1000) {
    translationMemo.set(memoKey, result);
  }

  return result;
};

/**
 * Batch translation lookup for better performance
 * Useful when you need multiple translations at once
 */
export const BatchTranslationPipe = (
  translations: Record<string, string>,
  keys: string[],
): string[] => {
  return keys.map((key) => TranslationPipe(translations, key));
};

/**
 * Get all available languages
 */
export function getAvailableLanguages(): readonly string[] {
  return LANGS;
}

/**
 * Check if a language is supported
 */
export function isLanguageSupported(lang: string): boolean {
  return LANGS.includes(lang as any);
}

/**
 * Get translation statistics (useful for debugging)
 */
export function getTranslationStats() {
  return {
    availableLanguages: Object.keys(translations),
    totalLanguages: LANGS.length,
    memoSize: translationMemo.size,
    loadingPromises: Object.keys(loadingPromises),
  };
}

/**
 * Preload a specific language (useful for performance optimization)
 */
export async function preloadLanguage(lang: string): Promise<void> {
  if (!translations[lang] && loadingPromises[lang] === undefined) {
    await getTranslations(lang);
  }
}

/**
 * Preload multiple languages in parallel
 */
export async function preloadLanguages(langs: string[]): Promise<void> {
  await Promise.all(langs.map((lang) => preloadLanguage(lang)));
}

/**
 * Initialize translations at startup for better performance
 * This should be called when the application starts
 */
export async function initializeTranslations(): Promise<void> {
  const startTime = performance.now();
  logJson("info", "Initializing translations", {});

  try {
    // Preload the default language (en-US) first
    await preloadLanguage("en-US");

    // Optionally preload other languages in the background
    // This can be commented out if you want to load languages on-demand
    // await preloadLanguages(LANGS);

    const totalTime = performance.now() - startTime;
    logJson("info", "Translations initialized", {
      totalTime: `${totalTime.toFixed(2)}ms`,
      loadedLanguages: Object.keys(translations),
    });
  } catch (error) {
    logJson("error", "Failed to initialize translations", {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Clear translation cache and memo
 * Useful when language changes to ensure fresh translations
 */
export function clearTranslationCache(): void {
  // Clear the in-memory translations cache
  Object.keys(translations).forEach((key) => delete translations[key]);

  // Clear the loading promises
  Object.keys(loadingPromises).forEach((key) => delete loadingPromises[key]);

  // Clear the translation memo
  translationMemo.clear();

  logJson("info", "Translation cache cleared", {
    clearedTranslations: Object.keys(translations).length,
    clearedPromises: Object.keys(loadingPromises).length,
    clearedMemo: translationMemo.size,
  });
}
