import { Device } from "../../data/models/device.model.ts";
import { RatingsService } from "./ratings.service.ts";

export class DeviceService {
  private devices: Device[] = [];
  private static instance: DeviceService;
  private ratingsService = RatingsService.getInstance();
  private personalPicks: string[] = [
    "rg-405m",
    "miyoo-mini-plus",
    "rg-35xx-sp",
    "retroid-pocket-5",
    "retroid-pocket-mini",
    "steam-deck-oled",
    "miyoo-flip",
    "rg-34xx",
    "trimui-smart-brick",
  ];

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
      );
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
    sortBy:
      | "all"
      | "highly-rated"
      | "new-arrivals" = "all",
    filter:
      | "all"
      | "upcoming"
      | "personal-picks" = "all",
    pageNumber: number = 1,
    pageSize: number = 9,
  ): { page: Device[]; totalAmountOfResults: number } {
    const lowerQuery = query.toLowerCase();

    let filteredDevices = this.devices.filter((device) => {
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

    // not rly sorting, just filtering, rename later
    if (filter === "upcoming") {
      filteredDevices = filteredDevices.filter((device) =>
        device.released.raw.toLowerCase().includes("upcoming")
      );
    } else {
      filteredDevices = filteredDevices.filter((device) =>
        !device.released.raw.toLowerCase().includes("upcoming")
      );
    }

    // not rly sorting, just filtering, rename later
    if (filter === "personal-picks") {
      filteredDevices = filteredDevices.filter((device) =>
        this.personalPicks.includes(device.name.sanitized)
      );
    }

    const sortedDevices = filteredDevices.sort((a, b) => {
      switch (sortBy) {
        case "new-arrivals":
          return a.released.mentionedDate - b.released.mentionedDate ?? -1;
        case "highly-rated":
          return b.performance?.normalizedRating -
              a.performance?.normalizedRating ?? -1;
        case "personal-picks":
          return (
            this.personalPicks.indexOf(a.name.sanitized) -
            this.personalPicks.indexOf(b.name.sanitized)
          );
        default:
          return 0;
      }
    });

    const devicesToReturn = sortedDevices.slice(
      (pageNumber - 1) * pageSize,
      pageNumber * pageSize,
    );

    return {
      page: devicesToReturn,
      totalAmountOfResults: sortedDevices.length,
    };
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

  public getpersonalPicks(): Device[] {
    return this.devices
      .filter((device) => this.personalPicks.includes(device.name.sanitized))
      .sort((a, b) =>
        this.personalPicks.indexOf(a.name.sanitized) -
        this.personalPicks.indexOf(b.name.sanitized)
      )
      .slice(0, 4);
  }

  public getNewArrivals(): Device[] {
    const currentYear = new Date().getFullYear();
    return this.devices
      .filter((device) => {
        if (!device.released.mentionedDate) return false;
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
      .filter((device) =>
        device.performance?.normalizedRating >= 9.0 &&
        !device.released.raw.toLowerCase().includes("upcoming")
      )
      .sort((a, b) =>
        b.performance?.normalizedRating -
        a.performance?.normalizedRating
      )
      .slice(0, 4);
  }
}
