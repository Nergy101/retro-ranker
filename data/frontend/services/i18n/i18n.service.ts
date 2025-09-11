// Simple translation service for retro-ranker-2
// This is a basic implementation that returns the key as fallback

export function TranslationPipe(translations: Record<string, any> | undefined, key: string): string {
  if (!translations) {
    return key;
  }
  
  // Simple nested key access
  const keys = key.split('.');
  let value = translations;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key; // Return key as fallback
    }
  }
  
  return typeof value === 'string' ? value : key;
}

