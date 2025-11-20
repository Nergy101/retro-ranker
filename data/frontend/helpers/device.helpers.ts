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
import { Device } from "../contracts/device.model.ts";
import {
  EmulationSystem,
  EmulationSystemOrder,
} from "../enums/emulation-system.ts";
import { Cooling } from "../models/cooling.model.ts";
import { SystemRating } from "../models/system-rating.model.ts";

export class DeviceHelpers {
  static getOsIconComponent(os: string) {
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
  ) {
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
  ) {
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
  ): { icon: any; tooltip: string }[] {
    const icons: { icon: any; tooltip: string }[] = [];

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
