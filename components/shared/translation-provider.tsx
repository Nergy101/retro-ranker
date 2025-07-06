import {
  BatchTranslationPipe,
  TranslationPipe,
} from "@data/frontend/services/i18n/i18n.service.ts";
import { ComponentChildren } from "preact";

interface TranslationProviderProps {
  translations: Record<string, string>;
  children: (
    t: (key: string) => string,
    tBatch: (keys: string[]) => string[],
  ) => ComponentChildren;
}

/**
 * Efficient translation provider that reduces function call overhead
 * by providing optimized translation functions
 */
export function TranslationProvider(
  { translations, children }: TranslationProviderProps,
) {
  // Memoized translation function to avoid repeated object key lookups
  const t = (key: string): string => TranslationPipe(translations, key);

  // Batch translation function for multiple keys
  const tBatch = (keys: string[]): string[] =>
    BatchTranslationPipe(translations, keys);

  return children(t, tBatch);
}

/**
 * Hook for using translations in components
 */
export function useTranslations(translations: Record<string, string>) {
  return {
    t: (key: string): string => TranslationPipe(translations, key),
    tBatch: (keys: string[]): string[] =>
      BatchTranslationPipe(translations, keys),
  };
}
