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
import { Device } from "../../data/models/device.model.ts";
import { RatingsService } from "./ratings.service.ts";
import { Cooling } from "../../data/models/cooling.model.ts";
export class DeviceService {
  private devices: Device[] = [];
  private static instance: DeviceService;
  private ratingsService = RatingsService.getInstance();
  private personalPicks: string[] = [
    "miyoo-flip",
    "gkd-pixel-2",
    "rg-34xx",
    "switch",
    "rg-35xx-sp",
    "rg-405m",
    "miyoo-mini-plus",
    "steam-deck-oled",
    "retroid-pocket-mini",
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
          device.name.raw.toLowerCase().includes(lowerQuery) ||
          device.brand.toLowerCase().includes(lowerQuery) ||
          device.os.raw.toLowerCase().includes(lowerQuery)
        );
      }

      if (category === "mid") {
        return device.pricing.category === "mid" && (
          device.name.sanitized.toLowerCase().includes(lowerQuery) ||
          device.name.raw.toLowerCase().includes(lowerQuery) ||
          device.brand.toLowerCase().includes(lowerQuery) ||
          device.os.raw.toLowerCase().includes(lowerQuery)
        );
      }

      if (category === "high") {
        return (
          device.pricing.category === "high" &&
          (device.name.sanitized.toLowerCase().includes(lowerQuery) ||
            device.name.raw.toLowerCase().includes(lowerQuery) ||
            device.brand.toLowerCase().includes(lowerQuery) ||
            device.os.raw.toLowerCase().includes(lowerQuery))
        );
      }

      return (
        device.name.sanitized.toLowerCase().includes(lowerQuery) ||
        device.name.raw.toLowerCase().includes(lowerQuery) ||
        device.brand.toLowerCase().includes(lowerQuery) ||
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
        this.personalPicks.includes(device.name.sanitized)
      );
    }

    const currentYear = new Date().getFullYear();
    if (sortBy === "new-arrivals") {
      filteredDevices = filteredDevices.filter((device) => {
        // where mentionedDate is a valid date
        if (!device.released.mentionedDate) return false;
        const mentionedDate = new Date(device.released.mentionedDate);
        if (!mentionedDate) return false;
        const year = mentionedDate.getFullYear();
        return year === currentYear || year === currentYear - 1;
      });
    }

    const sortedDevices = filteredDevices.sort((a, b) => {
      switch (sortBy) {
        case "new-arrivals":
          return (
            (new Date(b.released.mentionedDate ?? new Date())).getTime() -
            (new Date(a.released.mentionedDate ?? new Date())).getTime()
          );
        case "highly-rated":
          return (b.performance?.normalizedRating ?? 0) -
            (a.performance?.normalizedRating ?? 0);
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
        device.released.raw?.toLowerCase().includes("upcoming")
      )
      .slice(0, 4);
  }

  public getHighlyRated(): Device[] {
    return this.devices
      .filter((device) =>
        device.performance?.normalizedRating &&
        device.performance?.normalizedRating >= 9.0 &&
        !device.released.raw?.toLowerCase().includes("upcoming")
      )
      .sort((a, b) =>
        (b.performance?.normalizedRating ?? 0) -
        (a.performance?.normalizedRating ?? 0)
      )
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
    if (char === "?") {
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
}
