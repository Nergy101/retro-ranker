import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";
import { Device } from "../device.model.ts";
import { RatingsService } from "../services/ratings.service.ts";

export class DeviceParser {
  private static ratingsService = RatingsService.getInstance();

  private static parseOsIcons(os: string): string[] {
    const lowerOs = os.toLowerCase();
    const icons: string[] = [];

    if (lowerOs.includes("android")) icons.push("ph ph-android-logo");
    if (lowerOs.includes("ios")) icons.push("ph ph-apple-logo");
    if (lowerOs.includes("windows")) icons.push("ph ph-windows-logo");
    if (lowerOs.includes("macos")) icons.push("ph ph-apple-logo");
    if (lowerOs.includes("linux")) icons.push("ph ph-linux-logo");

    return icons.length ? icons : ["ph ph-question"];
  }

  private static parsePrices(priceText: string): number {
    const priceNumber = priceText.match(/\d+/)?.[0];
    return priceNumber ? parseInt(priceNumber) : 0;
  }

  private static getPricingCategory(priceText: string): string {
    if (priceText.includes("Discontinued")) return "discontinued";

    const priceNumber = this.parsePrices(priceText);
    if (priceNumber === 0) return "unknown";
    if (priceNumber < 100) return "budget";
    if (priceNumber < 200) return "mid-range";
    return "high-end";
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
      const device: Partial<Device> = {
        systemRatings: [],
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
      };

      $(row).find("td").each((colIndex, cell) => {
        const value = $(cell).text().trim();
        this.mapColumnToDevice(colIndex, value, device);
      });

      devices.push(device as Device);
    });

    // filter out devices that have too much information missing
    return devices.filter((device) => {
      return (
        device.name !== "" ||
        device.brand !== "" 
      );
    });
  }

  private static mapColumnToDevice(
    colIndex: number,
    value: string,
    device: Partial<Device>,
  ): void {
    switch (colIndex) {
      case 0:
        break;
      case 1: {
        const sanitizedName = value.toLowerCase().replace(/[^a-z0-9]/g, "-");
        device.imageUrl = "/devices/" + sanitizedName + ".png";
        device.sanitizedName = sanitizedName;
        device.name = value;
        break;
      }
      case 3:
        device.brand = value;
        break;
      case 4:
        {
          // find any date or year in the string
          const mentionedDate = value.match(/\d{4}|\d{2}\/\d{2}\/\d{4}/)?.[0];

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
        device.os = value;
        device.osIcons = this.parseOsIcons(value);
        break;
      case 7:
        device.performanceRating = this.ratingsService.parsePerformanceRating(
          value,
        );
        break;
      // System ratings mapping
      case 8:
        device.systemRatings?.push({
          system: "Game Boy",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 9:
        device.systemRatings?.push({
          system: "NES",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 10:
        device.systemRatings?.push({
          system: "Genesis",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 11:
        device.systemRatings?.push({
          system: "Game Boy Advance",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 12:
        device.systemRatings?.push({
          system: "SNES",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 13:
        device.systemRatings?.push({
          system: "PS1",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 14:
        device.systemRatings?.push({
          system: "Nintendo DS",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 15:
        device.systemRatings?.push({
          system: "Nintendo 64",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 16:
        device.systemRatings?.push({
          system: "Dreamcast",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 17:
        device.systemRatings?.push({
          system: "PSP",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 18:
        device.systemRatings?.push({
          system: "Saturn",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 19:
        device.systemRatings?.push({
          system: "GameCube",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 20:
        device.systemRatings?.push({
          system: "Wii",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 21:
        device.systemRatings?.push({
          system: "3DS",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 22:
        device.systemRatings?.push({
          system: "PS2",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 23:
        device.systemRatings?.push({
          system: "Wii U",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 24:
        device.systemRatings?.push({
          system: "Switch",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 25:
        device.systemRatings?.push({
          system: "PS3",
          rating: this.ratingsService.parseSystemRating(value),
        });
        break;
      case 26:
        device.systemOnChip = value;
        break;
      case 27:
        device.cpu = value;
        break;
      case 28:
        device.cpuCores = parseInt(value) || 0;
        break;
      case 29:
        device.cpuThreads = parseInt(value) || 0;
        break;
      case 30:
        device.cpuClockSpeed = value;
        break;
      case 31:
        device.architecture = value;
        break;
      case 32:
        device.gpu = value;
        break;
      case 33:
        device.gpuCores = value;
        break;
      case 34:
        device.gpuClockSpeed = value;
        break;
      case 35:
        device.ram = value;
        break;
      case 36:
        device.screenSize = value;
        break;
      case 37:
        device.screenType = value;
        break;
      case 38:
        device.resolution = value;
        break;
      case 39:
        device.ppi = parseInt(value) || 0;
        break;
      case 40:
        device.aspectRatio = value;
        break;
      case 41:
        device.screenLens = value;
        break;
      case 42:
        device.battery = value;
        break;
      case 43:
        device.cooling = value;
        break;
      case 44:
        device.dPad = value;
        break;
      case 45:
        device.analogs = value;
        break;
      case 46:
        device.faceButtons = value;
        break;
      case 47:
        device.shoulderButtons = value;
        break;
      case 48:
        device.extraButtons = value;
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
        device.videoOutput = value;
        break;
      case 53:
        device.audioOutput = value;
        break;
      case 54:
        device.speaker = value;
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
        device.colors = value;
        break;
      case 71:
        device.price = value;
        device.pricingCategory = this.getPricingCategory(value);
        break;
    }
  }
}
