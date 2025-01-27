import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";
import { RatingsService } from "../../services/devices/ratings.service.ts";
import { Device } from "../models/device.model.ts";
import { EmulationSystem } from "../enums/EmulationSystem.ts";

export class DeviceParser {
  private static ratingsService = RatingsService.getInstance();

  private static parseOsIcons(os: string): string[] {
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

  private static getOsLinks(os: string): { url: string; name: string }[] {
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

  private static parsePriceRange(
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

  private static getPricingCategory(priceNumber: number): string {
    if (priceNumber === 0) return "unknown";
    if (priceNumber <= 100) return "low";
    if (priceNumber <= 300) return "mid";
    return "high";
  }

  private static getPriceCurrency(priceText: string): string {
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

  public static parseHandheldsHtml(filePath: string): Device[] {
    const devices: Device[] = [];
    const text = Deno.readTextFileSync(filePath);
    const $ = cheerio.load(text);

    const table = $("tbody");
    if (!table.length) return devices;

    const rows = $("tr", table);
    const headers: string[] = [];

    // Get headers
    rows.first().find("td").each((_, el) => {
      const headerText = $(el).text().trim();
      if (headerText && !headerText.includes("Donations welcome")) {
        headers.push(headerText);
      }
    });

    // Process data rows (skip header)
    rows.slice(1).each((_, row) => {
      const device: Device = {
        name: {
          raw: "",
          sanitized: "",
          normalized: "",
        },
        os: {
          raw: "",
          list: [],
          icons: [],
          customFirmwares: [],
          links: [],
        },
        brand: "",
        lowBatteryIndicator: null,
        hackingGuides: [],
        systemOnChip: null,
        architecture: null,
        ram: null,
        rumble: null,
        sensors: [],
        volumeControl: null,
        brightnessControl: null,
        powerControl: null,
        battery: null,
        chargePort: null,
        storage: null,
        dimensions: null,
        weight: null,
        shellMaterial: null,
        colors: [],
        image: {
          originalUrl: null,
          url: null,
          alt: null,
        },
        released: {
          raw: null,
          mentionedDate: null,
        },
        formFactor: null,
        consoleRatings: [],
        connectivity: {
          hasWifi: null,
          hasBluetooth: null,
          hasNFC: null,
          hasUSB: null,
          hasUSBC: null,
          hasDisplayPort: null,
          hasVGA: null,
          hasDVI: null,
          hasHDMI: null,
        },
        cpu: {
          raw: null,
          names: [],
          cores: null,
          threads: null,
          clockSpeed: null,
        },
        gpu: {
          name: null,
          cores: null,
          clockSpeed: null,
        },
        performance: {
          tier: null,
          rating: null,
          normalizedRating: null,
          maxEmulation: null,
          emulationLimit: null,
        },
        screen: {
          size: null,
          type: null,
          resolution: null,
          ppi: null,
          aspectRatio: null,
          lens: null,
        },
        cooling: {
          raw: null,
          hasHeatsink: null,
          hasHeatPipe: null,
          hasFan: null,
          hasVentilationCutouts: null,
        },
        controls: {
          dPad: null,
          analogs: [],
          faceButtons: [],
          shoulderButtons: [],
          extraButtons: [],
        },
        outputs: {
          videoOutput: null,
          audioOutput: null,
          speaker: null,
        },
        reviews: {
          videoReviews: [],
          writtenReviews: [],
        },

        pricing: {
          raw: null,
          average: null,
          range: {
            min: null,
            max: null,
          },
          currency: null,
          category: null,
          discontinued: null,
        },

        pros: [],
        cons: [],

        vendorLinks: [],
        notes: [],
      };

      $(row).find("td").each((colIndex, cell) => {
        if (colIndex === 0) {
          // get the image url
          const imageUrl = $(cell).find("img").attr("src");
          if (imageUrl) {
            device.image = {
              originalUrl: imageUrl,
              url: null, // set later
              alt: null, // set later
            };
          }
        }

        if (colIndex === 76) {
          const hrefList: { url: string; name: string }[] = [];

          // Select all <a> elements and extract the href attributes
          $(cell).find("a").each((_, element) => {
            const href = $(element).attr("href");
            const name = $(element).text().trim() ??
              (href === undefined ? "Vendor" : new URL(href).hostname);
            if (href) {
              hrefList.push({ url: href, name });
            }
          });
          device.vendorLinks = [...device.vendorLinks, ...hrefList];
        }

        if (colIndex === 73) {
          const hrefList: { url: string; name: string }[] = [];

          // Select all <a> elements and extract the href attributes
          $(cell).find("a").each((_, element) => {
            const href = $(element).attr("href");
            const name = $(element).text().trim() ??
              (href === undefined ? "Review" : new URL(href).hostname);

            if (href) {
              hrefList.push({ url: href, name });
            }
          });
          device.reviews.writtenReviews = [
            ...device.reviews.writtenReviews,
            ...hrefList,
          ];
        }

        const value = $(cell).text().trim();
        this.mapHandheldsColumnToDevice(colIndex, value, device);
      });

      devices.push(device);
    });

    // filter out devices that have too much information missing
    return devices.filter((device) => {
      return (
        device.name.raw !== "" ||
        device.brand !== ""
      );
    });
  }

  public static parseOEMsHtml(filePath: string): Device[] {
    const devices: Device[] = [];
    const text = Deno.readTextFileSync(filePath);
    const $ = cheerio.load(text);

    const table = $("tbody");
    if (!table.length) return devices;

    const rows = $("tr", table);
    const headers: string[] = [];

    // Get headers
    rows.first().find("td").each((_, el) => {
      const headerText = $(el).text().trim();
      if (headerText && !headerText.includes("Donations welcome")) {
        headers.push(headerText);
      }
    });

    // Process data rows (skip header)
    rows.slice(1).each((_, row) => {
      const device: Device = {
        name: {
          raw: "",
          sanitized: "",
          normalized: "",
        },
        os: {
          raw: "",
          list: [],
          icons: [],
          customFirmwares: [],
          links: [],
        },
        brand: "",
        lowBatteryIndicator: null,
        hackingGuides: [],
        consoleRatings: [],
        systemOnChip: null,
        architecture: null,
        ram: null,
        rumble: null,
        sensors: [],
        volumeControl: null,
        brightnessControl: null,
        powerControl: null,
        battery: null,
        chargePort: null,
        storage: null,
        dimensions: null,
        weight: null,
        shellMaterial: null,
        colors: [],
        image: {
          originalUrl: null,
          url: null,
          alt: null,
        },
        released: {
          raw: null,
          mentionedDate: null,
        },
        formFactor: null,
        connectivity: {
          hasWifi: false,
          hasBluetooth: false,
          hasNFC: false,
          hasUSB: false,
          hasUSBC: false,
          hasDisplayPort: false,
          hasVGA: false,
          hasDVI: false,
          hasHDMI: false,
        },
        cpu: {
          raw: null,
          names: [],
          cores: null,
          threads: null,
          clockSpeed: null,
        },
        gpu: {
          name: null,
          cores: null,
          clockSpeed: null,
        },
        performance: {
          tier: null,
          rating: null,
          normalizedRating: null,
          maxEmulation: null,
          emulationLimit: null,
        },
        screen: {
          size: null,
          type: null,
          resolution: null,
          ppi: null,
          aspectRatio: null,
          lens: null,
        },
        cooling: {
          raw: null,
          hasHeatsink: null,
          hasHeatPipe: null,
          hasFan: null,
          hasVentilationCutouts: null,
        },
        controls: {
          dPad: null,
          analogs: [],
          faceButtons: [],
          shoulderButtons: [],
          extraButtons: [],
        },
        outputs: {
          videoOutput: null,
          audioOutput: null,
          speaker: null,
        },
        reviews: {
          videoReviews: [],
          writtenReviews: [],
        },

        pricing: {
          raw: null,
          average: null,
          range: {
            min: null,
            max: null,
          },
          currency: null,
          category: null,
          discontinued: null,
        },

        pros: [],
        cons: [],

        vendorLinks: [],
        notes: [],
      };

      $(row).find("td").each((colIndex, cell) => {
        if (colIndex === 0) {
          // get the image url
          const imageUrl = $(cell).find("img").attr("src");
          if (imageUrl) {
            device.image = {
              originalUrl: imageUrl,
              url: null, // set later
              alt: null, // set later
            };
          }
        }

        if (colIndex === 61) {
          const hrefList: { url: string; name: string }[] = [];

          // Select all <a> elements and extract the href attributes
          $(cell).find("a").each((_, element) => {
            const href = $(element).attr("href");
            const name = $(element).text().trim() ??
              (href === undefined ? "Hacking guide" : new URL(href).hostname);
            if (href) {
              hrefList.push({ url: href, name });
            }
          });
          device.hackingGuides = [...device.hackingGuides, ...hrefList];
        }

        const videoReviewLinksColumns = [62, 63, 64, 65];
        if (videoReviewLinksColumns.includes(colIndex)) {
          const hrefList: { url: string; name: string }[] = [];

          // Select all <a> elements and extract the href attributes
          $(cell).find("a").each((_, element) => {
            const href = $(element).attr("href");
            const name = $(element).text().trim() ??
              (href === undefined ? "Review" : new URL(href).hostname);
            if (href) {
              hrefList.push({ url: href, name });
            }
          });
          device.reviews.videoReviews = [
            ...device.reviews.videoReviews,
            ...hrefList,
          ];
        }

        if (colIndex === 66) {
          const hrefList: { url: string; name: string }[] = [];

          // Select all <a> elements and extract the href attributes
          $(cell).find("a").each((_, element) => {
            const href = $(element).attr("href");
            const name = $(element).text().trim() ??
              (href === undefined ? "Review" : new URL(href).hostname);
            if (href) {
              hrefList.push({ url: href, name });
            }
          });
          device.reviews.writtenReviews = [
            ...device.reviews.writtenReviews,
            ...hrefList,
          ];
        }

        const vendorLinksColumns = [68, 69, 70, 71, 72];
        if (vendorLinksColumns.includes(colIndex)) {
          const hrefList: { url: string; name: string }[] = [];

          // Select all <a> elements and extract the href attributes
          $(cell).find("a").each((_, element) => {
            const href = $(element).attr("href");
            const name = $(element).text().trim() ??
              (href === undefined ? "Vendor" : new URL(href).hostname);
            if (href) {
              hrefList.push({ url: href, name });
            }
          });
          device.vendorLinks = [...device.vendorLinks, ...hrefList];
        }

        const value = $(cell).text().trim();
        this.mapOEMsColumnToDevice(colIndex, value, device);
      });

      devices.push(device);
    });

    return devices;
  }

  private static mapHandheldsColumnToDevice(
    colIndex: number,
    value: string,
    device: Device,
  ): void {
    switch (colIndex) {
      case 0: {
        break;
      }
      case 1: {
        const sanitizedName = value.toLowerCase()
          .replaceAll(" ", "-")
          .replaceAll("?", "-question-mark-")
          .replaceAll("!", "-exclamation-mark-")
          .replaceAll("'", "-apostrophe-")
          .replaceAll("(", "-open-parenthesis-")
          .replaceAll(")", "-close-parenthesis-")
          .replaceAll("&", "-ampersand-")
          .replaceAll(":", "-colon-")
          .replaceAll(";", "-semicolon-")
          .replaceAll("/", "-slash-")
          .replaceAll("\\", "-backslash-")
          .replace(/[^a-z0-9$-_.+!*'(),]/g, "-");

        device.image = {
          ...device.image,
          url: "/devices/" + sanitizedName + ".png",
          alt: value,
        };
        device.name = {
          raw: value,
          sanitized: sanitizedName,
          normalized: value.split("(")[0].trim(),
        };
        break;
      }
      case 3:
        device.brand = value;
        break;
      case 4:
        {
          // given the date format is <year> / <month>
          // we need to convert it to a date
          const regex = /^(\d{4})\s*\/\s*(\d{1,2})$/;
          const mentionedDate = value.match(regex)?.[0];

          device.released = {
            raw: value,
            mentionedDate: mentionedDate ? new Date(mentionedDate) : null,
          };
        }
        break;
      case 5:
        device.formFactor = value;
        break;
      case 6:
        device.os = {
          raw: value,
          icons: this.parseOsIcons(value),
          list: value.split(/, | \/ /),
          links: this.getOsLinks(value),
          customFirmwares: [],
        };
        break;
      case 7:
        {
          device.performance = this.ratingsService.parsePerformanceRating(
            value,
          );
        }
        break;
      // System ratings mapping
      case 8:
        device.consoleRatings?.push({
          system: EmulationSystem.GameBoy,
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 9:
        device.consoleRatings?.push({
          system: EmulationSystem.NES,
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 10:
        device.consoleRatings?.push({
          system: EmulationSystem.Genesis,
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 11:
        device.consoleRatings?.push({
          system: EmulationSystem.GameBoyAdvance,
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 12:
        device.consoleRatings?.push({
          system: EmulationSystem.SNES,
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 13:
        device.consoleRatings?.push({
          system: EmulationSystem.PS1,
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 14:
        device.consoleRatings?.push({
          system: EmulationSystem.NintendoDS,
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 15:
        device.consoleRatings?.push({
          system: EmulationSystem.Nintendo64,
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 16:
        device.consoleRatings?.push({
          system: EmulationSystem.Dreamcast,
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 17:
        device.consoleRatings?.push({
          system: EmulationSystem.PSP,
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 18:
        device.consoleRatings?.push({
          system: EmulationSystem.Saturn,
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 19:
        device.consoleRatings?.push({
          system: EmulationSystem.GameCube,
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 20:
        device.consoleRatings?.push({
          system: EmulationSystem.Wii,
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 21:
        device.consoleRatings?.push({
          system: EmulationSystem.Nintendo3DS,
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 22:
        device.consoleRatings?.push({
          system: EmulationSystem.PS2,
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 23:
        device.consoleRatings?.push({
          system: EmulationSystem.WiiU,
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 24:
        device.consoleRatings?.push({
          system: EmulationSystem.Switch,
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 25:
        device.consoleRatings?.push({
          system: EmulationSystem.PS3,
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 26:
        device.systemOnChip = value;
        break;
      case 27:
        device.cpu.raw = value;
        device.cpu.names = value.split(", ");
        break;
      case 28:
        device.cpu.cores = parseInt(value) || null;
        break;
      case 29:
        device.cpu.threads = parseInt(value) || null;
        break;
      case 30:
        device.cpu.clockSpeed = value;
        break;
      case 31:
        device.architecture = value;
        break;
      case 32:
        device.gpu.name = value;
        break;
      case 33:
        device.gpu.cores = value;
        break;
      case 34:
        device.gpu.clockSpeed = value;
        break;
      case 35:
        device.ram = value;
        break;
      case 36:
        device.screen.size = value;
        break;
      case 37:
        device.screen.type = value;
        break;
      case 38:
        device.screen.resolution = value;
        break;
      case 39:
        device.screen.ppi = parseInt(value) || null;
        break;
      case 40:
        device.screen.aspectRatio = value;
        break;
      case 41:
        device.screen.lens = value;
        break;
      case 42:
        device.battery = value;
        break;
      case 43:
        {
          const cooling = value.toLowerCase();
          device.cooling = {
            raw: value,
            hasHeatsink: cooling.includes("heatsink") ||
              cooling.includes("heat sink"),
            hasFan: cooling.includes("fan"),
            hasHeatPipe: cooling.includes("heatpipe") ||
              cooling.includes("heat pipe"),
            hasVentilationCutouts: cooling.includes("ventilation cutouts"),
          };
        }
        break;
      case 44:
        device.controls.dPad = value;
        break;
      case 45:
        device.controls.analogs = value.split(", ");
        break;
      case 46:
        device.controls.faceButtons = value.split(", ");
        break;
      case 47:
        device.controls.shoulderButtons = value.split(", ");
        break;
      case 48:
        device.controls.extraButtons = value.split(", ");
        break;
      case 49:
        device.chargePort = value;
        break;
      case 50:
        device.storage = value;
        break;
      case 51: {
        const connectivity = value.toLowerCase();
        device.connectivity = {
          hasWifi: connectivity.includes("wifi") ||
            connectivity.includes("wi-fi"),
          hasBluetooth: connectivity.includes("bluetooth"),
          hasNFC: connectivity.includes("nfc"),
          hasUSB: connectivity.includes("usb"),
          hasUSBC: connectivity.includes("usbc") ||
            connectivity.includes("usb-c"),
          hasDisplayPort: connectivity.includes("displayport"),
          hasVGA: connectivity.includes("vga"),
          hasDVI: connectivity.includes("dvi"),
          hasHDMI: connectivity.includes("hdmi"),
        };
        break;
      }
      case 52:
        device.connectivity.hasHDMI = value.includes("HDMI");
        device.outputs.videoOutput = value;
        break;
      case 53:
        device.outputs.audioOutput = value;
        break;
      case 54:
        device.outputs.speaker = value;
        break;
      case 55:
        device.rumble = value;
        break;
      case 56:
        device.sensors = value.split(", ");
        break;
      case 57:
        device.volumeControl = value;
        break;
      case 58:
        device.brightnessControl = value;
        break;
      case 59:
        device.powerControl = value;
        break;
      case 60:
        device.dimensions = {
          length: value.split(" x ")[0],
          width: value.split(" x ")[1],
          height: value.split(" x ")[2],
        };
        break;
      case 61:
        device.weight = value;
        break;
      case 62:
        device.shellMaterial = value;
        break;
      case 63:
        device.colors = value.split(", ");
        break;
      case 70: {
        break;
      }
      case 71: {
        const priceRange = this.parsePriceRange(value);
        const averagePrice = (priceRange.min + priceRange.max) / 2;
        device.pricing = {
          ...device.pricing,

          average: averagePrice,
          category: this.getPricingCategory(averagePrice),
          raw: value,
          range: {
            min: priceRange.min,
            max: priceRange.max,
          },
          currency: this.getPriceCurrency(value),
        };

        break;
      }
      case 72:
      case 73:
      case 74:
      case 75:
      case 76:
        break;
      case 77:
        device.pros = value.split(", ").filter((pro) => pro.trim() !== "");
        break;
      case 78:
        device.cons = value.split(", ").filter((con) => con.trim() !== "");
        break;
      case 79:
        device.performance.emulationLimit = value;
        break;
      case 80:
        device.notes = value.split(", ");
        break;
    }
  }

  private static mapOEMsColumnToDevice(
    colIndex: number,
    value: string,
    device: Device,
  ): void {
    switch (colIndex) {
      case 0: {
        break;
      }
      case 1: {
        const sanitizedName = value.toLowerCase()
          .replaceAll(" ", "-")
          .replaceAll("?", "-question-mark-")
          .replaceAll("!", "-exclamation-mark-")
          .replaceAll("'", "-apostrophe-")
          .replaceAll("(", "-open-parenthesis-")
          .replaceAll(")", "-close-parenthesis-")
          .replaceAll("&", "-ampersand-")
          .replaceAll(":", "-colon-")
          .replaceAll(";", "-semicolon-")
          .replaceAll("/", "-slash-")
          .replaceAll("\\", "-backslash-")
          .replace(/[^a-z0-9$-_.+!*'(),]/g, "-");

        device.image = {
          ...device.image,
          url: "/devices/" + sanitizedName + ".png",
          alt: value,
        };
        device.name = {
          raw: value,
          sanitized: sanitizedName,
          normalized: value.split("(")[0].trim(),
        };
        break;
      }
      case 3:
        device.brand = value;
        break;
      case 4:
        {
          // given the date format is <year> / <month>
          // we need to convert it to a date
          const regex = /^(\d{4})\s*\/\s*(\d{1,2})$/;
          const mentionedDate = value.match(regex)?.[0];

          device.released = {
            raw: value,
            mentionedDate: mentionedDate ? new Date(mentionedDate) : null,
          };
        }
        break;
      case 5:
        device.formFactor = value;
        break;
      case 6:
        device.os = {
          raw: value,
          icons: this.parseOsIcons(value),
          list: value.split(/, | \/ /),
          customFirmwares: [],
          links: [],
        };
        break;
      case 7: // custom firmware
        device.os.customFirmwares = value.split(", ");
        break;
      case 8: // performance
        device.performance = this.ratingsService.parsePerformanceRating(value);
        break;
        // System ratings mapping
      case 9:
        device.consoleRatings?.push({
          system: EmulationSystem.GameBoy,
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 10:
        device.consoleRatings?.push({
          system: EmulationSystem.NES,
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 11:
        device.consoleRatings?.push({
          system: EmulationSystem.Genesis,
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 12:
        device.consoleRatings?.push({
          system: EmulationSystem.GameBoyAdvance,
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 13:
        device.consoleRatings?.push({
          system: EmulationSystem.SNES,
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 14:
        device.consoleRatings?.push({
          system: EmulationSystem.PS1,
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 15:
        device.consoleRatings?.push({
          system: EmulationSystem.NintendoDS,
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 16:
        device.consoleRatings?.push({
          system: EmulationSystem.Nintendo64,
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 17:
        device.consoleRatings?.push({
          system: EmulationSystem.Dreamcast,
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 18:
        device.consoleRatings?.push({
          system: EmulationSystem.PSP,
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 19:
        device.consoleRatings?.push({
          system: EmulationSystem.Saturn,
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 20:
        device.consoleRatings?.push({
          system: EmulationSystem.GameCube,
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 21:
        device.consoleRatings?.push({
          system: EmulationSystem.Wii,
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 22:
        device.consoleRatings?.push({
          system: EmulationSystem.Nintendo3DS,
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 23:
        device.consoleRatings?.push({
          system: EmulationSystem.PS2,
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 24:
        device.consoleRatings?.push({
          system: EmulationSystem.WiiU,
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 25:
        device.consoleRatings?.push({
          system: EmulationSystem.Switch,
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 26:
        device.systemOnChip = value;
        break;
      case 27:
        device.cpu.raw = value;
        device.cpu.names = value.split(", ");
        break;
      case 28:
        device.cpu.cores = parseInt(value) || null;
        break;
      case 29:
        device.cpu.clockSpeed = value;
        break;
      case 30:
        device.architecture = value;
        break;
      case 31:
        device.gpu.name = value;
        break;
      case 32:
        device.gpu.clockSpeed = value;
        break;
      case 33:
        device.ram = value;
        break;
      case 34:
        device.screen.size = value;
        break;
      case 35:
        device.screen.type = value;
        break;
      case 36:
        device.screen.resolution = value;
        break;
      case 37:
        device.screen.aspectRatio = value;
        break;
      case 38:
        device.screen.lens = value;
        break;
      case 39:
        device.battery = value;
        break;
      case 40:
        {
          const cooling = value.toLowerCase();
          device.cooling = {
            raw: value,
            hasHeatsink: cooling.includes("heatsink") ||
              cooling.includes("heat sink"),
            hasFan: cooling.includes("fan"),
            hasHeatPipe: cooling.includes("heat pipe") ||
              cooling.includes("heat pipe"),
            hasVentilationCutouts: cooling.includes("ventilation cutouts"),
          };
        }
        break;
      case 41:
        device.controls.dPad = value;
        break;
      case 42:
        device.controls.analogs = value.split(", ");
        break;
      case 43:
        device.controls.faceButtons = value.split(", ");
        break;
      case 44:
        device.controls.shoulderButtons = value.split(", ");
        break;
      case 45:
        device.controls.extraButtons = value.split(", ");
        break;
      case 46:
        device.chargePort = value;
        break;
      case 47:
        device.storage = value;
        break;
      case 48:
        device.sensors = value.split(", ");
        break;
      case 49: {
        const connectivity = value.toLowerCase();
        device.connectivity = {
          hasWifi: connectivity.includes("wifi") ||
            connectivity.includes("wi-fi"),
          hasBluetooth: connectivity.includes("bluetooth"),
          hasNFC: connectivity.includes("nfc"),
          hasUSB: connectivity.includes("usb"),
          hasUSBC: connectivity.includes("usb-c") ||
            connectivity.includes("usbc"),
          hasDisplayPort: connectivity.includes("displayport"),
          hasVGA: connectivity.includes("vga"),
          hasDVI: connectivity.includes("dvi"),
          hasHDMI: connectivity.includes("hdmi"),
        };
        break;
      }
      case 50:
        device.connectivity.hasHDMI = value.includes("HDMI");
        device.connectivity.hasUSBC = value.includes("USB");
        device.outputs.videoOutput = value;
        break;
      case 51:
        device.outputs.audioOutput = value;
        break;
      case 52:
        device.outputs.speaker = value;
        break;
      case 53:
        device.rumble = value;
        break;
      case 54:
        device.lowBatteryIndicator = value;
        break;
      case 55:
        device.volumeControl = value;
        break;
      case 56:
        device.brightnessControl = value;
        break;
      case 57:
        device.powerControl = value;
        break;
      case 58:
        device.dimensions = {
          length: value.split(" x ")[0],
          width: value.split(" x ")[1],
          height: value.split(" x ")[2],
        };
        break;
      case 59:
        device.weight = value;
        break;
      case 60:
        device.colors = value.split(", ");
        break;

      case 67: {
        if (value.toLowerCase().includes("discontinued")) {
          device.pricing = {
            ...device.pricing,
            raw: value,
            discontinued: true,
          };
          break;
        }

        const priceRange = this.parsePriceRange(value);
        const averagePrice = (priceRange.min + priceRange.max) / 2;
        device.pricing = {
          ...device.pricing,
          average: averagePrice,
          category: this.getPricingCategory(averagePrice),
          raw: value,
          discontinued: false,
          range: {
            min: priceRange.min,
            max: priceRange.max,
          },
          currency: this.getPriceCurrency(value),
        };

        break;
      }

      case 73:
        device.pros = value.split(", ").filter((pro) => pro.trim() !== "");
        break;
      case 74:
        device.cons = value.split(", ").filter((con) => con.trim() !== "");
        break;
      case 75:
        device.performance.emulationLimit = value;
        break;
      case 76:
        device.notes = value.split(", ");
        break;
    }
  }
}
