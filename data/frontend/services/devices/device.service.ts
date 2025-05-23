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
import {
  createSuperUserPocketBaseService,
  PocketBaseService,
} from "../../../pocketbase/pocketbase.service.ts";
import { Device } from "../../contracts/device.model.ts";
import {
  EmulationSystem,
  EmulationSystemOrder,
} from "../../enums/emulation-system.ts";
import { personalPicks } from "../../enums/personal-picks.ts";
import { Cooling } from "../../models/cooling.model.ts";
import { SystemRating } from "../../models/system-rating.model.ts";
import { TagModel } from "../../models/tag.model.ts";
import { RatingsService } from "./ratings.service.ts";

export class DeviceService {
  private pocketBaseService: PocketBaseService;
  private static instance: DeviceService;

  private constructor(pocketBaseService: PocketBaseService) {
    this.pocketBaseService = pocketBaseService;
  }

  public static async getInstance(): Promise<DeviceService> {
    if (!DeviceService.instance) {
      console.info("Creating new DeviceService instance");

      const pbService = await createSuperUserPocketBaseService(
        Deno.env.get("POCKETBASE_SUPERUSER_EMAIL")!,
        Deno.env.get("POCKETBASE_SUPERUSER_PASSWORD")!,
        Deno.env.get("POCKETBASE_URL")!,
      );

      DeviceService.instance = new DeviceService(pbService);
    }
    return DeviceService.instance;
  }

  public async getAllDevices(): Promise<Device[]> {
    return (await this.pocketBaseService.getAll("devices")).map((device) =>
      device.deviceData
    );
  }

  public async getAllTags(): Promise<TagModel[]> {
    return await this.pocketBaseService.getAll("tags");
  }

  public async searchDevices(
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
  ): Promise<{ page: Device[]; totalAmountOfResults: number }> {
    const lowerQuery = query.toLowerCase();
    let filterString = "";

    // Build filter string based on category
    if (category !== "all") {
      filterString += `deviceData.pricing.category = "${category}"`;
    }

    // Add search query filter
    if (query) {
      if (filterString) filterString += " && ";
      filterString +=
        `(deviceData.name.sanitized ~ "${lowerQuery}" || deviceData.name.raw ~ "${lowerQuery}" || deviceData.brand.raw ~ "${lowerQuery}" || deviceData.os.raw ~ "${lowerQuery}")`;
    }

    // Add filter for upcoming devices
    if (filter === "upcoming") {
      if (filterString) filterString += " && ";
      filterString += `deviceData.released.raw ~ "upcoming"`;
    }

    // Add filter for personal picks
    if (filter === "personal-picks") {
      if (filterString) filterString += " && ";
      filterString += personalPicks.map((pick) => `id = "${pick}"`).join(
        " || ",
      );
    }

    // Add tag filters
    if (tags.length > 0) {
      if (filterString) filterString += " && ";
      filterString += `(${tags.map((tag) => `tags~"${tag.id}"`).join(" && ")})`;
    }

    // Build sort string
    let sortString = "";
    switch (sortBy) {
      case "new-arrivals":
        sortString = "-deviceData.released.mentionedDate";
        break;
      case "highly-ranked":
        sortString = "-deviceData.totalRating";
        break;
      case "alphabetical":
        sortString = "deviceData.name.raw";
        break;
      case "reverse-alphabetical":
        sortString = "-deviceData.name.raw";
        break;
      case "high-low-price":
        sortString = "-deviceData.pricing.average";
        break;
      case "low-high-price":
        sortString = "deviceData.pricing.average";
        break;
      default:
        sortString = "-deviceData.released.mentionedDate";
    }

    const result = await this.pocketBaseService.getList(
      "devices",
      pageNumber,
      pageSize,
      {
        filter: filterString,
        sort: sortString,
        expand: "",
      },
    );

    return {
      page: result.items.map((device) => device.deviceData),
      totalAmountOfResults: result.totalItems,
    };
  }

  public async getDeviceByName(sanitizedName: string): Promise<Device | null> {
    const result = await this.pocketBaseService.getList(
      "devices",
      1,
      1,
      {
        filter: `deviceData.name.sanitized = "${sanitizedName}"`,
        sort: "",
        expand: "",
      },
    );
    return result.items[0]?.deviceData || null;
  }

  public async getSimilarDevices(
    sanitizedName: string | null,
    limit: number = 4,
  ): Promise<Device[]> {
    if (!sanitizedName) return [];

    const currentDevice = await this.getDeviceByName(sanitizedName);
    if (!currentDevice) return [];

    const allDevices = await this.getAllDevices();
    return allDevices
      .filter((device) => device.name.sanitized !== sanitizedName)
      .sort((a, b) => {
        const scoreA = RatingsService.getSimilarityScore(a, currentDevice);
        const scoreB = RatingsService.getSimilarityScore(b, currentDevice);
        return scoreB - scoreA;
      })
      .slice(0, limit);
  }

  public async getPersonalPicks(amount: number = 5): Promise<Device[]> {
    const personalPickTag = await this.getTagBySlug("personal-pick");
    const personalPickTagId = personalPickTag!.id;

    const result = await this.pocketBaseService.getList(
      "devices",
      1,
      amount,
      {
        filter: `tags~"${personalPickTagId}"`,
        sort: "-deviceData.released.mentionedDate",
        expand: "",
      },
    );
    return result.items.map((device) => device.deviceData);
  }

  public async getNewArrivals(amount: number = 5): Promise<Device[]> {
    const currentYear = new Date().getFullYear();
    const result = await this.pocketBaseService.getList(
      "devices",
      1,
      amount,
      {
        filter: `deviceData.released.mentionedDate >= "${currentYear}-01-01"`,
        sort: "-deviceData.released.mentionedDate",
        expand: "",
      },
    );
    return result.items.map((device) => device.deviceData);
  }

  public async getUpcoming(amount: number = 5): Promise<Device[]> {
    const result = await this.pocketBaseService.getList(
      "devices",
      1,
      amount,
      {
        filter: `deviceData.released ~ 'upcoming'`,
        sort: "",
        expand: "",
      },
    );
    return result.items.map((device) => device.deviceData);
  }

  public async getHighlyRated(amount: number = 5): Promise<Device[]> {
    const result = await this.pocketBaseService.getList(
      "devices",
      1,
      amount,
      {
        filter:
          `totalRating > 0 && pricing.category = "mid" && deviceData.released.raw!~"upcoming"`,
        sort: "-totalRating",
        expand: "",
      },
    );
    return result.items.map((device) => device.deviceData);
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

  public async getDevicesWithTags(tags: TagModel[]): Promise<Device[]> {
    const filterString = tags.map((tag) => `tags ~ "${tag.id}"`).join(
      " && ",
    );
    const result = await this.pocketBaseService.getAll(
      "devices",
      {
        filter: filterString,
        expand: "",
        sort: "",
      },
    );
    return result.map((device) => device.deviceData);
  }

  public async getTagBySlug(tagSlug: string): Promise<TagModel | null> {
    const result = await this.pocketBaseService.getList(
      "tags",
      1,
      1,
      {
        filter: `slug = "${tagSlug}"`,
        sort: "",
        expand: "",
      },
    );
    return result.items[0] || null;
  }

  public async getTagsBySlugs(slugs: string[]): Promise<TagModel[]> {
    const result = await this.pocketBaseService.getList(
      "tags",
      1,
      1,
      {
        filter: `slug ~ "${slugs.join(" || ")}"`,
        sort: "",
        expand: "",
      },
    );
    return result.items;
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
        (rating) => rating.ratingMark === targetRating,
      );

      if (matchingRatings.length > 0) {
        // If we found systems with this rating, return the easiest one
        return matchingRatings.reduce((prev, current) =>
          EmulationSystemOrder[prev.system] >
              EmulationSystemOrder[current.system]
            ? prev
            : current
        );
      }
    }

    return null;
  }
}
