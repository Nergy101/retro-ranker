import {
  Device,
  EmulationTier,
  FormFactor,
  OperatingSystem,
} from "./device.model.ts";
// import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.49/deno-dom-wasm.ts";

import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";

// Helper function to parse arrays from semicolon-separated text
const parseArrayField = (text: string): string[] => {
  if (!text) return [];
  return text.split(";").map((item) => item.trim());
};

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
): { rating: number; tier: EmulationTier; maxEmulation: string } => {
  const starCount = (text.match(/⭐️/g) || []).length;
  const explosionCount = (text.match(/💥/g) || []).length;
  const fireCount = (text.match(/🔥/g) || []).length;

  let rating = 0;
  const tier = text as EmulationTier;
  let maxEmulation = "";

  if (starCount) {
    rating = starCount;
    maxEmulation = [
      "GB/GBC/GG/NES/SMS at full speed",
      "Most GBA & Genesis, some SNES playable",
      "Full GBA & Genesis, most SNES/PS1 playable",
      "Full SNES/PS1, most DS, some N64/DC/PSP",
      "Most DS/N64/PSP/DC, some Saturn",
    ][starCount - 1];
  } else if (explosionCount) {
    rating = 5 + explosionCount;
    maxEmulation = [
      "Full DS/N64/PSP/DC, most Saturn",
      "Full Saturn, some GameCube",
      "Most GameCube, some Wii/3DS",
      "Full GameCube, most Wii/3DS, some PS2/Wii U",
      "Full GameCube/Wii, most 3DS/PS2, some Wii U",
    ][explosionCount - 1];
  } else if (fireCount) {
    rating = 10 + fireCount;
    maxEmulation = [
      "Full 3DS/PS2, most Wii U, some Switch",
      "Most Switch, some PS3",
      "Full Switch, most PS3",
      "Full PS3",
      "Beyond!",
    ][fireCount - 1];
  }

  return { rating, tier, maxEmulation };
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

  // Process data rows (skip first row which contains headers)
  rows.slice(1).each((_, row) => {
    const device: Partial<Device> = {};

    $(row).find("td").each((colIndex, cell) => {
      let value: string;

      value = $(cell).text().trim();

      // Map column index to device property based on known positions
      switch (colIndex) {
        case 0:
          break;
        case 1: {
          const sanitizedName = value.toLowerCase().replace(/[^a-z0-9]/g, '-');

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
          device.connectivity = value;
          break;
        case 52:
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
        case 56:
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
          break;
          // Add more mappings as needed
      }
    });

    if (device.name) {
      devices.push(device as Device);
    }
  });

  console.log("test", devices[1]);

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
  return devices.find((device) =>
    device.sanitizedName === name
  );
}

export function getSimilarDevices(name: string | null, limit: number = 4): Device[] {
  if (!name) return [];
  const devices = getAllDevices();
  return devices.filter((device) => device.name.toLowerCase() !== name.toLowerCase()).slice(0, limit);
}
