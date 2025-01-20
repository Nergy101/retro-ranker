import { Device } from "../../data/models/device.model.ts";
import { EmulationTier } from "../../data/enums/EmulationTier.ts";

export class RatingsService {
  private static instance: RatingsService;

  private constructor() {}

  public static getInstance(): RatingsService {
    if (!RatingsService.instance) {
      RatingsService.instance = new RatingsService();
    }
    return RatingsService.instance;
  }

  public parseSystemRating(value: string): string {
    if (value.includes("A")) return "A";
    if (value.includes("B")) return "B";
    if (value.includes("C")) return "C";
    if (value.includes("D")) return "D";
    if (value.includes("F")) return "F";
    return "N/A";
  }

  public parsePerformanceRating(text: string): {
    rating: number;
    normalizedRating: number;
    tier: EmulationTier;
    maxEmulation: string;
  } {
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

    return {
      rating,
      normalizedRating: Number(((rating / 15) * 10).toFixed(1)),
      tier,
      maxEmulation,
    };
  }


  public getSimilarityScore(device: Device, targetDevice: Device): number {
    let score = 0;

    // Same brand
    if (device.brand === targetDevice.brand) score += 3;

    // Similar form factor
    if (device.formFactor === targetDevice.formFactor) score += 2;

    // Similar performance tier
    if (device.performance.tier === targetDevice.performance.tier) {
      score += 2;
    }

    // Similar price category
    if (device.pricing.category === targetDevice.pricing.category) score += 1;

    return score;
  }
} 