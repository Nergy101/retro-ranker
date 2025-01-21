import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";
import { RatingsService } from "../../services/devices/ratings.service.ts";
import { EmulationTier } from "../enums/EmulationTier.ts";
import { Device } from "../models/device.model.ts";

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

    return icons.length ? icons : ["ph-empty"];
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
    if (priceNumber <= 250) return "mid";
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
        },
        systemOnChip: "",
        architecture: "",
        ram: "",
        rumble: "",
        sensors: "",
        volumeControl: "",
        brightnessControl: "",
        powerControl: "",
        battery: "",
        chargePort: "",
        storage: "",
        dimensions: "",
        weight: "",
        shellMaterial: "",
        colors: [],
        brand: "",
        image: {
          originalUrl: "",
          url: null,
          alt: null,
        },
        released: {
          raw: "",
          mentionedDate: null,
        },
        formFactor: "",
        os: {
          raw: "",
          list: [],
          icons: [],
        },
        consoleRatings: [],
        connectivity: {
          hasWifi: false,
          hasBluetooth: false,
          hasNFC: false,
          hasUSB: false,
          hasDisplayPort: false,
          hasVGA: false,
          hasDVI: false,
          hasHDMI: false,
        },
        cpu: {
          name: "",
          cores: 0,
          threads: 0,
          clockSpeed: "",
        },
        gpu: {
          name: "",
          cores: "",
          clockSpeed: "",
        },
        performance: {
          tier: EmulationTier.Unknown,
          rating: 0,
          normalizedRating: 0,
          maxEmulation: "",
          emulationLimit: "",
        },
        screen: {
          size: "",
          type: "",
          resolution: "",
          ppi: 0,
          aspectRatio: "",
          lens: "",
        },
        cooling: {
          raw: "",
          hasHeatsink: false,
          hasHeatPipe: false,
          hasFan: false,
          hasVentilationCutouts: false,
        },
        controls: {
          dPad: "",
          analogs: "",
          faceButtons: "",
          shoulderButtons: "",
          extraButtons: "",
        },
        outputs: {
          videoOutput: "",
          audioOutput: "",
          speaker: "",
        },
        reviews: {
          videoReviews: [],
          writtenReviews: [],
        },

        pricing: {
          raw: "",
          average: 0,
          range: {
            min: 0,
            max: 0,
          },
          currency: "",
          category: "",
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
          const hrefList: string[] = [];

          // Select all <a> elements and extract the href attributes
          $(cell).find("a").each((_, element) => {
            const href = $(element).attr("href");
            if (href) {
              hrefList.push(href);
            }
          });
          device.vendorLinks = hrefList;
        }

        if (colIndex === 73) {
          const hrefList: string[] = [];

          // Select all <a> elements and extract the href attributes
          $(cell).find("a").each((_, element) => {
            const href = $(element).attr("href");
            if (href) {
              hrefList.push(href);
            }
          });
          device.reviews.writtenReviews = hrefList;
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
        },
        systemOnChip: "",
        architecture: "",
        ram: "",
        rumble: "",
        sensors: "",
        volumeControl: "",
        brightnessControl: "",
        powerControl: "",
        battery: "",
        chargePort: "",
        storage: "",
        dimensions: "",
        weight: "",
        shellMaterial: "",
        colors: [],
        brand: "",
        image: {
          originalUrl: "",
          url: null,
          alt: null,
        },
        released: {
          raw: "",
          mentionedDate: null,
        },
        formFactor: "",
        os: {
          raw: "",
          list: [],
          icons: [],
        },
        consoleRatings: [],
        connectivity: {
          hasWifi: false,
          hasBluetooth: false,
          hasNFC: false,
          hasUSB: false,
          hasDisplayPort: false,
          hasVGA: false,
          hasDVI: false,
          hasHDMI: false,
        },
        cpu: {
          name: "",
          cores: 0,
          threads: 0,
          clockSpeed: "",
        },
        gpu: {
          name: "",
          cores: "",
          clockSpeed: "",
        },
        performance: {
          tier: EmulationTier.Unknown,
          rating: 0,
          normalizedRating: 0,
          maxEmulation: "",
          emulationLimit: "",
        },
        screen: {
          size: "",
          type: "",
          resolution: "",
          ppi: 0,
          aspectRatio: "",
          lens: "",
        },
        cooling: {
          raw: "",
          hasHeatsink: false,
          hasHeatPipe: false,
          hasFan: false,
          hasVentilationCutouts: false,
        },
        controls: {
          dPad: "",
          analogs: "",
          faceButtons: "",
          shoulderButtons: "",
          extraButtons: "",
        },
        outputs: {
          videoOutput: "",
          audioOutput: "",
          speaker: "",
        },
        reviews: {
          videoReviews: [],
          writtenReviews: [],
        },

        pricing: {
          raw: "",
          average: 0,
          range: {
            min: 0,
            max: 0,
          },
          currency: "",
          category: "",
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
          system: "Game Boy",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 9:
        device.consoleRatings?.push({
          system: "NES",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 10:
        device.consoleRatings?.push({
          system: "Genesis",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 11:
        device.consoleRatings?.push({
          system: "Game Boy Advance",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 12:
        device.consoleRatings?.push({
          system: "SNES",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 13:
        device.consoleRatings?.push({
          system: "PS1",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 14:
        device.consoleRatings?.push({
          system: "Nintendo DS",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 15:
        device.consoleRatings?.push({
          system: "Nintendo 64",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 16:
        device.consoleRatings?.push({
          system: "Dreamcast",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 17:
        device.consoleRatings?.push({
          system: "PSP",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 18:
        device.consoleRatings?.push({
          system: "Saturn",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 19:
        device.consoleRatings?.push({
          system: "GameCube",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 20:
        device.consoleRatings?.push({
          system: "Wii",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 21:
        device.consoleRatings?.push({
          system: "3DS",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 22:
        device.consoleRatings?.push({
          system: "PS2",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 23:
        device.consoleRatings?.push({
          system: "Wii U",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 24:
        device.consoleRatings?.push({
          system: "Switch",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 25:
        device.consoleRatings?.push({
          system: "PS3",
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
        device.cpu.cores = parseInt(value) || 0;
        break;
      case 29:
        device.cpu.threads = parseInt(value) || 0;
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
        device.screen.ppi = parseInt(value) || 0;
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
            hasHeatsink: cooling.includes("heatsink"),
            hasFan: cooling.includes("fan"),
            hasHeatPipe: cooling.includes("heat pipe"),
            hasVentilationCutouts: cooling.includes("ventilation cutouts"),
          };
        }
        break;
      case 44:
        device.controls.dPad = value;
        break;
      case 45:
        device.controls.analogs = value;
        break;
      case 46:
        device.controls.faceButtons = value;
        break;
      case 47:
        device.controls.shoulderButtons = value;
        break;
      case 48:
        device.controls.extraButtons = value;
        break;
      case 49:
        device.chargePort = value;
        break;
      case 50:
        device.storage = value;
        break;
      case 51:
        device.connectivity = {
          hasWifi: value.includes("WiFi"),
          hasBluetooth: value.includes("Bluetooth"),
          hasNFC: value.includes("NFC"),
          hasUSB: value.includes("USB"),
          hasDisplayPort: value.includes("DisplayPort"),
          hasVGA: value.includes("VGA"),
          hasDVI: value.includes("DVI"),
          hasHDMI: value.includes("HDMI"),
        };
        break;
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
        device.sensors = value;
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
        device.dimensions = value;
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
          system: "Game Boy",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 10:
        device.consoleRatings?.push({
          system: "NES",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 11:
        device.consoleRatings?.push({
          system: "Genesis",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 12:
        device.consoleRatings?.push({
          system: "Game Boy Advance",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 13:
        device.consoleRatings?.push({
          system: "SNES",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 14:
        device.consoleRatings?.push({
          system: "PS1",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 15:
        device.consoleRatings?.push({
          system: "Nintendo DS",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 16:
        device.consoleRatings?.push({
          system: "Nintendo 64",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 17:
        device.consoleRatings?.push({
          system: "Dreamcast",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 18:
        device.consoleRatings?.push({
          system: "PSP",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 19:
        device.consoleRatings?.push({
          system: "Saturn",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 20:
        device.consoleRatings?.push({
          system: "GameCube",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 21:
        device.consoleRatings?.push({
          system: "Wii",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 22:
        device.consoleRatings?.push({
          system: "3DS",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 23:
        device.consoleRatings?.push({
          system: "PS2",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 24:
        device.consoleRatings?.push({
          system: "Wii U",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 25:
        device.consoleRatings?.push({
          system: "Switch",
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
        device.cpu.cores = parseInt(value) || 0;
        break;
      case 29:
        device.cpu.threads = parseInt(value) || 0;
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
      // case 33:
      //   device.gpu.cores = value;
      //   break;
      case 33:
        device.gpu.clockSpeed = value;
        break;
      case 34:
        device.ram = value;
        break;
      case 35:
        device.screen.size = value;
        break;
      case 36:
        device.screen.type = value;
        break;
      case 37:
        device.screen.resolution = value;
        break;
      // case 40:
      //   device.screen.ppi = parseInt(value) || 0;
      //   break;
      case 38:
        device.screen.aspectRatio = value;
        break;
      case 39:
        device.screen.lens = value;
        break;
      case 40:
        device.battery = value;
        break;
      case 41:
        {
          const cooling = value.toLowerCase();
          device.cooling = {
            raw: value,
            hasHeatsink: cooling.includes("heatsink"),
            hasFan: cooling.includes("fan"),
            hasHeatPipe: cooling.includes("heat pipe"),
            hasVentilationCutouts: cooling.includes("ventilation cutouts"),
          };
        }
        break;
      case 42:
        device.controls.dPad = value;
        break;
      case 43:
        device.controls.analogs = value;
        break;
      case 44:
        device.controls.faceButtons = value;
        break;
      case 45:
        device.controls.shoulderButtons = value;
        break;
      case 46:
        device.controls.extraButtons = value;
        break;
      case 47:
        device.chargePort = value;
        break;
      case 48:
        device.storage = value;
        break;
      case 49:
        device.sensors = value;
        break;
      case 50:
        device.connectivity = {
          hasWifi: value.includes("WiFi"),
          hasBluetooth: value.includes("Bluetooth"),
          hasNFC: value.includes("NFC"),
          hasUSB: value.includes("USB"),
          hasDisplayPort: value.includes("DisplayPort"),
          hasVGA: value.includes("VGA"),
          hasDVI: value.includes("DVI"),
          hasHDMI: value.includes("HDMI"),
        };
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
      // case 52:
      //   device.connectivity.hasHDMI = value.includes("HDMI");
      //   device.outputs.videoOutput = value;
      //   break;
      case 56:
        device.brightnessControl = value;
        break;
      case 57:
        device.powerControl = value;
        break;
      case 58:
        device.dimensions = value;
        break;
      case 59:
        device.weight = value;
        break;
      case 60:
        device.colors = value.split(", ");
        break;
      // case 63:
      //   device.shellMaterial = value;
      //   break;
      case 67: {
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
      case 78:
        device.pros = value.split(", ").filter((pro) => pro.trim() !== "");
        break;
      case 79:
        device.cons = value.split(", ").filter((con) => con.trim() !== "");
        break;
      case 80:
        device.performance.emulationLimit = value;
        break;
      case 81:
        device.notes = value.split(", ");
        break;
    }
  }
}
