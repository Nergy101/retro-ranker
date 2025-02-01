type OsConfig = {
  icon: string;
  url: string;
  name: string;
};

const OS_CONFIGS: Record<string, OsConfig> = {
  proprietary: { icon: "ph-factory", url: "", name: "" },
  steam: {
    icon: "ph-steam-logo",
    url: "https://store.steampowered.com/steamos",
    name: "SteamOS",
  },
  android: {
    icon: "ph-android-logo",
    url: "https://www.android.com/",
    name: "Android",
  },
  ios: {
    icon: "ph-apple-logo",
    url: "https://www.apple.com/ios/",
    name: "iOS",
  },
  linux: {
    icon: "ph-linux-logo",
    url: "https://www.linux.org/",
    name: "Linux",
  },
  macos: {
    icon: "ph-apple-logo",
    url: "https://www.apple.com/macos",
    name: "macOS",
  },
  windows: {
    icon: "ph-windows-logo",
    url: "https://www.microsoft.com/en-us/windows",
    name: "Windows",
  },
  garlic: {
    icon: "ph-brackets-angle",
    url: "https://github.com/GarlicOS",
    name: "GarlicOS",
  },
  onion: {
    icon: "ph-brackets-square",
    url: "https://onionui.github.io/",
    name: "OnionOS",
  },
  gamma: {
    icon: "ph-brackets-curly",
    url: "https://github.com/TheGammaSqueeze/GammaOS",
    name: "GammaOS",
  },
  opendingux: {
    icon: "ph-brackets-round",
    url: "https://github.com/OpenDingux",
    name: "OpenDingux",
  },
  arkos: {
    icon: "ph-rainbow",
    url: "https://github.com/christianhaitian/arkos/wiki",
    name: "ArkOS",
  },
  minui: {
    icon: "ph-minus-square",
    url: "https://github.com/shauninman/MinUI",
    name: "MiniUI",
  },
  batocera: {
    icon: "ph-joystick",
    url: "https://batocera.org/",
    name: "Batocera",
  },
  trimui: {
    icon: "ph-scissors",
    url: "http://www.trimui.com/",
    name: "TrimUI",
  },
  "analogue os": {
    icon: "ph-code",
    url:
      "https://www.analogue.co/announcements/analogue-os-is-now-product-specific",
    name: "AnalogueOS",
  },
  retroarch: {
    icon: "👾",
    url: "",
    name: "RetroArch",
  },
  nintendo: {
    icon: "ph-factory",
    url: "https://nintendo.com/",
    name: "Nintendo",
  },
  psp: {
    icon: "ph-factory",
    url: "https://en.wikipedia.org/wiki/PlayStation_Portable",
    name: "PSP",
  },
  vita: {
    icon: "ph-factory",
    url: "https://en.wikipedia.org/wiki/PlayStation_Vita",
    name: "Vita",
  },
};

export function parseOsIcons(os: string): string[] {
  const icons = Object.entries(OS_CONFIGS)
    .filter(([key]) => os.includes(key))
    .map(([_, config]) => config.icon);

  return icons.length ? icons : ["ph-empty"];
}

export function getOsLinks(os: string): { url: string; name: string }[] {
  return Object.entries(OS_CONFIGS)
    .filter(([key]) => os.includes(key))
    .map(([_, config]) => ({
      url: config.url,
      name: config.name,
    }))
    .filter((link) => link.url !== "");
}

interface PriceRange {
  min: number;
  max: number;
}

interface PriceCategory {
  max: number;
  name: string;
}

const PRICE_CATEGORIES: PriceCategory[] = [
  { max: 0, name: "unknown" },
  { max: 100, name: "low" },
  { max: 300, name: "mid" },
  { max: Infinity, name: "high" },
];

const CURRENCY_SYMBOLS: Record<string, string> = {
  "€": "EUR",
  "$": "USD",
  "£": "GBP",
  "¥": "JPY",
  "₹": "INR",
  "₩": "KRW",
  "₽": "RUB",
  "₺": "TRY",
};

export function parsePriceRange(priceText: string): PriceRange {
  const numbers = priceText.match(/\d+/g)?.map(Number) || [0];
  return {
    min: numbers[0] || 0,
    max: numbers[numbers.length - 1] || 0,
  };
}

export function getPricingCategory(priceNumber: number): string {
  return PRICE_CATEGORIES.find((category) => priceNumber <= category.max)
    ?.name || "unknown";
}

export function getPriceCurrency(priceText: string): string {
  const symbol = Object.keys(CURRENCY_SYMBOLS).find((symbol) =>
    priceText.includes(symbol)
  );
  return symbol ? CURRENCY_SYMBOLS[symbol] : "?";
}
