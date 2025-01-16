import { Device } from "./device.model.ts";
import { DeviceParser } from "./parsers/device.parser.ts";
import { RatingsService } from "./services/ratings.service.ts";

export class DeviceService {
  private devices: Device[] = [];
  private static instance: DeviceService;
  private ratingsService = RatingsService.getInstance();

  private constructor() {
    this.loadDevices();
  }

  public static getInstance(): DeviceService {
    if (!DeviceService.instance) {
      DeviceService.instance = new DeviceService();
    }
    return DeviceService.instance;
  }

  private loadDevices(): void {
    try {
      this.devices = DeviceParser.parseHandheldsHtml("data/handhelds.html");
    } catch (error) {
      console.error("Failed to load devices:", error);
      this.devices = [];
    }
    console.info("Loaded devices:", this.devices.length);
  }

  public getAllDevices(): Device[] {
    return this.devices;
  }

  public searchDevices(
    query: string,
    category: "all" | "budget" | "high-end" | "mid-range" = "all",
  ): Device[] {
    const lowerQuery = query.toLowerCase();

    return this.devices.filter((device) => {
      if (category === "budget") {
        return device.price.pricingCategory === "budget" &&
            device.name.toLowerCase().includes(lowerQuery) ||
          device.brand.toLowerCase().includes(lowerQuery) ||
          device.os.raw.toLowerCase().includes(lowerQuery);
      }

      if (category === "high-end") {
        return device.price.pricingCategory === "high-end" &&
            device.name.toLowerCase().includes(lowerQuery) ||
          device.brand.toLowerCase().includes(lowerQuery) ||
          device.os.raw.toLowerCase().includes(lowerQuery);
      }

      if (category === "mid-range") {
        return (
          device.price.pricingCategory === "mid-range" &&
          (device.name.toLowerCase().includes(lowerQuery) ||
            device.brand.toLowerCase().includes(lowerQuery) ||
            device.os.raw.toLowerCase().includes(lowerQuery))
        );
      }

      return (
        device.name.toLowerCase().includes(lowerQuery) ||
        device.brand.toLowerCase().includes(lowerQuery) ||
        device.os.raw.toLowerCase().includes(lowerQuery)
      );
    });
  }

  public getDeviceByName(name: string): Device | undefined {
    return this.devices.find((device) => device.sanitizedName === name);
  }

  public getSimilarDevices(
    sanitizedName: string | null,
    limit: number = 4,
  ): Device[] {
    if (!sanitizedName) return [];

    const currentDevice = this.getDeviceByName(sanitizedName);
    if (!currentDevice) return [];

    return this.devices
      .filter((device) => device.sanitizedName !== sanitizedName)
      .sort((a, b) => {
        const scoreA = this.ratingsService.getSimilarityScore(a, currentDevice);
        const scoreB = this.ratingsService.getSimilarityScore(b, currentDevice);
        return scoreB - scoreA;
      })
      .slice(0, limit);
  }

  public getStaffPicks(): Device[] {
    const staffPicks = [
      "rg-405m",
      "miyoo-mini-plus",
      "rg-35xx-sp",
      "steam-deck-oled",
    ];

    return this.devices
      .filter((device) => staffPicks.includes(device.sanitizedName))
      .slice(0, 4);
  }

  public getNewArrivals(): Device[] {
    const currentYear = new Date().getFullYear();
    return this.devices
      .filter((device) =>
        device.released.mentionedDate?.getFullYear() === currentYear ||
        new Date().getFullYear() ||
        device.released.mentionedDate?.getFullYear() === currentYear - 1
      )
      .sort((a, b) => {
        const aYear = a.released.mentionedDate?.getFullYear() || 0;
        const bYear = b.released.mentionedDate?.getFullYear() || 0;
        return bYear - aYear;
      })
      .slice(0, 4);
  }

  public getUpcoming(): Device[] {
    return this.devices
      .filter((device) =>
        device.released.raw.toLowerCase().includes("upcoming")
      )
      .slice(0, 4);
  }

  public getHighlyRated(): Device[] {
    return this.devices
      .filter((device) => device.performanceRating.normalizedRating >= 9.0)
      .sort((a, b) =>
        b.performanceRating.normalizedRating -
        a.performanceRating.normalizedRating
      )
      .slice(0, 4);
  }
}
