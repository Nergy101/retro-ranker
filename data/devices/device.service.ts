import { Device } from "../models/device.model.ts";
import { DeviceParser } from "../source/device.parser.ts";
import { RatingsService } from "./ratings.service.ts";

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
      this.devices = JSON.parse(
        Deno.readTextFileSync("data/source/results/handhelds.json"),
      ); // DeviceParser.parseHandheldsHtml("data/handhelds.html");
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
    category: "all" | "low" | "mid" | "high" = "all",
  ): Device[] {
    const lowerQuery = query.toLowerCase();

    return this.devices.filter((device) => {
      if (category === "low") {
        return device.pricing.category === "low" && (
          device.name.sanitized.toLowerCase().includes(lowerQuery) ||
          device.brand.toLowerCase().includes(lowerQuery) ||
          device.os.raw.toLowerCase().includes(lowerQuery)
        );
      }

      if (category === "mid") {
        return device.pricing.category === "mid" && (
          device.name.sanitized.toLowerCase().includes(lowerQuery) ||
          device.brand.toLowerCase().includes(lowerQuery) ||
          device.os.raw.toLowerCase().includes(lowerQuery)
        );
      }

      if (category === "high") {
        return (
          device.pricing.category === "high" &&
          (device.name.sanitized.toLowerCase().includes(lowerQuery) ||
            device.brand.toLowerCase().includes(lowerQuery) ||
            device.os.raw.toLowerCase().includes(lowerQuery))
        );
      }

      return (
        device.name.sanitized.toLowerCase().includes(lowerQuery) ||
        device.brand.toLowerCase().includes(lowerQuery) ||
        device.os.raw.toLowerCase().includes(lowerQuery)
      );
    });
  }

  public getDeviceByName(sanitizedName: string): Device | undefined {
    return this.devices.find((device) =>
      device.name.sanitized === sanitizedName
    );
  }

  public getSimilarDevices(
    sanitizedName: string | null,
    limit: number = 4,
  ): Device[] {
    if (!sanitizedName) return [];

    const currentDevice = this.getDeviceByName(sanitizedName);
    if (!currentDevice) return [];

    return this.devices
      .filter((device) => device.name.sanitized !== sanitizedName)
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
      .filter((device) => staffPicks.includes(device.name.sanitized))
      .slice(0, 4);
  }

  public getNewArrivals(): Device[] {
    const currentYear = new Date().getFullYear();
    return this.devices
      .filter((device) => {
        const mentionedDate = new Date(device.released.mentionedDate);
        if (!mentionedDate) return false;
        const year = mentionedDate.getFullYear();
        return year === currentYear || year === currentYear - 1;
      })
      .sort((a, b) => {
        const aYear = a.released.mentionedDate?.getFullYear?.() || 0;
        const bYear = b.released.mentionedDate?.getFullYear?.() || 0;
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
      .filter((device) => device.performance?.normalizedRating >= 9.0)
      .sort((a, b) =>
        b.performance?.normalizedRating -
        a.performance?.normalizedRating
      )
      .slice(0, 4);
  }
}
