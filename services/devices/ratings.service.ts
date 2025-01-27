import { EmulationTier } from "../../data/enums/EmulationTier.ts";
import { Device } from "../../data/models/device.model.ts";
import { Ranking } from "../../data/models/ranking.model.ts";

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
    emulationLimit: string;
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
      emulationLimit: "",
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

  public createRanking(devices: Device[]): Ranking {
    const ranking: Ranking = {
      emuPerformance: this.rankDevicesByEmuPerformance(devices),
      monitor: this.rankDevicesByMonitor(devices),
      dimensions: this.rankDevicesByDimensions(devices),
      connectivity: this.rankDevicesByConnectivity(devices),
      controls: this.rankDevicesByControls(devices),
      misc: this.rankDevicesByMisc(devices),
      all: [],
    };

    ranking.all = this.rankDevicesByAll(devices, ranking);

    return ranking;
  }

  private rankDevicesByEmuPerformance(devices: Device[]): string[] {
    const rankedDevices = devices
      .map((device) => ({
        name: device.name.sanitized,
        score: device.performance.normalizedRating ?? 0,
      }))
      .sort((a, b) => b.score - a.score);

    if (
      rankedDevices.length > 1 &&
      rankedDevices[0].score === rankedDevices[1].score
    ) {
      return ["equal"];
    }

    return rankedDevices.map((device) => device.name);
  }

  private rankDevicesByMonitor(devices: Device[]): string[] {
    const rankedDevices = devices
      .map((device) => ({
        name: device.name.sanitized,
        score: device.screen.ppi ?? 0,
      }))
      .sort((a, b) => b.score - a.score);

    if (
      rankedDevices.length > 1 &&
      rankedDevices[0].score === rankedDevices[1].score
    ) {
      return ["equal"];
    }

    return rankedDevices.map((device) => device.name);
  }

  private rankDevicesByDimensions(devices: Device[]): string[] {
    const rankedDevices = devices
      .map((device) => ({
        name: device.name.sanitized,
        score: this.calculateDimensionScore(device),
      }))
      .sort((a, b) => b.score - a.score);

    // Check for equal scores
    if (
      rankedDevices.length > 1 &&
      rankedDevices[0].score === rankedDevices[1].score
    ) {
      return ["equal"];
    }

    return rankedDevices.map((device) => device.name);
  }

  private calculateDimensionScore(device: Device): number {
    if (!device.dimensions) return 0;
    const { length, width, height } = device.dimensions;
    return (parseFloat(length) || 0) * (parseFloat(width) || 0) *
      (parseFloat(height) || 0);
  }

  private rankDevicesByConnectivity(devices: Device[]): string[] {
    const rankedDevices = devices
      .map((device) => ({
        name: device.name.sanitized,
        score: this.calculateConnectivityScore(device),
      }))
      .sort((a, b) => b.score - a.score);

    if (
      rankedDevices.length > 1 &&
      rankedDevices[0].score === rankedDevices[1].score
    ) {
      return ["equal"];
    }

    return rankedDevices.map((device) => device.name);
  }

  private calculateConnectivityScore(device: Device): number {
    const connectivity = device.connectivity;
    return [
      connectivity.hasWifi,
      connectivity.hasBluetooth,
      connectivity.hasNFC,
      connectivity.hasUSB,
      connectivity.hasUSBC,
      connectivity.hasDisplayPort,
      connectivity.hasVGA,
      connectivity.hasDVI,
      connectivity.hasHDMI,
    ].filter(Boolean).length;
  }

  private rankDevicesByControls(devices: Device[]): string[] {
    const rankedDevices = devices
      .map((device) => ({
        name: device.name.sanitized,
        score: this.calculateControlsScore(device),
      }))
      .sort((a, b) => b.score - a.score);

    if (
      rankedDevices.length > 1 &&
      rankedDevices[0].score === rankedDevices[1].score
    ) {
      return ["equal"];
    }

    return rankedDevices.map((device) => device.name);
  }

  private calculateControlsScore(device: Device): number {
    const controls = device.controls;
    return [
      controls.dPad,
      ...controls.analogs,
      ...controls.faceButtons,
      ...controls.shoulderButtons,
      ...controls.extraButtons,
    ].filter(Boolean).length;
  }

  private rankDevicesByMisc(devices: Device[]): string[] {
    return ["equal"];
    // const rankedDevices = devices
    //   .map(device => ({
    //     name: device.name.sanitized,
    //     score: this.calculateMiscScore(device),
    //   }))
    //   .sort((a, b) => b.score - a.score);

    // if (rankedDevices.length > 1 && rankedDevices[0].score === rankedDevices[1].score) {
    //   return ["equal"];
    // }

    // return rankedDevices.map(device => device.name);
  }

  private calculateMiscScore(device: Device): number {
    return 0; // Placeholder
  }

  private rankDevicesByAll(devices: Device[], ranking: Ranking): string[] {
    const deviceScores = devices.map((device) => {
      const name = device.name.sanitized;
      const score = [
        ranking.emuPerformance.indexOf(name),
        ranking.monitor.indexOf(name),
        ranking.dimensions.indexOf(name),
        ranking.connectivity.indexOf(name),
        ranking.controls.indexOf(name),
        ranking.misc.indexOf(name),
      ].reduce((acc, index) => acc + (index >= 0 ? index : devices.length), 0);
      return { name, score };
    });

    const rankedDevices = deviceScores.sort((a, b) => a.score - b.score);

    if (
      rankedDevices.length > 1 &&
      rankedDevices[0].score === rankedDevices[1].score
    ) {
      return ["equal"];
    }

    return rankedDevices.map((device) => device.name);
  }
}
