export function parseOsIcons(os: string): string[] {
  const lowerOs = os.toLowerCase();
  const icons: string[] = [];

  if (lowerOs.includes("proprietary")) icons.push("ph-factory");

  if (lowerOs.includes("steam")) icons.push("ph-steam-logo");
  if (lowerOs.includes("android")) icons.push("ph-android-logo");
  if (lowerOs.includes("ios")) icons.push("ph-apple-logo");

  if (lowerOs.includes("linux")) icons.push("ph-linux-logo");
  if (lowerOs.includes("macos")) icons.push("ph-apple-logo");
  if (lowerOs.includes("windows")) icons.push("ph-windows-logo");

  if (lowerOs.includes("garlic")) icons.push("ph-brackets-angle");
  if (lowerOs.includes("onion")) icons.push("ph-brackets-square");

  if (lowerOs.includes("gamma")) icons.push("ph-brackets-curly");

  if (lowerOs.includes("opendingux")) icons.push("ph-brackets-round");
  if (lowerOs.includes("arkos")) icons.push("ph-rainbow");

  if (lowerOs.includes("minui")) icons.push("ph-minus-square");
  if (lowerOs.includes("batocera")) icons.push("ph-joystick");
  if (lowerOs.includes("trimui")) icons.push("ph-scissors");

  if (lowerOs.includes("analogue os")) icons.push("ph-code");

  // OEM
  if (lowerOs.includes("nintendo")) icons.push("ph-factory");
  if (lowerOs.includes("psp")) icons.push("ph-factory");
  if (lowerOs.includes("vita")) icons.push("ph-factory");
  if (lowerOs.includes("gingerbread")) icons.push("ph-factory");
  if (lowerOs.includes("proprietary")) icons.push("ph-factory");

  return icons.length ? icons : ["ph-empty"];
}

export function getOsLinks(os: string): { url: string; name: string }[] {
  const lowerOs = os.toLowerCase();
  const links: { url: string; name: string }[] = [];
  if (lowerOs.includes("steam")) {
    links.push({
      url: "https://store.steampowered.com/steamos",
      name: "SteamOS",
    });
  }
  if (lowerOs.includes("android")) {
    links.push({ url: "https://www.android.com/", name: "Android" });
  }
  if (lowerOs.includes("ios")) {
    links.push({ url: "https://www.apple.com/ios/", name: "iOS" });
  }
  if (lowerOs.includes("linux")) {
    links.push({ url: "https://www.linux.org/", name: "Linux" });
  }
  if (lowerOs.includes("macos")) {
    links.push({ url: "https://www.apple.com/macos", name: "macOS" });
  }
  if (lowerOs.includes("windows")) {
    links.push({
      url: "https://www.microsoft.com/en-us/windows",
      name: "Windows",
    });
  }
  if (lowerOs.includes("garlic")) {
    links.push({ url: "https://github.com/GarlicOS", name: "GarlicOS" });
  }
  if (lowerOs.includes("onion")) {
    links.push({ url: "https://onionui.github.io/", name: "OnionOS" });
  }
  if (lowerOs.includes("gamma")) {
    links.push({
      url: "https://github.com/TheGammaSqueeze/GammaOS",
      name: "GammaOS",
    });
  }
  if (lowerOs.includes("opendingux")) {
    links.push({ url: "https://github.com/OpenDingux", name: "OpenDingux" });
  }
  if (lowerOs.includes("arkos")) {
    links.push({
      url: "https://github.com/christianhaitian/arkos/wiki",
      name: "ArkOS",
    });
  }
  if (lowerOs.includes("minui")) {
    links.push({
      url: "https://github.com/shauninman/MinUI",
      name: "MiniUI",
    });
  }
  if (lowerOs.includes("batocera")) {
    links.push({ url: "https://batocera.org/", name: "Batocera" });
  }
  if (lowerOs.includes("trimui")) {
    links.push({ url: "http://www.trimui.com/", name: "TrimUI" });
  }
  if (lowerOs.includes("analogue os")) {
    links.push({
      url:
        "https://www.analogue.co/announcements/analogue-os-is-now-product-specific",
      name: "AnalogueOS",
    });
  }
  if (lowerOs.includes("nintendo")) {
    links.push({ url: "https://nintendo.com/", name: "Nintendo" });
  }
  if (lowerOs.includes("psp")) {
    links.push({
      url: "https://en.wikipedia.org/wiki/PlayStation_Portable",
      name: "PSP",
    });
  }
  if (lowerOs.includes("vita")) {
    links.push({
      url: "https://en.wikipedia.org/wiki/PlayStation_Vita",
      name: "Vita",
    });
  }

  return links;
}

export function parsePriceRange(
  priceText: string,
): { min: number; max: number } {
  // prices are in the format of "100-200"
  // or $050 - $75
  // or $50 - $150
  const priceRange = priceText.match(/\d+/g);

  const lastPrice = priceRange?.[priceRange.length - 1];
  const min = priceRange ? parseInt(priceRange[0]) : 0;
  const max = lastPrice ? parseInt(lastPrice) : 0;
  return { min, max };
}

export function getPricingCategory(priceNumber: number): string {
  if (priceNumber === 0) return "unknown";
  if (priceNumber <= 100) return "low";
  if (priceNumber <= 300) return "mid";
  return "high";
}

export function getPriceCurrency(priceText: string): string {
  if (priceText.includes("€")) return "EUR";
  if (priceText.includes("$")) return "USD";
  if (priceText.includes("£")) return "GBP";
  if (priceText.includes("¥")) return "JPY";
  if (priceText.includes("₹")) return "INR";
  if (priceText.includes("₩")) return "KRW";
  if (priceText.includes("₽")) return "RUB";
  if (priceText.includes("₺")) return "TRY";
  return "?";
}
