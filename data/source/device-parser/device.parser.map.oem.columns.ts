import { RatingsService } from "../../../services/devices/ratings.service.ts";
import { EmulationSystem } from "../../enums/EmulationSystem.ts";
import { Device } from "../../models/device.model.ts";
import {
  getPriceCurrency,
  getPricingCategory,
  parseOsIcons,
  parsePriceRange,
} from "./device.parser.helpers.ts";

export function mapOEMsColumnToDevice(
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
        icons: parseOsIcons(value),
        list: value.split(/, | \/ /),
        customFirmwares: [],
        links: [],
      };
      break;
    case 7: // custom firmware
      device.os.customFirmwares = value.split(", ");
      break;
    case 8: // performance
      device.performance = RatingsService.parsePerformanceRating(value);
      break;
      // System ratings mapping
    case 9:
      device.systemRatings?.push({
        system: EmulationSystem.GameBoy,
        ratingMark: RatingsService.parseSystemRatingMark(value),
        ratingNumber: RatingsService.parseSystemRatingNumber(value),
      });
      break;
    case 10:
      device.systemRatings?.push({
        system: EmulationSystem.NES,
        ratingMark: RatingsService.parseSystemRatingMark(value),
        ratingNumber: RatingsService.parseSystemRatingNumber(value),
      });
      break;
    case 11:
      device.systemRatings?.push({
        system: EmulationSystem.Genesis,
        ratingMark: RatingsService.parseSystemRatingMark(value),
        ratingNumber: RatingsService.parseSystemRatingNumber(value),
      });
      break;
    case 12:
      device.systemRatings?.push({
        system: EmulationSystem.GameBoyAdvance,
        ratingMark: RatingsService.parseSystemRatingMark(value),
        ratingNumber: RatingsService.parseSystemRatingNumber(value),
      });
      break;
    case 13:
      device.systemRatings?.push({
        system: EmulationSystem.SNES,
        ratingMark: RatingsService.parseSystemRatingMark(value),
        ratingNumber: RatingsService.parseSystemRatingNumber(value),
      });
      break;
    case 14:
      device.systemRatings?.push({
        system: EmulationSystem.PS1,
        ratingMark: RatingsService.parseSystemRatingMark(value),
        ratingNumber: RatingsService.parseSystemRatingNumber(value),
      });
      break;
    case 15:
      device.systemRatings?.push({
        system: EmulationSystem.NintendoDS,
        ratingMark: RatingsService.parseSystemRatingMark(value),
        ratingNumber: RatingsService.parseSystemRatingNumber(value),
      });
      break;
    case 16:
      device.systemRatings?.push({
        system: EmulationSystem.Nintendo64,
        ratingMark: RatingsService.parseSystemRatingMark(value),
        ratingNumber: RatingsService.parseSystemRatingNumber(value),
      });
      break;
    case 17:
      device.systemRatings?.push({
        system: EmulationSystem.Dreamcast,
        ratingMark: RatingsService.parseSystemRatingMark(value),
        ratingNumber: RatingsService.parseSystemRatingNumber(value),
      });
      break;
    case 18:
      device.systemRatings?.push({
        system: EmulationSystem.PSP,
        ratingMark: RatingsService.parseSystemRatingMark(value),
        ratingNumber: RatingsService.parseSystemRatingNumber(value),
      });
      break;
    case 19:
      device.systemRatings?.push({
        system: EmulationSystem.Saturn,
        ratingMark: RatingsService.parseSystemRatingMark(value),
        ratingNumber: RatingsService.parseSystemRatingNumber(value),
      });
      break;
    case 20:
      device.systemRatings?.push({
        system: EmulationSystem.GameCube,
        ratingMark: RatingsService.parseSystemRatingMark(value),
        ratingNumber: RatingsService.parseSystemRatingNumber(value),
      });
      break;
    case 21:
      device.systemRatings?.push({
        system: EmulationSystem.Wii,
        ratingMark: RatingsService.parseSystemRatingMark(value),
        ratingNumber: RatingsService.parseSystemRatingNumber(value),
      });
      break;
    case 22:
      device.systemRatings?.push({
        system: EmulationSystem.Nintendo3DS,
        ratingMark: RatingsService.parseSystemRatingMark(value),
        ratingNumber: RatingsService.parseSystemRatingNumber(value),
      });
      break;
    case 23:
      device.systemRatings?.push({
        system: EmulationSystem.PS2,
        ratingMark: RatingsService.parseSystemRatingMark(value),
        ratingNumber: RatingsService.parseSystemRatingNumber(value),
      });
      break;
    case 24:
      device.systemRatings?.push({
        system: EmulationSystem.WiiU,
        ratingMark: RatingsService.parseSystemRatingMark(value),
        ratingNumber: RatingsService.parseSystemRatingNumber(value),
      });
      break;
    case 25:
      device.systemRatings?.push({
        system: EmulationSystem.Switch,
        ratingMark: RatingsService.parseSystemRatingMark(value),
        ratingNumber: RatingsService.parseSystemRatingNumber(value),
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

      const priceRange = parsePriceRange(value);
      const averagePrice = (priceRange.min + priceRange.max) / 2;
      device.pricing = {
        ...device.pricing,
        average: averagePrice,
        category: getPricingCategory(averagePrice),
        raw: value,
        discontinued: false,
        range: {
          min: priceRange.min,
          max: priceRange.max,
        },
        currency: getPriceCurrency(value),
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
