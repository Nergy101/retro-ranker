import {
  Device,
} from "./device.model.ts";
import { EmulationTier } from "./enums/EmulationTier.ts";

import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";

const parseOsIcons = (os: string): string[] => {
  const lowerOs = os.toLowerCase();
  const icons: string[] = [];

  if (lowerOs.includes("android")) icons.push("ph ph-android-logo");
  if (lowerOs.includes("ios")) icons.push("ph ph-apple-logo");
  if (lowerOs.includes("windows")) icons.push("ph ph-windows-logo");
  if (lowerOs.includes("macos")) icons.push("ph ph-apple-logo");
  if (lowerOs.includes("linux")) icons.push("ph ph-linux-logo");

  return icons.length ? icons : ["ph ph-question"];
};

// Helper function to parse performance rating
const parsePerformanceRating = (
  text: string,
): {
  rating: number;
  normalizedRating: number;
  tier: EmulationTier;
  maxEmulation: string;
} => {
  const starCount = (text.match(/⭐️/g) || []).length;
  const explosionCount = (text.match(/💥/g) || []).length;
  const fireCount = (text.match(/🔥/g) || []).length;

  let rating = 0;
  const tier = text as EmulationTier;
  let maxEmulation = "";

  if (starCount) {
    rating = starCount; // 1-5
    maxEmulation = [
      "GB/GBC/GG/NES/SMS at full speed",
      "Most GBA & Genesis, some SNES playable",
      "Full GBA & Genesis, most SNES/PS1 playable",
      "Full SNES/PS1, most DS, some N64/DC/PSP",
      "Most DS/N64/PSP/DC, some Saturn",
    ][starCount - 1];
  } else if (explosionCount) {
    rating = 5 + explosionCount; // 6-10
    maxEmulation = [
      "Full DS/N64/PSP/DC, most Saturn",
      "Full Saturn, some GameCube",
      "Most GameCube, some Wii/3DS",
      "Full GameCube, most Wii/3DS, some PS2/Wii U",
      "Full GameCube/Wii, most 3DS/PS2, some Wii U",
    ][explosionCount - 1];
  } else if (fireCount) {
    rating = 10 + fireCount; // 11-15
    maxEmulation = [
      "Full 3DS/PS2, most Wii U, some Switch",
      "Most Switch, some PS3",
      "Full Switch, most PS3",
      "Full PS3",
      "Beyond!",
    ][fireCount - 1];
  }

  // Normalize rating from 0-15 to 0-10
  const normalizedRating = (rating / 15) * 10;

  return {
    rating, // Original rating (0-15)
    normalizedRating: Number(normalizedRating.toFixed(1)), // Normalized rating (0-10) with one decimal
    tier,
    maxEmulation,
  };
};

const parsePrices = (priceText: string): number => {
  const priceNumber = priceText.match(/\d+/)?.[0];
  return priceNumber ? parseInt(priceNumber) : 0;
};

const getPricingCategory = (priceText: string): string => {
  if (priceText.includes("Discontinued")) return "discontinued";

  const priceNumber = parsePrices(priceText);
  if (priceNumber === 0) return "unknown";
  if (priceNumber < 100) return "budget";
  if (priceNumber < 200) return "mid-range";
  return "high-end";
};

export function parseHandheldsHtml(filePath: string): Device[] {
  const devices: Device[] = [];
  const text = Deno.readTextFileSync(filePath);

  const $ = cheerio.load(text);

  const table = $("tbody");
  if (!table.length) return devices;

  // Get all rows
  const rows = $("tr", table);

  // Get headers from first row's td elements
  const headers: string[] = [];
  const firstRow = rows.first();
  firstRow.find("td").each((_, el) => {
    const headerText = $(el).text().trim();
    if (headerText && !headerText.includes("Donations welcome")) {
      headers.push(headerText);
    }
  });

  const getRating = (value: string) => {
    if (value.includes("A")) return "A";
    if (value.includes("B")) return "B";
    if (value.includes("C")) return "C";
    if (value.includes("D")) return "D";
    if (value.includes("F")) return "F";
    return "N/A";
  };

  // Process data rows (skip first row which contains headers)
  rows.slice(1).each((_, row) => {
    const device: Partial<Device> = {};
    device.systemRatings = [];
    device.connectivity = {
      hasWifi: false,
      hasBluetooth: false,
      hasNFC: false,
      hasUSB: false,
      hasDisplayPort: false,
      hasVGA: false,
      hasDVI: false,
      hasHDMI: false,
    };

    $(row).find("td").each((colIndex, cell) => {
      let value: string;

      value = $(cell).text().trim();

      // Map column index to device property based on known positions
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
          device.released = value;
          break;
        case 5:
          device.formFactor = value;
          break;
        case 6:
          device.os = value;
          device.osIcons = parseOsIcons(value);
          break;
        case 7:
          device.performanceRating = parsePerformanceRating(value);
          break;
        case 8:
          device.systemRatings.push({
            system: "Game Boy",
            rating: getRating(value),
          });
          break;
        case 9:
          device.systemRatings.push({
            system: "NES",
            rating: getRating(value),
          });
          break;
        case 10:
          device.systemRatings.push({
            system: "Genesis",
            rating: getRating(value),
          });
          break;
        case 11:
          device.systemRatings.push({
            system: "Game Boy Advance",
            rating: getRating(value),
          });
          break;
          case 13:
            device.systemRatings.push({
              system: "SNES",
              rating: getRating(value),
            });
            break;
        case 13:
          device.systemRatings.push({
            system: "PS1",
            rating: getRating(value),
          });
          break;
        case 14:
          device.systemRatings.push({
            system: "Nintendo DS",
            rating: getRating(value),
          });
          break;
        case 15:
          device.systemRatings.push({
            system: "Nintendo 64",
            rating: getRating(value),
          });
          break;
        case 16:
          device.systemRatings.push({
            system: "Dreamcast",
            rating: getRating(value),
          });
          break;
        case 17:
          device.systemRatings.push({
            system: "PSP",
            rating: getRating(value),
          });
          break;
        case 18:
          device.systemRatings.push({
            system: "Saturn",
            rating: getRating(value),
          });
          break;
        case 19:
          device.systemRatings.push({
            system: "GameCube",
            rating: getRating(value),
          });
          break;
        case 20:
          device.systemRatings.push({
            system: "Wii",
            rating: getRating(value),
          });
          break;
        case 21:
          device.systemRatings.push({
            system: "3DS",
            rating: getRating(value),
          });
          break;
        case 22:
          device.systemRatings.push({
            system: "PS2",
            rating: getRating(value),
          });
          break;
        case 23:
          device.systemRatings.push({
            system: "Wii U",
            rating: getRating(value),
          });
          break;
        case 24:
          device.systemRatings.push({
            system: "Switch",
            rating: getRating(value),
          });
          break;
        case 25:
          device.systemRatings.push({
            system: "PS3",
            rating: getRating(value),
          });
          break;
        case 26:
          device.systemOnChip = value;
          break;
        case 25:
          device.cpu = value;
          break;
        case 27:
          device.cpuCores = parseInt(value) || 0;
          break;
        case 28:
          device.cpuThreads = parseInt(value) || 0;
          break;
        case 29:
          device.cpuClockSpeed = value;
          break;
        case 30:
          device.architecture = value;
          break;
        case 31:
          device.gpu = value;
          break;
        case 32:
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
          device.pricingCategory = getPricingCategory(value);
          break;
          // Add more mappings as needed
      }
    });

    if (device.name) {
      devices.push(device as Device);
    }
  });

  return devices;
}

// Cache the devices after initial load
let deviceCache: Device[] | null = null;

export function getAllDevices(): Device[] {
  if (!deviceCache) {
    deviceCache = parseHandheldsHtml("./data/handhelds.html");
  }
  return deviceCache;
}

export function searchDevices(query: string): Device[] {
  const devices = getAllDevices();
  const searchTerm = query.toLowerCase();

  return devices.filter((device) =>
    device.name.toLowerCase().includes(searchTerm) ||
    device.brand.toLowerCase().includes(searchTerm) ||
    device.notes.toLowerCase().includes(searchTerm) ||
    device.pros.some((pro) => pro.toLowerCase().includes(searchTerm)) ||
    device.cons.some((con) => con.toLowerCase().includes(searchTerm))
  );
}

export function getDeviceByName(
  name: string,
): Device | undefined {
  const devices = getAllDevices();
  return devices.find((device) => device.sanitizedName === name);
}

export function getSimilarDevices(
  sanitizedName: string | null,
  limit: number = 4,
): Device[] {
  if (!sanitizedName) return [];

  const devices = getAllDevices();
  const targetDevice = devices.find((d) => d.sanitizedName === sanitizedName);

  if (!targetDevice) return [];

  // Calculate similarity score based on performance rating and form factor
  return devices
    .filter((device) =>
      device.sanitizedName.toLowerCase() !== sanitizedName.toLowerCase()
    )
    .map((device) => {
      // Calculate rating difference (0-10 scale)
      const ratingDiff = Math.abs(
        device.performanceRating.normalizedRating -
          targetDevice.performanceRating.normalizedRating,
      );

      // Form factor match (binary)
      const formFactorMatch = device.formFactor === targetDevice.formFactor
        ? 1
        : 0;

      // Calculate similarity score (higher is better)
      // Rating difference is inverted (10 - diff) so higher similarity = higher score
      // Form factor match is weighted more heavily (x3)
      const similarityScore = (10 - ratingDiff) + (formFactorMatch * 3);

      return {
        ...device,
        similarityScore,
      };
    })
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit)
    .map(({ similarityScore, ...device }) => device);
}

export function getStaffPicks(): Device[] {
  const devices = getAllDevices();

  const staffPicks = [
    "rg-405m",
    "miyoo-mini-plus",
    "rg-35xx-sp",
    "steam-deck-oled",
  ];
  return devices.filter((device) => staffPicks.includes(device.sanitizedName));
}

export function getNewArrivals(): Device[] {
  const devices = getAllDevices().filter((device) =>
    !device.released.toLowerCase().includes("upcoming")
  );
  return devices.sort((a, b) => b.released.localeCompare(a.released)).slice(
    0,
    4,
  );
}

export function getUpcoming(): Device[] {
  const devices = getAllDevices().filter((device) =>
    device.released.toLowerCase().includes("upcoming")
  );
  return devices.sort((a, b) => b.released.localeCompare(a.released)).slice(
    0,
    4,
  );
}

export function getHighlyRated(): Device[] {
  const devices = getAllDevices();
  return devices
    .sort((a, b) => b.performanceRating.rating - a.performanceRating.rating)
    .slice(0, 4);
}
