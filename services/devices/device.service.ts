// deno-lint-ignore-file no-console
import {
  PiAndroidLogo,
  PiAppleLogo,
  PiBracketsAngle,
  PiBracketsCurly,
  PiBracketsRound,
  PiBracketsSquare,
  PiCheckCircleFill,
  PiCode,
  PiEmpty,
  PiFactory,
  PiFan,
  PiJoystick,
  PiLinuxLogo,
  PiListThin,
  PiMinusSquare,
  PiPipe,
  PiQuestionFill,
  PiRainbow,
  PiScissors,
  PiSteamLogo,
  PiTabs,
  PiWindowsLogo,
  PiXCircle,
} from "@preact-icons/pi";
import { JSX, VNode } from "preact";
import { Device } from "../../data/device.model.ts";
import { Cooling } from "../../data/models/cooling.model.ts";
import { TagModel } from "../../data/models/tag.model.ts";
import { RatingsService } from "./ratings.service.ts";
import { personalPicks } from "../../data/personal-picks.ts";
import {
  EmulationSystem,
  EmulationSystemOrder,
} from "../../data/enums/EmulationSystem.ts";
import { SystemRating } from "../../data/models/system-rating.model.ts";
export class DeviceService {
  private devices: Device[] = [];
  private tags: TagModel[] = [];
  private counter: number = 0;

  private static instance: DeviceService;

  private constructor() {
    this.loadDevices();
  }

  public static getInstance(): DeviceService {
    if (!DeviceService.instance) {
      console.info("Creating new DeviceService instance");
      DeviceService.instance = new DeviceService();
    }
    return DeviceService.instance;
  }

  private async loadDevices(): Promise<void> {
    try {
      const projectPathToData = Deno.cwd() + "/data";
      const filePath = projectPathToData + "/source/results/handhelds.json";

      // sync to force the file to be read before showing any pages
      this.devices = JSON.parse(
        Deno.readTextFileSync(filePath),
      );

      // deduplicate tags
      this.tags = this.devices.flatMap((device) => device.tags).filter(
        (tag, index, self) =>
          index === self.findIndex((t) => t.slug === tag.slug),
      ).sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error("Failed to load devices:", error);
      this.devices = [];
    }
    console.info("Loaded devices:", this.devices.length);
  }

  public getAllDevices(): Device[] {
    this.counter++;
    console.info(
      `${new Date().toISOString()} - Getting all devices ${this.counter}`,
    );
    return this.devices;
  }

  public searchDevices(
    query: string,
    category: "all" | "low" | "mid" | "high" = "all",
    sortBy:
      | "all"
      | "highly-ranked"
      | "new-arrivals"
      | "high-low-price"
      | "low-high-price"
      | "alphabetical"
      | "reverse-alphabetical" = "all",
    filter:
      | "all"
      | "upcoming"
      | "personal-picks" = "all",
    tags: TagModel[] = [],
    pageNumber: number = 1,
    pageSize: number = 9,
  ): { page: Device[]; totalAmountOfResults: number } {
    const lowerQuery = query.toLowerCase();

    let filteredDevices = this.devices.filter((device) => {
      if (category === "low") {
        return device.pricing.category === "low" && (
          device.name.sanitized.toLowerCase().includes(lowerQuery) ||
          device.name.raw.toLowerCase().includes(lowerQuery) ||
          device.brand.raw.toLowerCase().includes(lowerQuery) ||
          device.os.raw.toLowerCase().includes(lowerQuery)
        );
      }

      if (category === "mid") {
        return device.pricing.category === "mid" && (
          device.name.sanitized.toLowerCase().includes(lowerQuery) ||
          device.name.raw.toLowerCase().includes(lowerQuery) ||
          device.brand.raw.toLowerCase().includes(lowerQuery) ||
          device.os.raw.toLowerCase().includes(lowerQuery)
        );
      }

      if (category === "high") {
        return (
          device.pricing.category === "high" &&
          (device.name.sanitized.toLowerCase().includes(lowerQuery) ||
            device.name.raw.toLowerCase().includes(lowerQuery) ||
            device.brand.raw.toLowerCase().includes(lowerQuery) ||
            device.os.raw.toLowerCase().includes(lowerQuery))
        );
      }

      return (
        device.name.sanitized.toLowerCase().includes(lowerQuery) ||
        device.name.raw.toLowerCase().includes(lowerQuery) ||
        device.brand.raw.toLowerCase().includes(lowerQuery) ||
        device.os.raw.toLowerCase().includes(lowerQuery)
      );
    });

    if (filter === "upcoming") {
      filteredDevices = filteredDevices.filter((device) =>
        device.released.raw?.toLowerCase().includes("upcoming")
      );
    }

    if (filter === "personal-picks") {
      filteredDevices = filteredDevices.filter((device) =>
        personalPicks.includes(device.name.sanitized)
      );
    }

    const currentYear = new Date().getFullYear();
    if (sortBy === "new-arrivals") {
      // filter on last 2 years
      filteredDevices = filteredDevices.filter((device) => {
        // where mentionedDate is a valid date
        if (!device.released.mentionedDate) return false;

        const mentionedDate = new Date(device.released.mentionedDate);
        if (!mentionedDate) return false;

        const year = mentionedDate.getFullYear();
        return year === currentYear || year === currentYear - 1;
      });
    }

    if (sortBy === "high-low-price") {
      filteredDevices = filteredDevices.filter((device) =>
        device.pricing.average
      );
    }

    if (sortBy === "low-high-price") {
      filteredDevices = filteredDevices.filter((device) =>
        device.pricing.average
      );
    }

    // filter by tags. Device must have all tags in the array.
    if (tags.length > 0) {
      filteredDevices = filteredDevices.filter((device) =>
        tags.every((tag) => device.tags.some((t) => t.slug === tag.slug))
      );
    }

    const sortedDevices = filteredDevices.sort((a, b) => {
      switch (sortBy) {
        case "new-arrivals":
          return (
            (new Date(b.released.mentionedDate ?? new Date())).getTime() -
            (new Date(a.released.mentionedDate ?? new Date())).getTime()
          );
        case "highly-ranked":
          return (b.totalRating) -
            (a.totalRating);
        case "alphabetical":
          return a.name.raw.localeCompare(b.name.raw);
        case "reverse-alphabetical":
          return b.name.raw.localeCompare(a.name.raw);
        case "high-low-price":
          return (b.pricing.average ?? -1) - (a.pricing.average ?? -1);
        case "low-high-price":
          return (a.pricing.average ?? -1) - (b.pricing.average ?? -1);
        default:
          return query !== ""
            ? (new Date(b.released.mentionedDate ?? new Date())).getTime() -
              (new Date(a.released.mentionedDate ?? new Date())).getTime()
            : 0;
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

  public getDeviceByName(sanitizedName: string): Device | null {
    return this.devices.find((device) =>
      device.name.sanitized === sanitizedName
    ) ?? null;
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
        const scoreA = RatingsService.getSimilarityScore(a, currentDevice);
        const scoreB = RatingsService.getSimilarityScore(b, currentDevice);
        return scoreB - scoreA;
      })
      .slice(0, limit);
  }

  public getpersonalPicks(): Device[] {
    return this.devices
      .filter((device) => personalPicks.includes(device.name.sanitized))
      .sort((a, b) =>
        personalPicks.indexOf(a.name.sanitized) -
        personalPicks.indexOf(b.name.sanitized)
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
        return year === currentYear;
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
        device.released.raw?.toLowerCase().includes("upcoming")
      )
      .slice(0, 4);
  }

  public getHighlyRated(): Device[] {
    // get the 4 highest rated devices that are not upcoming and have a price under $500
    return this.devices
      .filter((device) =>
        device.totalRating &&
        device.pricing.category === "mid" &&
        !device.released.raw?.toLowerCase().includes("upcoming")
      )
      .sort((a, b) => b.totalRating - a.totalRating)
      .slice(0, 4);
  }

  static getOsIconComponent(os: string): VNode<JSX.SVGAttributes> | string {
    switch (os) {
      case "ph-factory":
        return PiFactory({});
      case "ph-steam-logo":
        return PiSteamLogo({});
      case "ph-android-logo":
        return PiAndroidLogo({});
      case "ph-apple-logo":
        return PiAppleLogo({});
      case "ph-linux-logo":
        return PiLinuxLogo({});
      case "ph-windows-logo":
        return PiWindowsLogo({});
      case "ph-brackets-angle":
        return PiBracketsAngle({});
      case "ph-brackets-square":
        return PiBracketsSquare({});
      case "ph-brackets-curly":
        return PiBracketsCurly({});
      case "ph-brackets-round":
        return PiBracketsRound({});
      case "ph-rainbow":
        return PiRainbow({});
      case "ph-minus-square":
        return PiMinusSquare({});
      case "ph-joystick":
        return PiJoystick({});
      case "ph-scissors":
        return PiScissors({});
      case "ph-code":
        return PiCode({});
      case "👾": //vnode of emoji
        return "👾";
      default:
        return PiEmpty({});
    }
  }

  static getPropertyIconByBool(
    bool: boolean | null | undefined,
  ): VNode<JSX.SVGAttributes> {
    return bool
      ? PiCheckCircleFill({
        style: {
          color: "#22c55e",
          fontSize: "1.5rem",
        },
      })
      : PiXCircle({
        style: {
          color: "#ef4444",
          fontSize: "1.5rem",
        },
      });
  }

  static getPropertyIconByCharacter(
    char: "✅" | "❌" | "?" | string | null,
  ): VNode<JSX.SVGAttributes> {
    if (char === "✅") {
      return PiCheckCircleFill({
        style: {
          color: "#22c55e",
          fontSize: "1.5rem",
        },
      });
    }
    if (char === "❌") {
      return PiXCircle({
        style: {
          color: "#ef4444",
          fontSize: "1.5rem",
        },
      });
    }

    if (char === "?" || char === null) {
      return PiQuestionFill({
        style: {
          color: "#3155bc",
          fontSize: "1.5rem",
        },
      });
    }

    return PiEmpty({});
  }

  static getCoolingIcons(
    cooling: Cooling,
  ): { icon: VNode<JSX.SVGAttributes>; tooltip: string }[] {
    const icons: { icon: VNode<JSX.SVGAttributes>; tooltip: string }[] = [];

    if (cooling.hasHeatsink) {
      icons.push({ icon: PiTabs({}), tooltip: "Heat sink" });
    }

    if (cooling.hasFan) {
      icons.push({ icon: PiFan({}), tooltip: "Fan" });
    }

    if (cooling.hasHeatPipe) {
      icons.push({ icon: PiPipe({}), tooltip: "Heat Pipe" });
    }

    if (cooling.hasVentilationCutouts) {
      icons.push({ icon: PiListThin({}), tooltip: "Ventilation Cutouts" });
    }

    if (icons.length === 0) {
      icons.push({ icon: PiEmpty({}), tooltip: "None" });
    }

    return icons;
  }

  static getReleaseDate(device: Device): string {
    if (!device.released.mentionedDate) return "";
    return new Date(device.released.mentionedDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  static getEmbedUrl(url: string): string {
    if (url.includes("youtube.com")) {
      const videoId = url.split("v=")[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return url;
  }

  // Calculate a score for the device based on its performance and features.
  // The score is a combination of the performance rating and the features score.
  // The performance rating is between 0 and 10, and the features score is between 0 and 10.
  // The final score is a combination of the performance rating and the features score.
  // The final score is between 0 and 10.
  static calculateScore(device: Device): number {
    // Use the device's performance rating (assumed to be between 0 and 10)
    const performanceScore = device.performance?.normalizedRating ?? 1;

    // Define individual binary features – each feature is worth up to 10 points.
    // You can adjust these checks or add more features as required.
    const features = {
      // Display features
      hasHDScreen: device.screen.ppi?.[0] && device.screen.ppi[0] >= 200
        ? 10
        : 0,
      hasGoodScreenSize: device.screen.size && device.screen.size >= 5 ? 10 : 0,
      hasQualityPanel: (device.screen.type?.type === "IPS" ||
          device.screen.type?.type === "OLED" ||
          device.screen.type?.type === "AMOLED")
        ? 10
        : 0,

      // Performance-related
      hasGoodCPU: device.cpus?.[0]?.cores && device.cpus[0].cores >= 4 ? 10 : 0,
      hasGoodRAM: device.ram?.sizes?.[0] && device.ram.sizes[0] >= 4 ? 10 : 0,
      hasGoodCooling: device.cooling.raw?.toLowerCase().includes("fan")
        ? 10
        : 0,

      // Connectivity features
      hasWifi: device.connectivity.hasWifi ? 10 : 0,
      hasBluetooth: device.connectivity.hasBluetooth ? 10 : 0,
      hasHDMI: device.outputs.videoOutput?.hasHdmi ? 10 : 0,

      // Controls
      hasAnalogs: device.controls.analogs?.dual ? 10 : 0,
      hasGoodButtons: device.controls.shoulderButtons?.L2 ? 10 : 0,

      // Extra features
      // Check for a reasonably good battery (e.g., 3000 mAh or more)
      hasGoodBattery:
        device.battery?.capacity && device.battery.capacity >= 3000 ? 10 : 0,
      // Check the build quality based on the material (metal or aluminum is preferred)
      hasGoodBuild: device.shellMaterial &&
          (device.shellMaterial.isMetal || device.shellMaterial.isAluminum)
        ? 10
        : 0,
    };

    // Calculate the total features score and normalize it.
    // Maximum points is the number of features * 10.
    const maxFeaturePoints = Object.keys(features).length * 10;
    const featuresScore = Object.values(features).reduce(
      (sum, value) => sum + value,
      0,
    );
    const normalizedFeaturesScore = (featuresScore / maxFeaturePoints) * 10;

    // Combine performance and features with equal weighting (50% each).
    const finalScore = (performanceScore * 0.5) +
      (normalizedFeaturesScore * 0.5);

    // Ensure the final score is between 0 and 10.
    return Math.max(0, Math.min(10, finalScore));
  }

  getAllTags(): TagModel[] {
    return this.tags;
  }

  getDevicesWithTags(tags: TagModel[]): Device[] {
    return this.devices.filter((device) =>
      tags.every((tag) => device.tags.some((t) => t.slug === tag.slug))
    );
  }

  getTagBySlug(tagSlug: string): TagModel | null {
    return this.tags.find((tag) => tag.slug === tagSlug) ?? null;
  }

  static getUptoSystemA(device: Device): SystemRating | null {
    const systemRatings = device.systemRatings;
    if (systemRatings.length === 0) {
      return null;
    }

    // if all ratings are A, return null
    if (systemRatings.every((rating) => rating.ratingMark === "A")) {
      return {
        ratingMark: "all",
        system: EmulationSystem.All,
        ratingNumber: null,
      };
    }

    const aRatings = systemRatings.filter((rating) =>
      rating.ratingMark === "A"
    );
    if (aRatings.length === 0) {
      return null;
    }

    const mostDifficultSystem = aRatings.reduce((prev, current) =>
      EmulationSystemOrder[prev.system] > EmulationSystemOrder[current.system]
        ? prev
        : current
    );

    return mostDifficultSystem;
  }

  static getUptoSystemCOrLower(device: Device): SystemRating | null {
    const systemRatings = device.systemRatings;
    if (systemRatings.length === 0) {
      return null;
    }

    // Define rating priority (highest to lowest)
    const ratingPriority = ["C", "D", "E", "F"];
    
    // Try each rating in priority order
    for (const targetRating of ratingPriority) {
      const matchingRatings = systemRatings.filter(
        (rating) => rating.ratingMark === targetRating
      );
      
      if (matchingRatings.length > 0) {
        // If we found systems with this rating, return the easiest one
        return matchingRatings.reduce((prev, current) =>
          EmulationSystemOrder[prev.system] > EmulationSystemOrder[current.system]
            ? prev
            : current
        );
      }
    }

    return null;
  }
}
